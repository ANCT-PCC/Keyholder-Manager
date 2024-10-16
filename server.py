from flask import Flask,render_template
from flask_cors import CORS
from flask_socketio import SocketIO
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")



@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/display')
def display():
    return render_template('display.html')

if __name__ == '__main__':
    socketio.run(app)