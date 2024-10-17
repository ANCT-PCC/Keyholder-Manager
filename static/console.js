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
            recipt_id = message['recipt_id'];
            data_tr = document.createElement('tr');
            data_tr.id='data_tr_'+recipt_id;
            table_element.appendChild(data_tr);
            data_th = document.createElement('th');
            data_th.id='data_th'+recipt_id;
            data_th.textContent = recipt_id;
            data_tr.appendChild(data_th);
            data_frontnum = document.createElement('td');
            data_frontnum.id = "data_frontnum_"+recipt_id;
            data_frontnum.textContent = message['front'];
            data_tr.appendChild(data_frontnum);
            data_backnum = document.createElement('td');
            data_backnum.id="data_backnum_"+recipt_id;
            data_backnum.textContent = message['back'];
            data_tr.appendChild(data_backnum);
            data_actions = document.createElement('td');
            data_actions.id="data_actions_"+recipt_id;
            data_tr.appendChild(data_actions);
            action_complete = document.createElement('button');
            action_complete.id = 'action_complete_'+recipt_id;
            action_complete.className = 'btn btn-primary';
            action_complete.textContent = '完成した';
            action_confirm = document.createElement('button');
            action_confirm.id = 'action_complete_'+recipt_id;
            action_confirm.className = 'btn btn-primary';
            action_confirm.textContent = '絵柄を確認した';
            action_retry = document.createElement('button');
            action_retry.id = 'action_complete_'+recipt_id;
            action_retry.className = 'btn btn-primary';
            action_retry.textContent = '作りなおす';
            action_delete = document.createElement('button');
            action_delete.id = 'action_complete_'+recipt_id;
            action_delete.className = 'btn btn-primary';
            action_delete.textContent = '注文取消';
            data_actions.appendChild(action_complete);
            data_actions.appendChild(action_confirm);
            data_actions.appendChild(action_retry);
            data_actions.appendChild(action_delete);
            action_complete.addEventListener('click',(e)=>{
                console.log("完成した");
            });
            action_confirm.addEventListener('click',()=>{
                console.log("絵柄を確認した");
            });
            action_retry.addEventListener('click',()=>{
                console.log("作り直す");
            });
            action_delete.addEventListener('click',()=>{
                console.log("注文取り消し");
            });

            break;
        case 'delete':
            console.log('delete');
            data_tr = document.getElementById('data_tr_'+message['recipt_id']);
            table_element.removeChild(data_tr);
            break;
        case 'complete':
            console.log('complete');
            action_complete = document.getElementById('action_complete_'+recipt_id);
            action_confirm = document.getElementById('action_confirm_'+recipt_id);
            action_complete.disable = true;
            action_confirm.disable = false;
            break;
        case 'confirm':
            console.log('confirm');
            data_tr = document.getElementById('data_tr_'+message['recipt_id']);
            table_element.removeChild(data_tr);
            break;
        case 'retry':
            console.log('retry');
            data_tr = document.getElementById('data_tr_'+message['recipt_id']);
            table_element.removeChild(data_tr);
            break;
        default:
            console.log('error');
            break;
    }
});



const init = () => {
    //データベースから現在のタスクを取得
};





