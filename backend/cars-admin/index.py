import json
import os
import psycopg2
import psycopg2.extras


def esc(s: str) -> str:
    return str(s).replace("'", "''")


def check_auth(cur, headers: dict) -> bool:
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
    if not token:
        return False
    cur.execute(
        "SELECT 1 FROM admin_sessions WHERE token = '%s' AND expires_at > NOW()" % esc(token)
    )
    return cur.fetchone() is not None


def row_to_car(row) -> dict:
    return {
        'id': row[0],
        'brand': row[1],
        'model': row[2],
        'year': row[3],
        'price': row[4],
        'bodyType': row[5],
        'fuel': row[6],
        'power': row[7],
        'acceleration': float(row[8]),
        'drive': row[9],
        'cover': row[10],
        'gallery': row[11],
        'video': row[12],
        'tag': row[13],
    }


def handler(event: dict, context) -> dict:
    '''CRUD для автомобилей каталога: список открыт всем, изменения только для авторизованных'''
    method = event.get('httpMethod', 'GET')
    headers_cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers_cors, 'body': ''}

    dsn = os.environ['DATABASE_URL']
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    cur = conn.cursor()

    cols = "id, brand, model, year, price, body_type, fuel, power, acceleration, drive, cover, gallery, video, tag"

    if method == 'GET':
        cur.execute(f"SELECT {cols} FROM cars ORDER BY id DESC")
        rows = cur.fetchall()
        return {
            'statusCode': 200,
            'headers': {**headers_cors, 'Content-Type': 'application/json'},
            'body': json.dumps([row_to_car(r) for r in rows]),
        }

    if not check_auth(cur, event.get('headers', {})):
        return {'statusCode': 401, 'headers': headers_cors, 'body': json.dumps({'error': 'Требуется авторизация'})}

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        gallery_json = json.dumps(body.get('gallery') or [])
        tag_val = "'%s'" % esc(body['tag']) if body.get('tag') else 'NULL'
        video_val = "'%s'" % esc(body['video']) if body.get('video') else 'NULL'
        cur.execute(
            f"INSERT INTO cars (brand, model, year, price, body_type, fuel, power, acceleration, drive, cover, gallery, video, tag) "
            f"VALUES ('{esc(body['brand'])}', '{esc(body['model'])}', {int(body['year'])}, {int(body['price'])}, "
            f"'{esc(body['bodyType'])}', '{esc(body['fuel'])}', {int(body['power'])}, {float(body['acceleration'])}, "
            f"'{esc(body['drive'])}', '{esc(body['cover'])}', '{esc(gallery_json)}'::jsonb, {video_val}, {tag_val}) "
            f"RETURNING {cols}"
        )
        row = cur.fetchone()
        return {
            'statusCode': 201,
            'headers': {**headers_cors, 'Content-Type': 'application/json'},
            'body': json.dumps(row_to_car(row)),
        }

    if method == 'PUT':
        body = json.loads(event.get('body') or '{}')
        car_id = int(body['id'])
        gallery_json = json.dumps(body.get('gallery') or [])
        tag_val = "'%s'" % esc(body['tag']) if body.get('tag') else 'NULL'
        video_val = "'%s'" % esc(body['video']) if body.get('video') else 'NULL'
        cur.execute(
            f"UPDATE cars SET brand='{esc(body['brand'])}', model='{esc(body['model'])}', year={int(body['year'])}, "
            f"price={int(body['price'])}, body_type='{esc(body['bodyType'])}', fuel='{esc(body['fuel'])}', "
            f"power={int(body['power'])}, acceleration={float(body['acceleration'])}, drive='{esc(body['drive'])}', "
            f"cover='{esc(body['cover'])}', gallery='{esc(gallery_json)}'::jsonb, video={video_val}, tag={tag_val}, "
            f"updated_at=NOW() WHERE id={car_id} RETURNING {cols}"
        )
        row = cur.fetchone()
        if not row:
            return {'statusCode': 404, 'headers': headers_cors, 'body': json.dumps({'error': 'Не найдено'})}
        return {
            'statusCode': 200,
            'headers': {**headers_cors, 'Content-Type': 'application/json'},
            'body': json.dumps(row_to_car(row)),
        }

    if method == 'DELETE':
        params = event.get('queryStringParameters') or {}
        car_id = int(params.get('id', 0))
        cur.execute(f"DELETE FROM cars WHERE id={car_id}")
        return {'statusCode': 200, 'headers': headers_cors, 'body': json.dumps({'success': True})}

    return {'statusCode': 405, 'headers': headers_cors, 'body': json.dumps({'error': 'Method not allowed'})}
