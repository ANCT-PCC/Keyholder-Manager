const connection = io.connect('/console');

//各種変数
var receipt_id = null; //通信用の専用の変数群
var front = null;
var back = null;

var indicate_receipt_id = null; //consoleで表示する専用の変数群
var indicate_front = null;
var indicate_back = null;
var data = null;

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
var action_call = null;

//各種定数
const table_element = document.getElementById('task');


document.getElementById('add_task').addEventListener('click', () => {
    //const receipt_id = document.getElementById('receipt_id').value;//伝票番号はサーバ側で生成しよう
    front = document.getElementById('front').value;
    back = document.getElementById('back').value;
    connection.emit('message', {
        action: 'add',
        receipt_id: null,
        front: front,
        back: back,
    });
});

const init = () => {
    //一度テーブルをリセット
    while(table_element.firstChild){
        table_element.removeChild(table_element.firstChild);
    }
    
    $.ajax(
        {
          url:'http://localhost:5000/'+'history',
          type:'GET',
          dataType: "json"
    }).always(function (data){
        var data_stringify = JSON.stringify(data);
        var data_json = JSON.parse(data_stringify);
        var info = data_json['data'];
        for(var i=0;i<info.length;i++){
            if(info[i][4] == 'True'){
                continue;
            }
            console.log('add');
            receipt_id = info[i][0];
            data_tr = document.createElement('tr');
            data_tr.id='data_tr_'+receipt_id;
            table_element.appendChild(data_tr);
            data_th = document.createElement('th');
            data_th.id='data_th'+receipt_id;
            data_th.textContent = receipt_id;
            data_tr.appendChild(data_th);
            data_frontnum = document.createElement('td');
            data_frontnum.id = "data_frontnum_"+receipt_id;
            data_frontnum.textContent = info[i][1];
            data_tr.appendChild(data_frontnum);
            data_backnum = document.createElement('td');
            data_backnum.id="data_backnum_"+receipt_id;
            data_backnum.textContent = info[i][2];
            data_tr.appendChild(data_backnum);
            data_actions = document.createElement('td');
            data_actions.id="data_actions_"+receipt_id;
            data_tr.appendChild(data_actions);
            action_complete = document.createElement('button');
            action_complete.id = 'action_complete_'+receipt_id;
            action_complete.className = 'btn btn-primary';
            action_complete.textContent = '完成した';
            if(info[i][3] == 'True'){
                action_complete.disabled = true;
            }
            action_call = document.createElement('button');
            action_call.id = 'action_call_'+receipt_id;
            action_call.className = 'btn btn-info';
            action_call.textContent = '呼び出し';
            if(info[i][3] == 'False'){
                action_call.disabled = true;
            }
            action_confirm = document.createElement('button');
            action_confirm.id = 'action_confirm_'+receipt_id;
            action_confirm.className = 'btn btn-success';
            action_confirm.textContent = '絵柄を確認した';
            if(info[i][3] == 'False'){
                action_confirm.disabled = true;
            }
            action_retry = document.createElement('button');
            action_retry.id = 'action_retry_'+receipt_id;
            action_retry.className = 'btn btn-danger';
            action_retry.textContent = '作りなおす';
            if(info[i][3] == 'False'){
                action_retry.disabled = true;
            }
            action_delete = document.createElement('button');
            action_delete.id = 'action_delete_'+receipt_id;
            action_delete.className = 'btn btn-secondary';
            action_delete.textContent = '注文取消';
            data_actions.appendChild(action_complete);
            data_actions.appendChild(action_call);
            data_actions.appendChild(action_confirm);
            data_actions.appendChild(action_retry);
            data_actions.appendChild(action_delete);
            action_complete.addEventListener('click',(e)=>{
                console.log("完成した");
                e.target.disable = true;
                document.getElementById('action_confirm_'+e.target.id.slice(-5)).disabled = false;
                document.getElementById('action_retry_'+e.target.id.slice(-5)).disabled = false;
                announce(e.target.id.slice(-5));
                data = {
                    action: 'complete',
                    receipt_id: e.target.id.slice(-5),
                    front: null,
                    back: null
                }
                connection.emit('message',data)
                init();
            });
            action_call.addEventListener('click',(e)=>{
                console.log("呼び出し");
                announce(e.target.id.slice(-5));
            })
            action_confirm.addEventListener('click',(e)=>{
                console.log("絵柄を確認した");
                data = {
                    action: 'confirm',
                    receipt_id: e.target.id.slice(-5),
                    front: null,
                    back: null
                }
                connection.emit('message',data)
                location.reload();
            });
            action_retry.addEventListener('click',(e)=>{
                console.log("作り直す");
                data = {
                    action: 'retry',
                    receipt_id: e.target.id.slice(-5),
                    front: document.getElementById('data_frontnum_'+e.target.id.slice(-5)).innerHTML,
                    back: document.getElementById('data_backnum_'+e.target.id.slice(-5)).innerHTML
                }
                connection.emit('message',data)
                location.reload();
            });
            action_delete.addEventListener('click',(e)=>{
                console.log("注文取り消し");
                data = {
                    action: 'delete',
                    receipt_id: e.target.id.slice(-5),
                    front: null,
                    back: null
                }
                connection.emit('message',data)
                location.reload();
            });
        }
    });
};


