/* =====================================
   ELEMENTOS
===================================== */

const teclas =
    document.querySelectorAll(".tecla");

const botaoBranco =
    document.getElementById("branco");

const botaoCorrige =
    document.getElementById("corrige");

const botaoConfirma =
    document.getElementById("confirma");


const cargoTela =
    document.getElementById("cargoTela");

const mensagemUrna =
    document.getElementById("mensagemUrna");


const nomeCandidato =
    document.getElementById("nomeCandidato");

const partidoCandidato =
    document.getElementById("partidoCandidato");

const dadosCandidato =
    document.getElementById("dadosCandidato");


const numeroEleitor =
    document.getElementById("numeroEleitor");


const caixasNumero = [

    document.getElementById("numero1"),

    document.getElementById("numero2"),

    document.getElementById("numero3"),

    document.getElementById("numero4"),

    document.getElementById("numero5")

];


/* =====================================
   CANDIDATOS FICTÍCIOS
===================================== */

const candidatos = {


    GOVERNADOR: {

        "12345": {

            nome:
                "CARLOS ALMEIDA",

            partido:
                "PARTIDO FUTURO"

        },


        "54321": {

            nome:
                "ANA FERREIRA",

            partido:
                "UNIÃO POPULAR"

        }

    },


    SENADOR: {

        "11111": {

            nome:
                "RAFAEL COSTA",

            partido:
                "PARTIDO NACIONAL"

        },


        "22222": {

            nome:
                "JULIANA MARTINS",

            partido:
                "MOVIMENTO DEMOCRÁTICO"

        }

    },


    DEPUTADO: {

        "33333": {

            nome:
                "LUCAS SANTOS",

            partido:
                "PARTIDO CIDADÃO"

        },


        "44444": {

            nome:
                "MARINA SOUZA",

            partido:
                "ALIANÇA SOCIAL"

        }

    }

};


/* =====================================
   ESTADO DA VOTAÇÃO
===================================== */

const cargos = [

    "GOVERNADOR",

    "SENADOR",

    "DEPUTADO"

];


let indiceCargo = 0;

let numeroDigitado = "";

let votoBranco = false;

let votoConfirmado = false;

let eleitorAtual = 1;


/* =====================================
   SONS
===================================== */

function criarSom(

    frequencia,

    duracao

) {

    try {

        const audioContext =

            new (

                window.AudioContext ||

                window.webkitAudioContext

            )();


        const oscilador =
            audioContext.createOscillator();


        const volume =
            audioContext.createGain();


        oscilador.frequency.value =
            frequencia;


        volume.gain.setValueAtTime(

            0.12,

            audioContext.currentTime

        );


        oscilador.connect(volume);

        volume.connect(

            audioContext.destination

        );


        oscilador.start();


        volume.gain.exponentialRampToValueAtTime(

            0.001,

            audioContext.currentTime +
            duracao

        );


        oscilador.stop(

            audioContext.currentTime +
            duracao

        );

    }

    catch (erro) {

        console.log(
            "Som indisponível."
        );

    }

}


function somTecla() {

    criarSom(

        500,

        0.08

    );

}


function somConfirma() {

    criarSom(

        700,

        0.15

    );


    setTimeout(

        function () {

            criarSom(

                900,

                0.3

            );

        },

        170

    );

}


/* =====================================
   DIGITAR NÚMERO
===================================== */

teclas.forEach(

    function (tecla) {

        tecla.addEventListener(

            "click",

            function () {

                if (

                    votoConfirmado ||

                    numeroDigitado.length >= 5

                ) {

                    return;

                }


                votoBranco = false;


                numeroDigitado +=

                    tecla.dataset.numero;


                somTecla();


                atualizarNumeros();


                verificarCandidato();

            }

        );

    }

);


/* =====================================
   ATUALIZAR OS CINCO NÚMEROS
===================================== */

function atualizarNumeros() {

    caixasNumero.forEach(

        function (

            caixa,

            indice

        ) {

            caixa.textContent =

                numeroDigitado[indice] ||

                "";

        }

    );

}


