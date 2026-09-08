/* =========================================
   CÂMERA E CONTROLE POR GESTOS
========================================= */


/* =========================================
   ELEMENTOS
========================================= */

const botaoAbrirCamera =
    document.getElementById("abrirCamera");

const videoCamera =
    document.getElementById("camera");

const canvasCamera =
    document.getElementById("cameraCanvas");


/* =========================================
   CONFIGURAÇÃO DO CANVAS
========================================= */

const contextoCanvas =
    canvasCamera.getContext("2d");


/* =========================================
   STATUS DA CÂMERA
========================================= */

let cameraAtiva = false;

let cameraProcessando = false;

let botaoSelecionado = null;

let ultimoClique = 0;

let pincaAnterior = false;


/* =========================================
   CONFIGURAR MEDIAPIPE HANDS
========================================= */

const detectorMaos =
    new Hands({

        locateFile: function (arquivo) {

            return (
                "https://cdn.jsdelivr.net/npm/" +
                "@mediapipe/hands/" +
                arquivo
            );

        }

    });


detectorMaos.setOptions({

    /* Detecta apenas uma mão */

    maxNumHands: 1,


    /* Qualidade do reconhecimento */

    modelComplexity: 1,


    /* Sensibilidade para encontrar a mão */

    minDetectionConfidence: 0.5,


    /* Sensibilidade para acompanhar */

    minTrackingConfidence: 0.5

});


/* =========================================
   QUANDO A MÃO FOR DETECTADA
========================================= */

detectorMaos.onResults(

    function (resultados) {

        /*
           Limpa a imagem anterior
        */

        contextoCanvas.clearRect(

            0,
            0,
            canvasCamera.width,
            canvasCamera.height

        );


        /*
           Desenha a imagem da câmera
           dentro do canvas
        */

        contextoCanvas.save();


        /*
           Inverte a imagem para parecer
           um espelho
        */

        contextoCanvas.scale(-1, 1);


        contextoCanvas.drawImage(

            resultados.image,

            -canvasCamera.width,

            0,

            canvasCamera.width,

            canvasCamera.height

        );


        contextoCanvas.restore();


        /*
           Verifica se encontrou uma mão
        */

        if (

            !resultados.multiHandLandmarks ||

            resultados.multiHandLandmarks.length === 0

        ) {

            botaoSelecionado = null;

            removerDestaques();

            return;

        }


        /*
           Pega os pontos da primeira mão
        */

        const mao =
            resultados.multiHandLandmarks[0];


        /* =====================================
           DESENHAR OS PONTOS DA MÃO
        ===================================== */

        desenharConectores(

            contextoCanvas,

            mao,

            HAND_CONNECTIONS,

            {

                color: "#00ff88",

                lineWidth: 3

            }

        );


        desenharPontos(

            contextoCanvas,

            mao,

            {

                color: "#ffffff",

                lineWidth: 1,

                radius: 4

            }

        );


        /*
           Pega o dedo indicador
        */

        const indicador =
            mao[8];


        /*
           Pega o polegar
        */

        const polegar =
            mao[4];


        /* =====================================
           MARCAR A PONTA DO INDICADOR
        ===================================== */

        const indicadorX =
            (1 - indicador.x) *
            canvasCamera.width;


        const indicadorY =
            indicador.y *
            canvasCamera.height;


        contextoCanvas.beginPath();


        contextoCanvas.arc(

            indicadorX,

            indicadorY,

            10,

            0,

            Math.PI * 2

        );


        contextoCanvas.fillStyle =
            "red";


        contextoCanvas.fill();


        /* =====================================
           ENCONTRAR A TECLA APONTADA
        ===================================== */

        encontrarTecla(

            indicador

        );


        /* =====================================
           DETECTAR PINÇA
        ===================================== */

        detectarClique(

            indicador,

            polegar

        );

    }

);


/* =========================================
   ATIVAR A CÂMERA
========================================= */

