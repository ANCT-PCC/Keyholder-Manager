//横6,縦6
//カウンタ変数
var i=0;
var j=0;

//その他の変数
var element = null;
var element_placed = false;
var receipt_id = null;
var is_completed = null;
var is_confirmed = null;

//Websocket接続
const connection = io.connect('/display');

//呼び出し番号の初期配置
const init=()=>{
    //36回、それぞれ回せ
    for(i=1;i<=36;i++){
        element = document.getElementById('creating_panel_'+i);
        element.innerHTML = '';
        element = document.getElementById('completed_panel_'+i);
        element.innerHTML = '';
    }
};

connection.on('connect',()=>{
    console.log("サーバに接続しました");

    $.ajax(
        {
          url:'http://localhost:5000/'+'history',
          type:'GET',
          dataType: "json"
    }).always(function (data){
        var data_stringify = JSON.stringify(data);
        var data_json = JSON.parse(data_stringify);
        var info = data_json['data'];
        init();
        for(i=0;i<info.length;i++){
            receipt_id = info[i][0];
            is_completed = info[i][3];
            is_confirmed = info[i][4];
            if(is_completed == 'False'){
                element_placed = false;
                for(j=1;j<=36;j++){
                    element = document.getElementById('creating_panel_'+String(j));
                    if(element.innerHTML == '' && element_placed == false){
                        element.innerHTML = receipt_id;
                        element_placed = true;
                    }else{
                        if(j == 36 && element_placed == false){
                            $.ajax(
                                {
                                  url:'http://localhost:5000/'+'get_creatings',
                                  type:'GET',
                                  dataType: "json"
                            }).always(function (data){
                                var data_stringify = JSON.stringify(data);
                                var data_json = JSON.parse(data_stringify);
                                var info = data_json['data'];
                                document.getElementById('creating_panel_36').innerHTML = '他'+String(info-35)+'件';
                            });
                            
                        }
                        continue;
                    }
                }
                
            }else if(is_confirmed == 'True' && is_completed == 'True'){
                continue;
            }else{
                element_placed = false;
                for(j=1;j<=36;j++){
                    element = document.getElementById('completed_panel_'+String(j));
                    if(element_placed == false && element.innerHTML == ''){
                        element.innerHTML = receipt_id;
                        element_placed = true;
                    }else{
                        if(j == 36 && element_placed == false){
                            $.ajax(
                                {
                                  url:'http://localhost:5000/'+'get_confirmings',
                                  type:'GET',
                                  dataType: "json"
                            }).always(function (data){
                                var data_stringify = JSON.stringify(data);
                                var data_json = JSON.parse(data_stringify);
                                var info = data_json['data'];
                                document.getElementById('completed_panel_36').innerHTML = '他'+String(info-35)+'件';
                            });
                        }
                        continue;
                    }
                }
            }
        }
    });
});
connection.on('disconnect',()=>{
    console.log("サーバから切断されました");
});

connection.on('message',(message)=>{
    console.log("メッセージイベントを受信");
    if(message['action'] == 'complete'){
        //伝票番号から自動放送を組み立てる
        //↑まあ、いいや。とりあえずリロード
        init();
        //announce(message['receipt_id']);
    }else if(message['action'] == 'confirm'){
        //location.reload();
        init();
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
        init();
        for(i=0;i<info.length;i++){
            receipt_id = info[i][0];
            is_completed = info[i][3];
            is_confirmed = info[i][4];
            
            if(is_completed == 'False'){
                element_placed = false;
                for(j=1;j<=36;j++){
                    element = document.getElementById('creating_panel_'+String(j));
                    if(element.innerHTML == '' && element_placed == false){
                        element.innerHTML = receipt_id;
                        element_placed = true;
                    }else{
                        if(j == 36 && element_placed == false){
                            $.ajax(
                                {
                                  url:'http://localhost:5000/'+'get_creatings',
                                  type:'GET',
                                  dataType: "json"
                            }).always(function (data){
                                var data_stringify = JSON.stringify(data);
                                var data_json = JSON.parse(data_stringify);
                                var info = data_json['data'];
                                document.getElementById('creating_panel_36').innerHTML = '他'+String(info-35)+'件';
                            });
                        }
                        continue;
                    }
                }
                
            }else if(is_confirmed == 'True' && is_completed == 'True'){
                continue;
            }else{
                element_placed = false;
                for(j=1;j<=36;j++){
                    element = document.getElementById('completed_panel_'+String(j));
                    if(element_placed == false && element.innerHTML == ''){
                        element.innerHTML = receipt_id;
                        element_placed = true;
                    }else{
                        if(j == 36 && element_placed == false){
                            $.ajax(
                                {
                                  url:'http://localhost:5000/'+'get_confirmings',
                                  type:'GET',
                                  dataType: "json"
                            }).always(function (data){
                                var data_stringify = JSON.stringify(data);
                                var data_json = JSON.parse(data_stringify);
                                var info = data_json['data'];
                                document.getElementById('completed_panel_36').innerHTML = '他'+String(info-35)+'件';
                            });
                        }
                        continue;
                    }
                }
            }
        }
    });
});

init();