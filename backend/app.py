from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

# 캐시 비활성화 (개발용)
@app.after_request
def add_no_cache(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

# ========================================
# 정적 파일 (프론트엔드)
# ========================================
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(app.static_folder, path)

# ========================================
# 헬스체크
# ========================================
@app.route('/api/health')
def health():
    return jsonify({'status': 'ok'})

# ========================================
# 서버 실행
# ========================================
if __name__ == '__main__':
    port = int(os.getenv('PORT', 3000))
    app.run(host='0.0.0.0', port=port, debug=True)