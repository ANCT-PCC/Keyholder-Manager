const connection = io.connect('/console');

//各種変数
var recipt_id = null; //通信用の専用の変数群
var front = null;
var back = null;

var indicate_recipt_id = null; //consoleで表示する専用の変数群
var indicate_front = null;
var indicate_back = null;

//テーブルの各要素
var data_tr = null;
var data_th = null;
var data_frontnum = null;
var data_backnum = null;
var data_actions = null;
var action_delete = null;
var action_complete = null;
var action_confirm = null;
var action_retry = null;

//各種定数
const table_element = document.getElementById('task');

document.getElementById('add_task').addEventListener('click', () => {
    //const recipt_id = document.getElementById('recipt_id').value;//伝票番号はサーバ側で生成しよう
    front = document.getElementById('front').value;
    back = document.getElementById('back').value;
    connection.emit('message', {
        action: 'add',
        recipt_id: null,
        front: front,
        back: back,
    });
});


connection.on('connect', () => {
    console.log('Connected to server');
});
connection.on('disconnect', () => {
    console.log('Disconnected from server');
});
connection.on('message', (message) => {
    console.log('Message from server:', message);
    //通信でやり取りする内容
    //↓の予定
    /*message = {
        action: 'add delete complete confirm retry',
        recipt_id: '伝票番号',
        front: '半角数字 or null',
        back: '半角数字 or null',
    }*/
    switch (message.action) {
        case 'add':
            console.log('add');
            
            break;
        case 'delete':
            console.log('delete');
            break;
        case 'complete':
            console.log('complete');
            break;
        case 'confirm':
            console.log('confirm');
            break;
        case 'retry':
            console.log('retry');
            break;
        default:
            console.log('error');
            break;
    }
});



const init = () => {
    //データベースから現在のタスクを取得
};