/* =====================================
   VERIFICAR CANDIDATO
===================================== */

function verificarCandidato() {

    if (

        numeroDigitado.length < 5

    ) {

        mensagemUrna.textContent =

            "DIGITE O NÚMERO DO CANDIDATO";


        return;

    }


    const cargoAtual =

        cargos[indiceCargo];


    const candidato =

        candidatos[cargoAtual]
        [numeroDigitado];


    dadosCandidato.classList.add(
        "ativo"
    );


    if (candidato) {

        nomeCandidato.textContent =

            candidato.nome;


        partidoCandidato.textContent =

            candidato.partido;


        mensagemUrna.textContent =

            "CONFIRA OS DADOS E CONFIRME";

    }

    else {

        nomeCandidato.textContent =

            "NÚMERO INVÁLIDO";


        partidoCandidato.textContent =

            "---";


        mensagemUrna.textContent =

            "NÚMERO INVÁLIDO";

    }

}


/* =====================================
   BOTÃO CORRIGE
===================================== */

botaoCorrige.addEventListener(

    "click",

    function () {

        if (votoConfirmado) {

            return;

        }


        numeroDigitado = "";

        votoBranco = false;


        atualizarNumeros();


        dadosCandidato.classList.remove(
            "ativo"
        );


        nomeCandidato.textContent =

            "Digite o número";


        partidoCandidato.textContent =

            "---";


        mensagemUrna.textContent =

            "DIGITE O NÚMERO DO CANDIDATO";


        somTecla();

    }

);


/* =====================================
   BOTÃO BRANCO
===================================== */

botaoBranco.addEventListener(

    "click",

    function () {

        if (votoConfirmado) {

            return;

        }


        numeroDigitado = "";

        votoBranco = true;


        atualizarNumeros();


        dadosCandidato.classList.remove(
            "ativo"
        );


        mensagemUrna.textContent =

            "VOTO EM BRANCO";


        somTecla();

    }

);


/* =====================================
   CONFIRMAR
===================================== */

botaoConfirma.addEventListener(

    "click",

    function () {

        if (votoConfirmado) {

            return;

        }


        const cargoAtual =

            cargos[indiceCargo];


        const candidato =

            candidatos[cargoAtual]
            [numeroDigitado];


        if (

            !votoBranco &&

            !candidato

        ) {

            mensagemUrna.textContent =

                "DIGITE UM CANDIDATO VÁLIDO";

            return;

        }


        votoConfirmado = true;


        mensagemUrna.textContent =

            "VOTO CONFIRMADO";


        somConfirma();


        setTimeout(

            proximoCargo,

            1300

        );

    }

);


/* =====================================
   PRÓXIMO CARGO
===================================== */

function proximoCargo() {

    indiceCargo++;


    if (

        indiceCargo < cargos.length

    ) {

        cargoTela.textContent =

            cargos[indiceCargo];


        reiniciarVotacao();

    }

    else {

        finalizarEleicao();

    }

}


/* =====================================
   REINICIAR
===================================== */

function reiniciarVotacao() {

    numeroDigitado = "";

    votoBranco = false;

    votoConfirmado = false;


    atualizarNumeros();


    dadosCandidato.classList.remove(
        "ativo"
    );


    nomeCandidato.textContent =

        "Digite o número";


    partidoCandidato.textContent =

        "---";


    mensagemUrna.textContent =

        "DIGITE O NÚMERO DO CANDIDATO";

}


/* =====================================
   FINAL
===================================== */

function finalizarEleicao() {

    document.querySelector(".tela")
        .innerHTML =

        "<div class='fim-texto'>FIM</div>";


    document.querySelector(".tela")
        .classList.add(
            "tela-fim"
        );


    somConfirma();


    eleitorAtual++;


    numeroEleitor.textContent =

        eleitorAtual;


    setTimeout(

        function () {

            if (

                eleitorAtual <= 2

            ) {

                reiniciarSistema();

            }

        },

        3000

    );

}


/* =====================================
   NOVO ELEITOR
===================================== */

function reiniciarSistema() {

    location.reload();

}