connection.on('connect', () => {
    console.log('Connected to server');
    init();
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
        receipt_id: '伝票番号',
        front: '半角数字 or null',
        back: '半角数字 or null',
    }*/
    switch (message.action) {
        case 'add':
            console.log('add');
            receipt_id = message['receipt_id'];
            document.getElementById('generated_receipt_id').textContent = receipt_id;
            data_tr = document.createElement('tr');
            data_tr.id='data_tr_'+receipt_id;
            table_element.appendChild(data_tr);
            data_th = document.createElement('th');
            data_th.id='data_th'+receipt_id;
            data_th.textContent = receipt_id;
            data_tr.appendChild(data_th);
            data_frontnum = document.createElement('td');
            data_frontnum.id = "data_frontnum_"+receipt_id;
            data_frontnum.textContent = message['front'];
            data_tr.appendChild(data_frontnum);
            data_backnum = document.createElement('td');
            data_backnum.id="data_backnum_"+receipt_id;
            data_backnum.textContent = message['back'];
            data_tr.appendChild(data_backnum);
            data_actions = document.createElement('td');
            data_actions.id="data_actions_"+receipt_id;
            data_tr.appendChild(data_actions);
            action_complete = document.createElement('button');
            action_complete.id = 'action_complete_'+receipt_id;
            action_complete.className = 'btn btn-primary';
            action_complete.textContent = '完成した';
            action_call = document.createElement('button');
            action_call.id = 'action_call_'+receipt_id;
            action_call.className = 'btn btn-info';
            action_call.textContent = '呼び出し';
            action_call.disabled = true;
            action_confirm = document.createElement('button');
            action_confirm.id = 'action_confirm_'+receipt_id;
            action_confirm.className = 'btn btn-success';
            action_confirm.textContent = '絵柄を確認した';
            action_confirm.disabled = true;
            action_retry = document.createElement('button');
            action_retry.id = 'action_retry_'+receipt_id;
            action_retry.className = 'btn btn-danger';
            action_retry.textContent = '作りなおす';
            action_retry.disabled = true;
            action_delete = document.createElement('button');
            action_delete.id = 'action_delete_'+receipt_id;
            action_delete.className = 'btn btn-secondary';
            action_delete.textContent = '注文取消';
            data_actions.appendChild(action_complete);
            data_actions.appendChild(action_call);
            data_actions.appendChild(action_confirm);
            data_actions.appendChild(action_retry);
            data_actions.appendChild(action_delete);
            action_complete.addEventListener('click',(e)=>{
                console.log("完成した");
                e.target.disable = true;
                document.getElementById('action_confirm_'+e.target.id.slice(-5)).disabled = false;
                document.getElementById('action_retry_'+e.target.id.slice(-5)).disabled = false;
                announce(e.target.id.slice(-5));
                data = {
                    action: 'complete',
                    receipt_id: e.target.id.slice(-5),
                    front: null,
                    back: null
                }
                connection.emit('message',data)
                init();
            });
            action_call.addEventListener('click',(e)=>{
                console.log("呼び出し");
                announce(e.target.id.slice(-5));
            })
            action_confirm.addEventListener('click',(e)=>{
                console.log("絵柄を確認した");
                data = {
                    action: 'confirm',
                    receipt_id: e.target.id.slice(-5),
                    front: null,
                    back: null
                }
                connection.emit('message',data)
                location.reload();
            });
            action_retry.addEventListener('click',(e)=>{
                console.log("作り直す");
                console.log(document.getElementById('data_frontnum_'+e.target.id.slice(-5)));
                data = {
                    action: 'retry',
                    receipt_id: e.target.id.slice(-5),
                    front: document.getElementById('data_frontnum_'+e.target.id.slice(-5)).innerHTML,
                    back: document.getElementById('data_backnum_'+e.target.id.slice(-5)).innerHTML
                }
                connection.emit('message',data)
                location.reload();
            });
            action_delete.addEventListener('click',(e)=>{
                console.log("注文取り消し");
                data = {
                    action: 'delete',
                    receipt_id: e.target.id.slice(-5),
                    front: null,
                    back: null
                }
                connection.emit('message',data)
                location.reload();
            });

            break;
        case 'delete':
            console.log('delete');
            data_tr = document.getElementById('data_tr_'+message['receipt_id']);
            console.log('data_tr_'+message['receipt_id']);
            table_element.removeChild(data_tr);
            break;
        case 'complete':
            console.log('complete');
            action_complete = document.getElementById('action_complete_'+receipt_id);
            action_confirm = document.getElementById('action_confirm_'+receipt_id);
            action_complete.disable = true;
            action_confirm.disable = false;
            break;
        case 'confirm':
            console.log('confirm');
            data_tr = document.getElementById('data_tr_'+message['receipt_id']);
            table_element.removeChild(data_tr);
            break;
        case 'retry':
            console.log('retry');
            data_tr = document.getElementById('data_tr_'+message['receipt_id']);
            table_element.removeChild(data_tr);
            break;
        default:
            console.log('error');
            break;
    }
});