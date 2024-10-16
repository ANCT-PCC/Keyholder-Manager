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

//Websocket接続
const connection = io.connect();

//呼び出し番号の初期配置
const init=()=>{
    for(i=0;i<6;i++){
        ing_parentElement = "ing_parentDiv_"+String(i);
        comp_parentElement = "comp_parentDiv_"+String(i);
        ing_element[i] = document.createElement("div");//親要素
        ing_element[i].id = ing_parentElement;
        ing_element[i].className = "fwrapp justify3";
        comp_element[i] = document.createElement("div");//親要素
        comp_element[i].id = comp_parentElement;
        comp_element[i].className = "fwrapp justify3";
        if(i==0){
            document.getElementById("creating-keyholder").after(ing_element[i]); //親要素の配置
            document.getElementById("complete-keyholder").after(comp_element[i]); //親要素の配置
        }else{
            document.getElementById("ing_parentDiv_"+String(i-1)).after(ing_element[i]);
            document.getElementById("comp_parentDiv_"+String(i-1)).after(comp_element[i]);
        }
        
    
        for(j=0;j<6;j++){
            ing_childElement = "ing_childDiv_"+String(j);
            comp_childElement = "comp_childDiv_"+String(j);
            ing_element_c[j] = document.createElement('div');//子要素
            ing_element_c[j].id = ing_childElement;
            ing_element_c[j].className = "number_element";
            //ing_element_c[j].textContent = "1234";
            document.getElementById(ing_parentElement).appendChild(ing_element_c[j]);
            comp_element_c[j] = document.createElement('div');//子要素
            comp_element_c[j].id = comp_childElement;
            comp_element_c[j].className = "number_element";
            //comp_element_c[j].textContent = "4321";
            document.getElementById(comp_parentElement).appendChild(comp_element_c[j]);
        }
    }
};

connection.on('connect',()=>{
    console.log("サーバに接続しました");
});
connection.on('disconnect',()=>{
    console.log("サーバから切断されました");
});

connection.on('message',()=>{
    console.log("メッセージイベントを受信");
});

init();