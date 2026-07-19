import json
import os
import urllib.request
import urllib.parse
import urllib.error


def handler(event: dict, context) -> dict:
    '''Принимает заявку с сайта и отправляет её в Telegram'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    if method == 'GET' and event.get('queryStringParameters', {}).get('debug') == '1':
        token = os.environ.get('TELEGRAM_BOT_TOKEN')
        if not token:
            return {
                'statusCode': 500,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Токен не настроен'}),
            }
        url = f'https://api.telegram.org/bot{token}/getUpdates'
        with urllib.request.urlopen(url, timeout=10) as resp:
            data = json.loads(resp.read())
        webhook_url = f'https://api.telegram.org/bot{token}/getWebhookInfo'
        with urllib.request.urlopen(webhook_url, timeout=10) as resp:
            webhook_data = json.loads(resp.read())
        data['webhook_info'] = webhook_data
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(data, ensure_ascii=False),
        }

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    body = json.loads(event.get('body') or '{}')
    name = (body.get('name') or '').strip()
    phone = (body.get('phone') or '').strip()
    comment = (body.get('comment') or '').strip()

    if len(name) < 2 or len(phone) < 6:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Заполните имя и телефон'}),
        }

    token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')

    if not token or not chat_id:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Telegram не настроен'}),
        }

    text = (
        '🚗 Новая заявка с сайта МашинаТут\n\n'
        f'👤 Имя: {name}\n'
        f'📞 Телефон: {phone}\n'
    )
    if comment:
        text += f'💬 Комментарий: {comment}\n'

    url = f'https://api.telegram.org/bot{token}/sendMessage'
    data = urllib.parse.urlencode({'chat_id': chat_id, 'text': text}).encode()
    req = urllib.request.Request(url, data=data, method='POST')

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            resp.read()
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8', errors='ignore')
        return {
            'statusCode': 502,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Telegram API отклонил запрос', 'details': error_body}),
        }
    except urllib.error.URLError as e:
        return {
            'statusCode': 502,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Не удалось связаться с Telegram', 'details': str(e.reason)}),
        }

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        'body': json.dumps({'success': True}),
    }