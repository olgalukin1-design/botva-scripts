(async()=>{

// ==========================================
// ArcaneMine.js
// Botva Arcane Mine Auto Runner
// ==========================================


if(window.ArcaneMineRunning){

    window.ArcaneMineStop = true;

    console.log("🛑 ArcaneMine остановлен");

    return;
}


window.ArcaneMineRunning = true;
window.ArcaneMineStop = false;


let floors = 0;
let monsters = 0;


function sleep(ms){

    return new Promise(
        resolve => setTimeout(resolve, ms)
    );

}



function prepareForms(){

    document.querySelectorAll('form')
    .forEach(form=>{

        form.classList.remove(
            'submit_by_ajax',
            'submit_by_ajax_completed'
        );

    });

}





function ajaxSubmit(form, submitter=null){

return new Promise(resolve=>{


    const xhr = new XMLHttpRequest();


    xhr.open(
        'POST',
        form.action || location.href,
        true
    );


    xhr.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded; charset=UTF-8'
    );



    xhr.onload = function(){


        const parser =
            new DOMParser();


        const responseDocument =
            parser.parseFromString(
                xhr.responseText,
                'text/html'
            );



        const newContent =
            responseDocument.getElementById(
                'content'
            );


        const currentContent =
            document.getElementById(
                'content'
            );



        if(
            newContent &&
            currentContent
        ){

            currentContent.innerHTML =
                newContent.innerHTML;


            prepareForms();

        }




        // обновляем навигацию

        const newNavigation =
            responseDocument.getElementById(
                'navigation'
            );


        const currentNavigation =
            document.getElementById(
                'navigation'
            );


        if(
            newNavigation &&
            currentNavigation
        ){

            currentNavigation.outerHTML =
                newNavigation.outerHTML;

        }



        resolve();

    };



    xhr.onerror=function(){

        console.log(
            "❌ Ошибка соединения"
        );

        resolve();

    };



    const formData =
        new FormData(form);



    if(
        submitter &&
        submitter.name
    ){

        formData.set(
            submitter.name,
            submitter.value
        );

    }



    xhr.send(
        new URLSearchParams(formData).toString()
    );


});


}








async function runCommand(command){


const form =
[...document.querySelectorAll('form')]
.find(
    f =>
    f.querySelector(
        `input[name="do_cmd"][value="${command}"]`
    )
);



if(!form){

    console.log(
        "❌ Команда не найдена:",
        command
    );

    return false;

}



const button =
form.querySelector(
    'input[type="submit"]'
);



console.log(
    "▶ Выполняю:",
    command
);



await ajaxSubmit(
    form,
    button
);


await sleep(150);


return true;


}









function createPanel(){

let panel =
document.getElementById(
    "arcane-panel"
);


if(!panel){

    panel =
    document.createElement(
        "div"
    );


    panel.id =
    "arcane-panel";


    panel.style.cssText =
    `
    position:fixed;
    top:20px;
    right:20px;
    z-index:999999;
    background:#222;
    color:white;
    padding:15px;
    border-radius:10px;
    font:14px Arial;
    `;


    document.body.appendChild(panel);

}



panel.innerHTML =
`
⛏️ <b>ArcaneMine</b><br>
Этажи: ${floors}<br>
Монстры: ${monsters}<br><br>

<button id="arc-stop">
🛑 Стоп
</button>
`;



document.getElementById(
    "arc-stop"
).onclick=()=>{

    window.ArcaneMineStop=true;

};


}









console.log(
    "⛏️ ArcaneMine старт"
);



// вход

await runCommand(
    "start_arcane"
);



while(
    !window.ArcaneMineStop
){


createPanel();




// бой

const hit =
document.querySelector(
    'input[value="arcane_hit"]'
);


if(hit){


const form =
hit.closest('form');


await ajaxSubmit(
    form,
    hit
);


monsters++;


console.log(
    "⚔ Монстр:",
    monsters
);


await sleep(150);


continue;

}





// этаж

const next =
document.querySelector(
    'input[value="arcane_gonext"]'
);



if(next){


const form =
next.closest('form');


await ajaxSubmit(
    form,
    next
);


floors++;


console.log(
    "🏰 Этаж:",
    floors
);


await sleep(150);


continue;

}





// выход

const stopForm =
[...document.querySelectorAll('form')]
.find(
    f =>
    f.querySelector(
        'input[name="do_cmd"][value="stop_arcane"]'
    )
);



if(stopForm){


console.log(
    "🚪 Выход из шахты"
);



await ajaxSubmit(
    stopForm,
    stopForm.querySelector(
        'input[type="submit"]'
    )
);



break;


}



await sleep(150);


}





document.getElementById(
    "arcane-panel"
)?.remove();



window.ArcaneMineRunning=false;



console.log(
    "🛑 ArcaneMine завершён",
    {
        floors,
        monsters
    }
);



})();
