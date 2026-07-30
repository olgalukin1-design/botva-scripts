// ==========================================
// 🤪 Auto Attack
// Botva Scripts
// ==========================================

javascript:(function(){

'use strict';


// ==========================================
// Защита от двойного запуска
// ==========================================

if (window.AutoAttackLoaded) {

    window.AutoAttackRunning = false;

    document
        .getElementById('auto-attack-panel')
        ?.remove();

    console.log(
        '🛑 Auto Attack остановлен'
    );

    return;
}


window.AutoAttackLoaded = true;



let isRunning = false;
let attackedCount = 0;
let skippedCount = 0;



// ==========================================
// Стиль панели
// ==========================================

const style = document.createElement('style');

style.textContent = `

#auto-attack-panel{

position:fixed;
top:20px;
right:20px;

background:
linear-gradient(
145deg,
#151515,
#333
);

color:white;

padding:15px 20px;

border-radius:12px;

font-family:Arial,sans-serif;

z-index:99999;

min-width:270px;

box-shadow:
0 4px 20px rgba(0,0,0,0.6);

border:
2px solid #8a6a2f;

}



#auto-attack-panel h4{

margin:0 0 15px 0;

color:#ffd86b;

font-size:17px;

}



#aa-close{

float:right;

cursor:pointer;

color:#ff5555;

font-size:18px;

}



.aa-btn{

width:100%;

padding:12px;

border:none;

border-radius:6px;

font-size:14px;

font-weight:bold;

cursor:pointer;

margin:5px 0;

}



.aa-start{

background:
linear-gradient(
135deg,
#4CAF50,
#45a049
);

color:white;

}



.aa-stop{

background:
linear-gradient(
135deg,
#f44336,
#da190b
);

color:white;

}



.aa-stats{

margin-top:15px;

padding-top:15px;

border-top:
1px solid #444;

font-size:12px;

}



.aa-stats div{

margin:5px 0;

display:flex;

justify-content:space-between;

}



.aa-log{

max-height:120px;

overflow-y:auto;

margin-top:10px;

font-size:11px;

background:#1a1a1a;

padding:8px;

border-radius:4px;

}



.aa-log div{

margin:2px 0;

padding:2px 0;

border-bottom:
1px solid #222;

}



.aa-log .success{

color:#4CAF50;

}



.aa-log .skip{

color:#FFC107;

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



panel.innerHTML =

`

<h4>
🤪 Auto Attack

<span id="aa-close">
✕
</span>

</h4>


<button id="aa-toggle"
class="aa-btn aa-start">

▶ СТАРТ

</button>


<div class="aa-stats">

<div>

<span>
Атаковано:
</span>

<span id="aa-attacked">
0
</span>

</div>


<div>

<span>
Пропущено:
</span>

<span id="aa-skipped">
0
</span>

</div>


<div>

<span>
Всего:
</span>

<span id="aa-total">
0
</span>

</div>


</div>


<div class="aa-log"
id="aa-log">

<em style="color:#666">
Лог...
</em>

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


const closeBtn =
document.getElementById(
'aa-close'
);





closeBtn.onclick=function(){

    isRunning=false;

    window.AutoAttackLoaded=false;

    panel.remove();

    console.log(
        '🛑 Auto Attack закрыт'
    );

};





function logMsg(msg,type){

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
    msg;



    if(
        log.querySelector('em')
    ){

        log.innerHTML='';

    }



    log.insertBefore(
        div,
        log.firstChild
    );



    while(
        log.children.length>50
    ){

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




function getRandomDelay(){

    return 30 + Math.random()*70;

}
// ==========================================
// Атака (оригинальная логика)
// ==========================================

async function performAttack(form, name) {

    const formData =
        new FormData(form);

    try {

        const response =
            await fetch(
                form.action,
                {
                    method:'POST',
                    body:formData
                }
            );


        if (response.ok) {


            attackedCount++;


            logMsg(
                '✅ ' + name,
                'success'
            );



            const submitBtn =
                form.querySelector(
                    'input[type="submit"]'
                );


            if (submitBtn) {

                submitBtn.value = '⚔️';

                submitBtn.disabled = true;

                submitBtn.style.background = '#666';

            }

        }


    } catch(error) {


        // ошибки игнорируем как было

    }


    updateStats();

}






// ==========================================
// Основной цикл
// ==========================================

async function run() {


    if (!isRunning)
        return;



    const forms =
        document.querySelectorAll(
            'form[action="shtab.php"]'
        );



    document.getElementById(
        'aa-total'
    ).textContent =
        forms.length;




    for (const form of forms) {



        if (!isRunning)
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
            'ID:' + charId;



        const submitBtn =
            form.querySelector(
                'input[type="submit"]'
            );



        if (submitBtn?.disabled)
            continue;




        const timer =
            document.getElementById(
                't_' + charId
            );




        if (timer) {



            skippedCount++;


            logMsg(
                '⏰ ' + name,
                'skip'
            );


            updateStats();



        } else {


            await performAttack(
                form,
                name
            );


        }




        if (isRunning) {


            await new Promise(
                r =>
                setTimeout(
                    r,
                    getRandomDelay()
                )
            );


        }


    }




    if (isRunning) {


        logMsg(
            '🏁 Готово!',
            ''
        );


        isRunning = false;



        btn.textContent =
            '▶ СТАРТ';



        btn.className =
            'aa-btn aa-start';


    }


}






// ==========================================
// Кнопка старт/стоп
// ==========================================

btn.addEventListener(
    'click',
    function() {


        isRunning =
            !isRunning;



        if (isRunning) {



            btn.textContent =
                '⏹ СТОП';



            btn.className =
                'aa-btn aa-stop';



            run();



        } else {



            btn.textContent =
                '▶ СТАРТ';



            btn.className =
                'aa-btn aa-start';


        }


    }
);





console.log(
    '🤪 Auto Attack готов! СТАРТ на панели.'
);



})();
