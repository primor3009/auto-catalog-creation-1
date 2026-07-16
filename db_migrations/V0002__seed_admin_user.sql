INSERT INTO admin_users (username, password_hash)
VALUES ('admin', 'ad67f0fea53c9a6b6eeed60ddbf54988$e7ce36495308c40688ad4158842291a66ad2524ddeb728d559df2552eb4a369d')
ON CONFLICT (username) DO NOTHING;