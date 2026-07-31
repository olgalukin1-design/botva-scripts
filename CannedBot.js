javascript:(function(){
var old=document.getElementById('canned_bot_ui');
if(old)old.remove();

var createBtn=document.getElementById('conflictcraft_create');
var items=document.querySelectorAll('#conflictcraft_items .item');
var cannedIdx=-1;

for(var i=0;i<items.length;i++){
    var img=items[i].querySelector('img');
    if(img&&img.src&&img.src.indexOf('1655')!==-1){
        cannedIdx=i;
        break;
    }
}

if(cannedIdx===-1){
    alert('❌ Консервы не найдены!');
    return;
}

var ui=document.createElement('div');

ui.id='canned_bot_ui';

ui.innerHTML=
'<div style="position:fixed;top:15px;right:15px;z-index:99999;background:linear-gradient(180deg,#26264a,#111827);border:2px solid #22c55e;border-radius:18px;min-width:200px;font-family:Arial,sans-serif;color:#fff;box-shadow:0 10px 35px rgba(34,197,94,.35);overflow:hidden;">'+

'<div style="background:linear-gradient(135deg,#22c55e,#15803d);padding:12px;text-align:center;font-size:28px;">🥫</div>'+

'<div style="padding:14px;text-align:center;">'+

'<div id="ct_time" style="font-size:20px;font-weight:700;color:#67e8f9;margin-bottom:8px;">⏱ 0:00</div>'+

'<div id="ct_count" style="font-size:18px;font-weight:700;color:#fde68a;margin-bottom:12px;">🥫 Создано: 0</div>'+

'<button id="ct_start" onclick="startCanned()" style="width:100%;padding:12px;border:0;border-radius:10px;background:#22c55e;color:white;font-size:15px;font-weight:700;cursor:pointer;">⚡ СТАРТ</button>'+

'<button id="ct_stop" onclick="stopCanned()" style="display:none;width:100%;padding:12px;border:0;border-radius:10px;background:#ef4444;color:white;font-size:15px;font-weight:700;cursor:pointer;">⏹ СТОП</button>'+

'</div></div>';

document.body.appendChild(ui);


var count=0,
fails=0,
startTime=0,
running=false,
timerInterval=null;


function updateStats(){

    var e=Math.floor((Date.now()-startTime)/1000);

    document.getElementById('ct_time').textContent=
    '⏱ '+Math.floor(e/60)+':'+(e%60<10?'0':'')+e%60;

    document.getElementById('ct_count').textContent=
    '🥫 Создано: '+count;
}


function craftLoop(){

    if(!running)return;

    for(var j=0;j<items.length;j++)
        items[j].classList.remove('chosen');


    if(items[cannedIdx]){
        items[cannedIdx].classList.add('chosen');
        items[cannedIdx].click();
    }


    if(createBtn)
        createBtn.click();


    setTimeout(function(){

        var popup=document.querySelector('.conflictcraft_popup_btn');

        if(popup){
            popup.click();
            count++;
            updateStats();
        }
        else{
            fails++;
        }


        if(running)
            setTimeout(craftLoop,800);


    },10);
}


window.stopCanned=function(){

    running=false;

    if(timerInterval)
        clearInterval(timerInterval);

    document.getElementById('ct_start').style.display='block';
    document.getElementById('ct_stop').style.display='none';
};


window.startCanned=function(){

    running=true;

    startTime=Date.now();
    count=0;
    fails=0;

    document.getElementById('ct_start').style.display='none';
    document.getElementById('ct_stop').style.display='block';


    timerInterval=setInterval(updateStats,100);

    craftLoop();
};


console.log('🥫 Консервы БОТ готов!');

})();
