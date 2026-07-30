// ==========================================
// 🤪 Auto Attack
// Botva Auto Attack Script
// ==========================================

(() => {

'use strict';


// ==========================================
// Защита от повторного запуска
// ==========================================

if (window.AutoAttackRunning) {

    window.AutoAttackStop = true;

    document
        .getElementById('auto-attack-panel')
        ?.remove();

    console.log('🛑 Auto Attack остановлен');

    return;
}


window.AutoAttackRunning = true;
window.AutoAttackStop = false;



let isRunning = false;
let attackedCount = 0;
let skippedCount = 0;



// ==========================================
// Стили
// ==========================================

const style = document.createElement('style');

style.id = 'auto-attack-style';

style.textContent = `

#auto-attack-panel {

position:fixed;
top:20px;
right:20px;

width:280px;

background:
linear-gradient(
145deg,
#1b1b1b,
#333
);

color:white;

border:
2px solid #8a6a2f;

border-radius:15px;

padding:15px;

z-index:999999;

font-family:Arial,sans-serif;

box-shadow:
0 0 20px rgba(0,0,0,.8);

}


.aa-title {

display:flex;

justify-content:space-between;

align-items:center;

font-size:18px;

font-weight:bold;

color:#ffd86b;

margin-bottom:12px;

}


.aa-close {

cursor:pointer;

color:#ff6666;

font-size:20px;

}


.aa-btn {

width:100%;

padding:10px;

margin-top:8px;

border:0;

border-radius:8px;

cursor:pointer;

font-weight:bold;

}


.aa-start {

background:#4caf50;

color:white;

}


.aa-stop {

background:#d32f2f;

color:white;

}


.aa-stats {

background:#111;

padding:10px;

border-radius:8px;

margin-top:10px;

}


.aa-row {

display:flex;

justify-content:space-between;

margin:5px 0;

}


.aa-log {

height:100px;

overflow:auto;

background:#090909;

border-radius:8px;

margin-top:10px;

padding:8px;

font-size:11px;

}


.success {

color:#4caf50;

}


.skip {

color:#ffc107;

}

`;

document.head.appendChild(style);





// ==========================================
// Панель
// ==========================================

const panel =
document.createElement('div');


panel.id =
'auto-attack-panel';



panel.innerHTML = `

<div class="aa-title">

🤪 Auto Attack

<span class="aa-close">
✕
</span>

</div>



<button id="aa-toggle"
class="aa-btn aa-start">
▶ СТАРТ
</button>



<div class="aa-stats">

<div class="aa-row">
<span>⚔️ Атаковано</span>
<b id="aa-attacked">0</b>
</div>


<div class="aa-row">
<span>⏰ Пропущено</span>
<b id="aa-skipped">0</b>
</div>


<div class="aa-row">
<span>🎯 Целей</span>
<b id="aa-total">0</b>
</div>

</div>



<div id="aa-log"
class="aa-log">
Лог...
</div>

`;



document.body.appendChild(panel);





const btn =
document.getElementById(
'aa-toggle'
);


const log =
document.getElementById(
'aa-log'
);



const close =
document.querySelector(
'.aa-close'
);





function logMsg(text,type='') {

const div =
document.createElement('div');

div.className =
type;

div.textContent =
'['+
new Date().toLocaleTimeString()
+
'] '
+
text;


log.prepend(div);



while(log.children.length>50){

log.removeChild(
log.lastChild
);

}

}





function updateStats(){

document.getElementById(
'aa-attacked'
).textContent =
attackedCount;


document.getElementById(
'aa-skipped'
).textContent =
skippedCount;

}
// ==========================================
// Кнопка закрытия
// ==========================================

close.onclick = () => {

    window.AutoAttackStop = true;
    window.AutoAttackRunning = false;

    panel.remove();

    console.log(
        '🛑 Auto Attack закрыт'
    );

};



// ==========================================
// Задержка
// ==========================================

function getRandomDelay(){

    return 30 + Math.random()*70;

}



// ==========================================
// Атака
// ==========================================

async function performAttack(form,name){


    const charId =
    form.querySelector(
        'input[name="char_id"]'
    )?.value || '?';



    const formData =
    new FormData(form);



    try {


        const response =
        await fetch(
            form.action || location.href,
            {
                method:'POST',
                body:formData
            }
        );



        if(response.ok){


            attackedCount++;


            logMsg(
                '⚔️ Атака: '+
                name+
                ' (ID '+charId+')',
                'success'
            );


        }


    }
    catch(error){


        logMsg(
            '❌ Ошибка: '+name,
            'skip'
        );


    }



    updateStats();

}




// ==========================================
// Основной запуск
// ==========================================

async function run(){


    if(isRunning)
        return;



    isRunning = true;


    logMsg(
        '🚀 Поиск целей...'
    );



    const forms =
    document.querySelectorAll(
        'form[action="shtab.php"]'
    );



    document.getElementById(
        'aa-total'
    ).textContent =
    forms.length;



    for(const form of forms){


        if(
            window.AutoAttackStop
        )
        break;




        const charId =
        form.querySelector(
            'input[name="char_id"]'
        )?.value;



        const name =
        form.closest('tr')
        ?.querySelector('.profile')
        ?.textContent
        ?.trim()
        ||
        'ID:'+charId;



        const submitBtn =
        form.querySelector(
            'input[type="submit"]'
        );



        if(
            submitBtn?.disabled
        ){

            continue;

        }




        const timer =
        document.getElementById(
            't_'+charId
        );




        if(timer){


            skippedCount++;


            logMsg(
                '⏰ Таймер: '+
                name+
                ' (ID '+charId+')',
                'skip'
            );


            updateStats();


        }
        else {


            await performAttack(
                form,
                name
            );


        }



        if(
            !window.AutoAttackStop
        ){

            await new Promise(
                r =>
                setTimeout(
                    r,
                    getRandomDelay()
                )
            );

        }


    }



    isRunning=false;



    btn.textContent =
    '▶ СТАРТ';


    btn.className =
    'aa-btn aa-start';



    logMsg(
        '🏁 Готово'
    );


}




// ==========================================
// Кнопка старт
// ==========================================

btn.onclick = () => {


    if(
        isRunning
    )
    return;



    window.AutoAttackStop=false;



    btn.textContent =
    '⏹ СТОП';



    btn.className =
    'aa-btn aa-stop';



    run();


};




// ==========================================
// Стоп через кнопку
// ==========================================

btn.addEventListener(
'contextmenu',
e=>{

    e.preventDefault();

    window.AutoAttackStop=true;

});




console.log(
    '🤪 Auto Attack готов!'
);


})();
