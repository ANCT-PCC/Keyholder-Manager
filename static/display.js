//横6,縦6
//カウンタ変数
var i=0;
var j=0;
//作成中エリアの変数
var ing_element= [];
var ing_element_c = [];
var ing_parentElement=null;
var ing_childElement = null;
//完成エリアの変数
var comp_element= [];
var comp_element_c = [];
var comp_parentElement=null;
var comp_childElement = null;

//その他の変数
var element = null;

//Websocket接続
const connection = io.connect('/display');

//呼び出し番号の初期配置
const init=()=>{
    //36回、それぞれ回せ
};

connection.on('connect',()=>{
    console.log("サーバに接続しました");
});
connection.on('disconnect',()=>{
    console.log("サーバから切断されました");
});

connection.on('message',(message)=>{
    console.log("メッセージイベントを受信");
    console.log(message);
    console.log(message['action']);
    if(message['action'] == 'add'){
        for(i=0;i<6;i++){
            for(i=0;i<6;i++){
                document.getElementById('ing_parentDiv_'+j)
            }
        }
    }
});

init();