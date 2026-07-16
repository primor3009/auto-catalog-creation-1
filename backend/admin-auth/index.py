import json
import os
import hashlib
import binascii
import secrets
import datetime
import psycopg2


def hash_password(password: str, salt: str) -> str:
    h = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return binascii.hexlify(h).decode()


def handler(event: dict, context) -> dict:
    '''Авторизация администратора: login, logout, проверка сессии'''
    method = event.get('httpMethod', 'GET')
    headers_cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers_cors, 'body': ''}

    dsn = os.environ['DATABASE_URL']
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    cur = conn.cursor()

    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')

    if method == 'POST' and action == 'login':
        body = json.loads(event.get('body') or '{}')
        username = (body.get('username') or '').strip()
        password = body.get('password') or ''

        cur.execute(
            "SELECT id, password_hash FROM admin_users WHERE username = %s" % ("'" + username.replace("'", "''") + "'")
        )
        row = cur.fetchone()

        if not row:
            return {'statusCode': 401, 'headers': headers_cors, 'body': json.dumps({'error': 'Неверный логин или пароль'})}

        user_id, password_hash = row
        salt, stored_hash = password_hash.split('$')
        check_hash = hash_password(password, salt)

        if check_hash != stored_hash:
            return {'statusCode': 401, 'headers': headers_cors, 'body': json.dumps({'error': 'Неверный логин или пароль'})}

        token = secrets.token_hex(32)
        expires = datetime.datetime.utcnow() + datetime.timedelta(days=7)
        cur.execute(
            "INSERT INTO admin_sessions (token, user_id, expires_at) VALUES ('%s', %s, '%s')"
            % (token, user_id, expires.isoformat())
        )

        return {
            'statusCode': 200,
            'headers': {**headers_cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'token': token, 'username': username}),
        }

    if method == 'GET' and action == 'check':
        token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
        if not token:
            return {'statusCode': 401, 'headers': headers_cors, 'body': json.dumps({'error': 'Нет токена'})}

        cur.execute(
            "SELECT u.username FROM admin_sessions s JOIN admin_users u ON u.id = s.user_id "
            "WHERE s.token = '%s' AND s.expires_at > NOW()" % token.replace("'", "''")
        )
        row = cur.fetchone()

        if not row:
            return {'statusCode': 401, 'headers': headers_cors, 'body': json.dumps({'error': 'Сессия истекла'})}

        return {
            'statusCode': 200,
            'headers': {**headers_cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'username': row[0]}),
        }

    if method == 'POST' and action == 'logout':
        token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
        if token:
            cur.execute("DELETE FROM admin_sessions WHERE token = '%s'" % token.replace("'", "''"))
        return {'statusCode': 200, 'headers': headers_cors, 'body': json.dumps({'success': True})}

    return {'statusCode': 400, 'headers': headers_cors, 'body': json.dumps({'error': 'Unknown action'})}
