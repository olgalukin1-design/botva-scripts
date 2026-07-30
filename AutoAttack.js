// ==========================================
// 🤪 Auto Attack
// Botva Auto Attack Script
// ==========================================

(() => {

'use strict';


// ==========================================
// Защита от двойного запуска
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



let attackedCount = 0;
let skippedCount = 0;
let startTime = Date.now();



// ==========================================
// Стили панели
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
        #171717,
        #292929
    );

    color:#fff;

    border:
    2px solid #8a6a2f;

    border-radius:14px;

    padding:15px;

    z-index:999999;

    font-family:Arial,sans-serif;

    box-shadow:
    0 0 20px rgba(0,0,0,.8);

}


.aa-header {

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

    font-size:18px;

}


.aa-status {

    background:#111;

    padding:8px;

    border-radius:8px;

    margin-bottom:10px;

    text-align:center;

}


.aa-green {

    color:#4cff4c;

}


.aa-stats {

    background:#111;

    border-radius:8px;

    padding:10px;

}


.aa-row {

    display:flex;

    justify-content:space-between;

    margin:5px 0;

}


.aa-log {

    margin-top:10px;

    background:#0b0b0b;

    height:90px;

    overflow:auto;

    border-radius:8px;

    padding:8px;

    font-size:11px;

}


.aa-success {

    color:#4cff4c;

}


.aa-skip {

    color:#ffc107;

}


.aa-button {

    width:100%;

    margin-top:10px;

    padding:10px;

    border:0;

    border-radius:8px;

    cursor:pointer;

    font-weight:bold;

    background:
    linear-gradient(
        135deg,
        #d33,
        #900
    );

    color:white;

}


`;

document.head.appendChild(style);




// ==========================================
// Создание панели
// ==========================================

const panel =
document.createElement('div');


panel.id =
'auto-attack-panel';



panel.innerHTML = `

<div class="aa-header">

    🤪 Auto Attack

    <span class="aa-close">
        ✕
    </span>

</div>


<div class="aa-status">

    🟢 Работает

</div>



<div class="aa-stats">


<div class="aa-row">

<span>⚔️ Атаковано</span>

<b id="aa-attacked">
0
</b>

</div>



<div class="aa-row">

<span>⏰ Пропущено</span>

<b id="aa-skipped">
0
</b>

</div>



<div class="aa-row">

<span>⏱ Время</span>

<b id="aa-time">
0 сек
</b>

</div>


</div>



<div class="aa-log" id="aa-log">

Запуск...

</div>



<button class="aa-button" id="aa-stop">

🛑 Остановить

</button>

`;



document.body.appendChild(panel);




// ==========================================
// Элементы панели
// ==========================================

const log =
document.getElementById('aa-log');


const closeBtn =
document.querySelector('.aa-close');


const stopBtn =
document.getElementById('aa-stop');





function logMsg(text,type='') {

    const div =
    document.createElement('div');


    div.className =
    type;


    div.textContent =
    '['+
    new Date().toLocaleTimeString()
    +'] '
    +
    text;


    log.prepend(div);


    while(log.children.length>30){

        log.removeChild(
            log.lastChild
        );

    }

}





function updatePanel(){

    document.getElementById(
        'aa-attacked'
    ).textContent =
    attackedCount;


    document.getElementById(
        'aa-skipped'
    ).textContent =
    skippedCount;


    document.getElementById(
        'aa-time'
    ).textContent =
    Math.floor(
        (Date.now()-startTime)/1000
    )
    +' сек';

}

// ==========================================
// Закрытие и остановка
// ==========================================

closeBtn.onclick = () => {

    window.AutoAttackStop = true;

    panel.remove();

    window.AutoAttackRunning = false;

    console.log(
        '🛑 Auto Attack закрыт'
    );

};



stopBtn.onclick = () => {

    window.AutoAttackStop = true;

    logMsg(
        'Остановка...'
    );

};




// ==========================================
// Задержка
// ==========================================

function getRandomDelay(){

    return 30 + Math.random()*70;

}



// ==========================================
// Отправка атаки
// ==========================================

async function performAttack(form,name){

    try {


        const formData =
        new FormData(form);



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
                '⚔️ '+name,
                'aa-success'
            );


        }



    }
    catch(e){


        logMsg(
            'Ошибка атаки',
            'aa-skip'
        );


    }



    updatePanel();

}





// ==========================================
// Основной цикл
// ==========================================

async function run(){


    logMsg(
        '🤪 Поиск целей...'
    );



    while(
        !window.AutoAttackStop
    ){



        const forms =
        document.querySelectorAll(
            'form[action="shtab.php"]'
        );



        let attackedThisRound = false;



        for(
            const form of forms
        ){


            if(
                window.AutoAttackStop
            )
            break;



            const charId =
            form.querySelector(
                'input[name="char_id"]'
            )?.value;



            const name =
            form
            .closest('tr')
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
                !submitBtn ||
                submitBtn.disabled
            ){

                continue;

            }




            // проверяем таймер

            const timer =
            document.getElementById(
                't_'+charId
            );



            if(timer){


                skippedCount++;


                logMsg(
                    '⏰ '+name,
                    'aa-skip'
                );


                updatePanel();


            }
            else {


                await performAttack(
                    form,
                    name
                );


                attackedThisRound=true;


            }




            await new Promise(
                r =>
                setTimeout(
                    r,
                    getRandomDelay()
                )
            );



        }




        updatePanel();




        // если целей нет — ждём

        if(
            !attackedThisRound
        ){


            logMsg(
                '🔎 Нет доступных целей'
            );



            await new Promise(
                r =>
                setTimeout(
                    r,
                    1000
                )
            );


        }



    }




    window.AutoAttackRunning=false;



    logMsg(
        '🛑 Auto Attack завершён'
    );


}





// ==========================================
// Запуск
// ==========================================


console.log(
    '🤪 Auto Attack запущен'
);


logMsg(
    '🚀 Старт'
);



run();



})();
