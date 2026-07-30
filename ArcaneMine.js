// ==========================================
// ArcaneMine.js
// Botva Arcane Mine Auto Runner
// ==========================================

(() => {

    // Защита от двойного запуска
    if (window.ArcaneMineRunning) {
        window.ArcaneMineStop = true;
        console.log("🛑 ArcaneMine остановлен");
        return;
    }

    window.ArcaneMineRunning = true;
    window.ArcaneMineStop = false;


    let floors = 0;
    let monsters = 0;
    const startTime = Date.now();


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    function prepareForms() {
        document.querySelectorAll('form').forEach(form => {
            form.classList.remove(
                'submit_by_ajax',
                'submit_by_ajax_completed'
            );
        });
    }


    // Отправка формы без перезагрузки страницы
    function ajaxSubmit(form, submitter = null) {

        return new Promise(resolve => {

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


            xhr.onload = function () {

                if (xhr.status >= 200 && xhr.status < 300) {

                    const parser = new DOMParser();

                    const responseDocument =
                        parser.parseFromString(
                            xhr.responseText,
                            'text/html'
                        );


                    const newContent =
                        responseDocument.getElementById('content');

                    const currentContent =
                        document.getElementById('content');


                    if (newContent && currentContent) {

                        currentContent.innerHTML =
                            newContent.innerHTML;

                        prepareForms();

                    }

                }

                resolve();

            };


            xhr.onerror = function () {

                console.error(
                    "❌ Ошибка соединения"
                );

                resolve();

            };


            const formData =
                new FormData(form);


            if (submitter && submitter.name) {

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



    // Панель статистики
    function createPanel() {

        let panel =
            document.getElementById(
                "arcane-panel"
            );


        if (!panel) {

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
                color:#fff;
                padding:15px;
                border-radius:10px;
                font-size:14px;
                font-family:Arial;
                box-shadow:0 0 10px #000;
                `;


            document.body.appendChild(panel);

        }


        panel.innerHTML = `

        ⛏️ <b>ArcaneMine</b><br>
        ─────────────<br>
        Статус: 🟢 работает<br>
        Этажи: ${floors}<br>
        Монстры: ${monsters}<br>
        Время:
        ${Math.floor(
            (Date.now()-startTime)/1000
        )} сек

        <br><br>

        <button id="arcane-stop">
        🛑 Остановить
        </button>

        `;


        document
            .getElementById("arcane-stop")
            .onclick = () => {

                window.ArcaneMineStop = true;

            };

    }



    async function run() {


        console.log(
            "⛏️ ArcaneMine запущен"
        );


        while (
            !window.ArcaneMineStop
        ) {


            createPanel();



            // Ищем монстров

            const monsterButton =
                document.querySelector(
                    'input[value="arcane_hit"]'
                );


            if (monsterButton) {


                const form =
                    monsterButton.closest(
                        "form"
                    );


                if (form) {


                    await ajaxSubmit(
                        form,
                        monsterButton
                    );


                    monsters++;


                    await sleep(150);

                    continue;

                }

            }




            // Переход дальше

            const nextButton =
                document.querySelector(
                    'input[value="arcane_gonext"]'
                );


            if (nextButton) {


                const form =
                    nextButton.closest(
                        "form"
                    );


                if (form) {


                    floors++;


                    await ajaxSubmit(
                        form,
                        nextButton
                    );


                    await sleep(150);

                    continue;

                }

            }




            // Ждем появления действий

            await sleep(500);

        }



        window.ArcaneMineRunning =
            false;


        document
            .getElementById(
                "arcane-panel"
            )
            ?.remove();


        console.log(
            "🛑 ArcaneMine завершил работу"
        );


    }



    run();



})();