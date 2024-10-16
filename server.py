from flask import Flask,render_template
from flask_cors import CORS
from flask_socketio import SocketIO
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")



@app.route('/')
def hello():
    return render_template('main.html')

@app.route('/display')
def display():
    return render_template('display.html')

@socketio.on('connect',namespace='/console')
def console_connect():
    print('console connected')
    #データベースからタスクを取得して送信
    #データ形式はconsole.jsを見ろ
    
@socketio.on('disconnect',namespace='/console')
def console_disconnect():
    print('console disconnected')

@socketio.on('connect',namespace='/display')
def display_connect():
    print('display connected')
    #データベースから進捗状況を取得して送信
    #伝票番号を「追加」「移動」「削除」の処理を書く
    

@socketio.on('disconnect',namespace='/display')
def display_disconnect():
    print('display disconnected')

@socketio.on('message',namespace='/console')
def console_message(message):
    print('console:',message)
    #タスクごとに処理を分岐
    #action==add
    #データベースにタスクを追加
    #伝票番号を生成してconsoleにemit
    #displayに対してaddをemit

    #action==delete
    #データベースからタスクを削除
    #displayに対してdeleteをemit

    #action==complete
    #データベースのタスクを完了にする
    #displayに対してcompleteをemit

    #action==confirm
    #データベースのタスクを確認済みにする
    #displayに対してconfirmをemit

    #action==retry
    #データベースのタスクを完了にする
    #データベースのタスクを確認済みにする
    #伝票番号+Rにしてaction==addの処理をする

@socketio.on('message',namespace='/display')
def display_message(message):
    print('display:',message)
    #要るかわからんけど一応


if __name__ == '__main__':
    socketio.run(app,debug=True)