botaoAbrirCamera.addEventListener(

    "click",

    async function () {

        /*
           Evita abrir duas vezes
        */

        if (cameraAtiva) {

            return;

        }


        try {

            botaoAbrirCamera.textContent =
                "CONECTANDO...";


            /*
               Solicita permissão
               para usar a câmera
            */

            const stream =

                await navigator
                    .mediaDevices
                    .getUserMedia({

                        video: {

                            facingMode:
                                "user"

                        },

                        audio: false

                    });


            /*
               Coloca a câmera no vídeo
            */

            videoCamera.srcObject =
                stream;


            /*
               Espera os dados do vídeo
            */

            await new Promise(

                function (resolver) {

                    videoCamera.onloadedmetadata =
                        resolver;

                }

            );


            /*
               Define o tamanho real
               do canvas
            */

            canvasCamera.width =
                videoCamera.videoWidth;


            canvasCamera.height =
                videoCamera.videoHeight;


            /*
               Inicia o vídeo
            */

            await videoCamera.play();


            /*
               Marca a câmera como ativa
            */

            cameraAtiva = true;


            botaoAbrirCamera.textContent =
                "CÂMERA ATIVADA";


            /*
               Começa o reconhecimento
            */

            analisarCamera();

        }

        catch (erro) {

            console.error(

                "Erro ao acessar câmera:",

                erro

            );


            botaoAbrirCamera.textContent =
                "ATIVAR CÂMERA";


            alert(

                "Não foi possível acessar a câmera. " +
                "Permita o acesso no navegador."

            );

        }

    }

);


/* =========================================
   ANALISAR CADA IMAGEM DA CÂMERA
========================================= */

async function analisarCamera() {

    /*
       Para o processo se a câmera
       não estiver ativa
    */

    if (!cameraAtiva) {

        return;

    }


    /*
       Só analisa se o vídeo estiver
       pronto
    */

    if (

        videoCamera.readyState >= 2 &&

        !cameraProcessando

    ) {

        cameraProcessando = true;


        try {

            await detectorMaos.send({

                image:
                    videoCamera

            });

        }

        catch (erro) {

            console.error(

                "Erro no reconhecimento:",

                erro

            );

        }


        cameraProcessando = false;

    }


    /*
       Analisa o próximo quadro
    */

    requestAnimationFrame(
        analisarCamera
    );

}


/* =========================================
   ENCONTRAR A TECLA APONTADA
========================================= */

function encontrarTecla(indicador) {

    /*
       Posição do dedo na tela inteira
    */

    const dedoX =
        (1 - indicador.x) *
        window.innerWidth;


    const dedoY =
        indicador.y *
        window.innerHeight;


    /*
       Todos os botões da urna
    */

    const botoes =

        document.querySelectorAll(

            ".tecla, #branco, #corrige, #confirma"

        );


    /*
       Remove os destaques
    */

    removerDestaques();


    /*
       Nenhuma tecla selecionada
    */

    botaoSelecionado =
        null;


    /*
       Procura a tecla
       onde o dedo está apontando
    */

    botoes.forEach(

        function (botao) {

            const posicao =
                botao.getBoundingClientRect();


            if (

                dedoX >= posicao.left &&

                dedoX <= posicao.right &&

                dedoY >= posicao.top &&

                dedoY <= posicao.bottom

            ) {

                /*
                   Destaca a tecla
                */

                botao.classList.add(
                    "selecionado-mao"
                );


                /*
                   Guarda a tecla
                */

                botaoSelecionado =
                    botao;

            }

        }

    );

}


/* =========================================
   DETECTAR O GESTO DE CLIQUE
========================================= */

function detectarClique(

    indicador,

    polegar

) {

    /*
       Calcula a distância
       entre os dois dedos
    */

    const distanciaX =

        indicador.x -
        polegar.x;


    const distanciaY =

        indicador.y -
        polegar.y;


    const distancia =

        Math.sqrt(

            distanciaX *
            distanciaX +

            distanciaY *
            distanciaY

        );


    /*
       Se a distância for pequena,
       considera uma pinça
    */

    const fazendoPinca =

        distancia < 0.10;


    /*
       Tempo atual
    */

    const agora =
        Date.now();


    /*
       Só clica quando os dedos
       acabaram de se juntar
    */

    if (

        fazendoPinca &&

        !pincaAnterior &&

        botaoSelecionado &&

        agora - ultimoClique > 700

    ) {

        ultimoClique =
            agora;


        /*
           Faz o clique real
        */

        botaoSelecionado.click();

    }


    /*
       Guarda a posição anterior
       dos dedos
    */

    pincaAnterior =
        fazendoPinca;

}


/* =========================================
   REMOVER DESTAQUES
========================================= */

function removerDestaques() {

    const botoes =

        document.querySelectorAll(

            ".tecla, #branco, #corrige, #confirma"

        );


    botoes.forEach(

        function (botao) {

            botao.classList.remove(
                "selecionado-mao"
            );

        }

    );

}