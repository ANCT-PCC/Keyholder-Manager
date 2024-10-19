from flask import Flask,render_template
from flask_cors import CORS
from flask_socketio import SocketIO
import dbc,datetime,string,json,os
app = Flask(__name__, static_folder='.', static_url_path='')
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

def init():
    dbc.sqlExecute(True,dbc.INIT_SQL_COMMAND)

#伝票番号を生成するクラス
class DenpyoNumberGenerator:
    def __init__(self, state_file='denpyo_state.json'):
        self.state_file = state_file
        self.current_hour = '00'
        self.current_number = 1
        self.current_letter_index = 0
        self.letters = string.ascii_uppercase
        self.load_state()

    def load_state(self):
        if os.path.exists(self.state_file):
            with open(self.state_file, 'r') as file:
                state = json.load(file)
                self.current_hour = state.get('current_hour', "00")
                self.current_number = state.get('current_number', 1)
                self.current_letter_index = state.get('current_letter_index', 0)

    def save_state(self):
        state = {
            'current_hour': self.current_hour,
            'current_number': self.current_number,
            'current_letter_index': self.current_letter_index
        }
        with open(self.state_file, 'w') as file:
            json.dump(state, file)

    def generate_denpyo_number(self):
        now = datetime.datetime.now()
        now_hour = now.strftime('%H') #現在の時間を取得
        hour = f'{self.current_hour:02s}' #前回の時間を取得
        if now_hour != hour:
            print('hour changed')
            print(f'now_hour: {now_hour}, hour: {hour}')
            self.current_hour = hour = now_hour #時間が変わったら時間を更新
            self.current_number = 1
            self.current_letter_index = 0
        number = f'{self.current_number:02d}'
        letter = self.letters[self.current_letter_index]

        denpyo_number = f'{hour}{number}{letter}'

        self.current_number += 1
        if self.current_number > 99:
            self.current_number = 1
            self.current_letter_index = (self.current_letter_index + 1) % len(self.letters)

        self.save_state()
        return denpyo_number


@app.route('/')
def hello():
    return app.send_static_file('main.html')

@app.route('/get_creatings')
def get_creatings():
    sql=f'''
        select * from "{dbc.TABLE_NAME}" where is_completed = "False"
    '''
    res = dbc.sqlExecute(False,sql)
    data = {
        'data': len(res)
    }
    return json.dumps(data)

@app.route('/get_confirmings')
def get_confirmings():
    sql=f'''
        select * from "{dbc.TABLE_NAME}" where is_completed = "True" and is_delivered = "False"
    '''
    res = dbc.sqlExecute(False,sql)
    data = {
        'data': len(res)
    }
    return json.dumps(data)

@app.route('/display')
def display():
    return app.send_static_file('display.html')

@app.route('/history')
def get_history():
    sql=f'''
        select receipt_id,front,back,is_completed,is_delivered from "{dbc.TABLE_NAME}"
    '''
    res = dbc.sqlExecute(False,sql)
    if len(res) == 0:
        data = {
            "data": []
        }
        return json.dumps(data)
    
    data = {
        'data': res
    }
    return json.dumps(data)

@app.route('/fixnumbers')
def fix_numbers():
    sql=f'''
        select * from "{dbc.TABLE_NAME}"
    '''
    res = dbc.sqlExecute(False,sql)
    for i in range(len(res)):
        sql=f'''
            update "{dbc.TABLE_NAME}" set receipt_id = "{i+1}" where receipt_id = "{res[i][0]}"
        '''
        dbc.sqlExecute(True,sql)
    return 'fixed'

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
    if message['action'] == 'add':
        ridGen=DenpyoNumberGenerator()
        receipt_id = ridGen.generate_denpyo_number() 
        front = message['front']
        back = message['back']
        dbc.add_task(receipt_id=receipt_id,front=front,back=back)
        #displayに対してaddをemit
        data = {
            "action": 'add',
            "receipt_id": receipt_id,
            "front": front,
            "back": back
        }

        socketio.emit('message',data,namespace='/console')
        socketio.emit('message',data,namespace='/display')

    #action==delete
    #データベースからタスクを削除
    if message['action'] == 'delete':
        dbc.delete_task(message['receipt_id'])
        data = {
            "action": 'delete',
            "receipt_id": message['receipt_id'],
            "front": None,
            "back": None
        }
        socketio.emit('message',data,namespace='/console')
        socketio.emit('message',data,namespace='/display')
    #displayに対してdeleteをemit

    #action==complete
    #データベースのタスクを完了にする
    if message['action'] == 'complete':
        dbc.complete_task(message['receipt_id'])
        data = {
            "action": 'complete',
            "receipt_id": message['receipt_id'],
            "front": None,
            "back": None
        }
        socketio.emit('message',data,namespace='/console')
        socketio.emit('message',data,namespace='/display')
        
    #displayに対してcompleteをemit

    #action==confirm
    #データベースのタスクを確認済みにする
    if message['action'] == 'confirm':
        dbc.confirm_task(message['receipt_id'])
        data = {
            "action": 'confirm',
            "receipt_id": message['receipt_id'],
            "front": None,
            "back": None
        }
        socketio.emit('message',data,namespace='/console')
        socketio.emit('message',data,namespace='/display')
    #displayに対してconfirmをemit

    #action==retry
    #データベースのタスクを完了にする
    #データベースのタスクを確認済みにする
    if message['action'] == 'retry':
        dbc.delete_task(message['receipt_id'])
        dbc.add_task(str(message['receipt_id']),str(message['front']),str(message['back']))
        
        data = {
            "action": 'retry',
            "receipt_id": message['receipt_id'],
            "front": message['front'],
            "back": message['back']
        }
        socketio.emit('message',data,namespace='/console')
        socketio.emit('message',data,namespace='/display')
    #伝票番号+Rにしてaction==addの処理をする

@socketio.on('message',namespace='/display')
def display_message(message):
    print('display:',message)
    #要るかわからんけど一応

#@app.route('/static/sound/<string:filename>')
#def test(filename):
#    return app.send_static_file(filename)

#@app.route('/static/sound/announce/mp3/<string:filename>')
#def test2(filename):
#    return app.send_static_file(f'/static/sound/announce/mp3/{filename}')


if __name__ == '__main__':
    init()
    socketio.run(app,debug=True)