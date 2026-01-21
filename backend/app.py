from flask import Flask, send_from_directory, jsonify, request
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
# AI API (나중에 연결)
# ========================================

# 1. 단어 → 뒷말 추천
@app.route('/api/ai/suggest-next', methods=['POST'])
def suggest_next():
    data = request.json
    word = data.get('word', '')
    
    # TODO: 실제 AI API 연결
    # from anthropic import Anthropic
    # client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))
    
    dummy = {
        '물': ['주세요', '마시고 싶어요', '차가운 걸로요', '괜찮아요', '더 주세요'],
        '밥': ['주세요', '먹고 싶어요', '배불러요', '맛있어요', '더 주세요'],
        '가요': ['집에', '병원에', '화장실에', '지금', '나중에'],
        '좋아요': ['정말', '너무', '아주', '많이'],
        '아파요': ['많이', '조금', '여기가', '계속'],
    }
    
    suggestions = dummy.get(word, ['주세요', '싶어요', '괜찮아요', '아니에요', '네'])
    
    return jsonify({'success': True, 'word': word, 'suggestions': suggestions})

# 2. 음성 인식 → 답변 추천
@app.route('/api/ai/suggest-response', methods=['POST'])
def suggest_response():
    data = request.json
    heard_text = data.get('heardText', '')
    
    # TODO: 실제 AI API 연결
    
    suggestions = ['네', '아니요', '괜찮아요', '잘 모르겠어요', '다시 말해주세요']
    
    if '먹' in heard_text or '밥' in heard_text:
        suggestions = ['네, 먹었어요', '아니요, 아직이요', '배고파요', '괜찮아요', '나중에 먹을래요']
    elif '아프' in heard_text or '아파' in heard_text:
        suggestions = ['네, 아파요', '아니요, 괜찮아요', '조금 아파요', '많이 아파요', '여기가 아파요']
    elif '괜찮' in heard_text:
        suggestions = ['네, 괜찮아요', '아니요', '조금 힘들어요', '도와주세요']
    
    return jsonify({'success': True, 'heardText': heard_text, 'suggestions': suggestions})

# 3. 이미지 분석 → 카드 생성
@app.route('/api/ai/analyze-image', methods=['POST'])
def analyze_image():
    # TODO: 실제 AI Vision API 연결
    return jsonify({'success': True, 'card': {'name': '새 카드', 'category': 'thing'}})

# 4. Adaptive Volume (스마트 음성)
@app.route('/api/ai/adaptive-volume', methods=['POST'])
def adaptive_volume():
    data = request.json
    noise_level = data.get('noiseLevel', 50)
    
    # TODO: AI로 최적 설정 계산
    if noise_level > 70:
        volume, rate = 1.5, 0.8
    elif noise_level > 50:
        volume, rate = 1.2, 0.9
    else:
        volume, rate = 1.0, 1.0
    
    return jsonify({'success': True, 'volume': volume, 'rate': rate})

# ========================================
# 서버 실행
# ========================================
if __name__ == '__main__':
    port = int(os.getenv('PORT', 3000))
    app.run(host='0.0.0.0', port=port, debug=True)