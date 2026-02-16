from flask import Flask, send_from_directory
import webbrowser
import os

app = Flask(__name__, static_folder='.', static_url_path='')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    port = 5000
    webbrowser.open(f'http://localhost:{port}')
    app.run(host='0.0.0.0', port=port, debug=True)
