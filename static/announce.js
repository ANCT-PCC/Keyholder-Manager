function announce(receipt_id) {
    //伝票番号は5桁であるので、1文字ずつに分解
    var id_letters = [];
    for(i=0;i<5;i++){
        id_letters.push(receipt_id.charAt(i));
    }
    //放送を開始
    var call_sound = new Audio();
    var number_sound = new Audio();
    var sound1 = new Audio();
    var sound2 = new Audio();
    var sound3 = new Audio();
    var sound4 = new Audio();
    var sound5 = new Audio();
    var end_sound = new Audio();

    call_sound.src = 'static/sound/call_03.mp3';
    number_sound.src = 'static/sound/announce/mp3/number.mp3';
    sound1.src = 'static/sound/announce/mp3/'+id_letters[0]+'.mp3';
    sound2.src = 'static/sound/announce/mp3/'+id_letters[1]+'.mp3';
    sound3.src = 'static/sound/announce/mp3/'+id_letters[2]+'.mp3';
    sound4.src = 'static/sound/announce/mp3/'+id_letters[3]+'.mp3';
    sound5.src = 'static/sound/announce/mp3/'+id_letters[4]+'.mp3';
    end_sound.src = 'static/sound/announce/mp3/waiting_customer.mp3';

    call_sound.addEventListener('ended',function(){
        number_sound.play();
    });
    number_sound.addEventListener('ended',function(){
        sound1.play();
    });
    sound1.addEventListener('ended',function(){
        sound2.play();
    });
    sound2.addEventListener('ended',function(){
        sound3.play();
    });
    sound3.addEventListener('ended',function(){
        sound4.play();
    });
    sound4.addEventListener('ended',function(){
        sound5.play();
    });
    sound5.addEventListener('ended',function(){
        end_sound.play();
    });

    call_sound.play();

}