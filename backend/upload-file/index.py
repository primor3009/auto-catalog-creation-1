import json
import os
import base64
import uuid
import boto3
import psycopg2


def check_auth(cur, headers: dict) -> bool:
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
    if not token:
        return False
    safe = token.replace("'", "''")
    cur.execute(
        "SELECT 1 FROM admin_sessions WHERE token = '%s' AND expires_at > NOW()" % safe
    )
    return cur.fetchone() is not None


def handler(event: dict, context) -> dict:
    '''Загружает файл (фото/видео) в S3 для карточки автомобиля, требует авторизации'''
    method = event.get('httpMethod', 'GET')
    headers_cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers_cors, 'body': ''}

    if method != 'POST':
        return {'statusCode': 405, 'headers': headers_cors, 'body': json.dumps({'error': 'Method not allowed'})}

    dsn = os.environ['DATABASE_URL']
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    cur = conn.cursor()

    if not check_auth(cur, event.get('headers', {})):
        return {'statusCode': 401, 'headers': headers_cors, 'body': json.dumps({'error': 'Требуется авторизация'})}

    body = json.loads(event.get('body') or '{}')
    file_data = body.get('file', '')
    file_name = body.get('fileName', 'file')
    content_type = body.get('contentType', 'application/octet-stream')

    if ',' in file_data:
        file_data = file_data.split(',', 1)[1]

    raw = base64.b64decode(file_data)
    ext = file_name.split('.')[-1] if '.' in file_name else 'bin'
    key = f'cars/{uuid.uuid4().hex}.{ext}'

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.put_object(Bucket='files', Key=key, Body=raw, ContentType=content_type)

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

    return {
        'statusCode': 200,
        'headers': {**headers_cors, 'Content-Type': 'application/json'},
        'body': json.dumps({'url': cdn_url}),
    }
