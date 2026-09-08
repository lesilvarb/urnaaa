/* =========================================
 URNA ELETRÔNICA - FUNCIONAMENTO
========================================= */


/* =========================================
 CANDIDATOS FICTÍCIOS
========================================= */

const candidatos = {

  governador: {
      "12": {
          nome: "João Silva",
          partido: "Partido da União"
      },

      "45": {
          nome: "Maria Souza",
          partido: "Partido Democrático"
      }
  },


  senador: {
      "123": {
          nome: "Carlos Oliveira",
          partido: "Partido Popular"
      },

      "456": {
          nome: "Ana Santos",
          partido: "Partido Nacional"
      }
  },


  deputado: {
      "12345": {
          nome: "Lucas Ferreira",
          partido: "Partido da Juventude"
      },

      "54321": {
          nome: "Juliana Costa",
          partido: "Partido Social"
      }
  }

};


/* =========================================
 ELEMENTOS DO HTML
========================================= */

const cargoTela =
  document.getElementById("cargoTela");


const numero1 =
  document.getElementById("numero1");

const numero2 =
  document.getElementById("numero2");

const numero3 =
  document.getElementById("numero3");

const numero4 =
  document.getElementById("numero4");

const numero5 =
  document.getElementById("numero5");


const nomeCandidato =
  document.getElementById("nomeCandidato");

const partidoCandidato =
  document.getElementById("partidoCandidato");

const mensagemUrna =
  document.getElementById("mensagemUrna");


const teclas =
  document.querySelectorAll(".tecla");


const botaoBranco =
  document.getElementById("branco");

const botaoCorrige =
  document.getElementById("corrige");

const botaoConfirma =
  document.getElementById("confirma");


/* =========================================
 CONTROLE DA VOTAÇÃO
========================================= */


/* Cargos da eleição */

const cargos = [

  {
      nome: "GOVERNADOR",
      tipo: "governador",
      quantidade: 2
  },

  {
      nome: "SENADOR",
      tipo: "senador",
      quantidade: 3
  },

  {
      nome: "DEPUTADO",
      tipo: "deputado",
      quantidade: 5
  }

];


/* Começa pelo governador */

let cargoAtual = 0;


/* Números digitados */

let numerosDigitados = "";


/* Guarda se o voto foi confirmado */

let votoConfirmado = false;


/* =========================================
 SOM DA URNA
========================================= */

/* =========================================
   SISTEMA DE SONS DA URNA
========================================= */

/*
   Cria o contexto responsável
   por gerar os sons
*/

const AudioContexto =
    window.AudioContext ||
    window.webkitAudioContext;


/*
   Guarda o sistema de áudio
*/

let contextoAudio = null;


/* =========================================
   PREPARAR O ÁUDIO
========================================= */

function prepararAudio() {

    /*
       Cria o áudio apenas quando
       o usuário interage com a urna
    */

    if (!contextoAudio) {

        contextoAudio =
            new AudioContexto();

    }


    /*
       Se o navegador bloqueou
       temporariamente o áudio,
       ativa novamente
    */

    if (
        contextoAudio.state === "suspended"
    ) {

        contextoAudio.resume();

    }

}


/* =========================================
   SOM DAS TECLAS NUMÉRICAS
========================================= */

function tocarSomTecla() {

    prepararAudio();


    const oscilador =
        contextoAudio.createOscillator();


    const volume =
        contextoAudio.createGain();


    /*
       Frequência do som
    */

    oscilador.frequency.value =
        650;


    /*
       Tipo do som
    */

    oscilador.type =
        "square";


    /*
       Volume inicial
    */

    volume.gain.setValueAtTime(

        0.08,

        contextoAudio.currentTime

    );


    /*
       O volume diminui rapidamente
    */

    volume.gain.exponentialRampToValueAtTime(

        0.001,

        contextoAudio.currentTime + 0.08

    );


    /*
       Liga os componentes
    */

    oscilador.connect(volume);

    volume.connect(
        contextoAudio.destination
    );


    /*
       Inicia o som
    */

    oscilador.start();


    /*
       Finaliza o som
    */

    oscilador.stop(

        contextoAudio.currentTime + 0.08

    );

}


/* =========================================
   SOM DO BOTÃO CORRIGE
========================================= */

function tocarSomCorrige() {

    prepararAudio();


    const oscilador =
        contextoAudio.createOscillator();


    const volume =
        contextoAudio.createGain();


    oscilador.frequency.value =
        350;


    oscilador.type =
        "square";


    volume.gain.setValueAtTime(

        0.07,

        contextoAudio.currentTime

    );


    volume.gain.exponentialRampToValueAtTime(

        0.001,

        contextoAudio.currentTime + 0.12

    );


    oscilador.connect(volume);

    volume.connect(
        contextoAudio.destination
    );


    oscilador.start();


    oscilador.stop(

        contextoAudio.currentTime + 0.12

    );

}


/* =========================================
   SOM DO BOTÃO BRANCO
========================================= */

function tocarSomBranco() {

    prepararAudio();


    const oscilador =
        contextoAudio.createOscillator();


    const volume =
        contextoAudio.createGain();


    oscilador.frequency.value =
        500;


    oscilador.type =
        "sine";


    volume.gain.setValueAtTime(

        0.08,

        contextoAudio.currentTime

    );


    volume.gain.exponentialRampToValueAtTime(

        0.001,

        contextoAudio.currentTime + 0.15

    );


    oscilador.connect(volume);

    volume.connect(
        contextoAudio.destination
    );


    oscilador.start();


    oscilador.stop(

        contextoAudio.currentTime + 0.15

    );

}


/* =========================================
   SOM DO BOTÃO CONFIRMA
========================================= */

function tocarSomConfirma() {

    prepararAudio();


    const oscilador =
        contextoAudio.createOscillator();


    const volume =
        contextoAudio.createGain();


    oscilador.frequency.value =
        750;


    oscilador.type =
        "sine";


    volume.gain.setValueAtTime(

        0.1,

        contextoAudio.currentTime

    );


    volume.gain.exponentialRampToValueAtTime(

        0.001,

        contextoAudio.currentTime + 0.18

    );


    oscilador.connect(volume);

    volume.connect(
        contextoAudio.destination
    );


    oscilador.start();


    oscilador.stop(

        contextoAudio.currentTime + 0.18

    );

}


/* =========================================
   MELODIA FINAL DA URNA
========================================= */

function tocarSomFinal() {

    prepararAudio();


    /*
       Notas da melodia de encerramento
    */

    const notas = [

        {
            frequencia: 523.25,
            inicio: 0,
            duracao: 0.18
        },

        {
            frequencia: 659.25,
            inicio: 0.18,
            duracao: 0.18
        },

        {
            frequencia: 783.99,
            inicio: 0.36,
            duracao: 0.35
        }

    ];


    /*
       Cria cada nota
    */

    notas.forEach(

        function (nota) {

            const oscilador =
                contextoAudio.createOscillator();


            const volume =
                contextoAudio.createGain();


            oscilador.frequency.value =
                nota.frequencia;


            oscilador.type =
                "sine";


            /*
               Volume da nota
            */

            volume.gain.setValueAtTime(

                0.12,

                contextoAudio.currentTime +
                nota.inicio

            );


            /*
               Finaliza o volume suavemente
            */

            volume.gain.exponentialRampToValueAtTime(

                0.001,

                contextoAudio.currentTime +
                nota.inicio +
                nota.duracao

            );


            oscilador.connect(volume);

            volume.connect(
                contextoAudio.destination
            );


            oscilador.start(

                contextoAudio.currentTime +
                nota.inicio

            );


            oscilador.stop(

                contextoAudio.currentTime +
                nota.inicio +
                nota.duracao

            );

        }

    );

}

/* =========================================
 ATUALIZAR TELA
========================================= */

function atualizarTela() {

    /* Pega as informações do cargo atual */

    const cargo =
        cargos[cargoAtual];


    /* Mostra o nome do cargo */

    cargoTela.textContent =
        cargo.nome;


    /* Guarda todas as caixas de números */

    const caixas = [

        numero1,
        numero2,
        numero3,
        numero4,
        numero5

    ];


    /* Percorre todas as caixas */

    caixas.forEach(

        function (caixa, indice) {

            /*
               Se o cargo precisa dessa posição,
               a caixa aparece
            */

            if (indice < cargo.quantidade) {

                caixa.style.display =
                    "flex";

            }

            /*
               Se não precisa,
               a caixa desaparece
            */

            else {

                caixa.style.display =
                    "none";

            }


            /* Coloca o número digitado */

            caixa.textContent =
                numerosDigitados[indice] || "";

        }

    );


    /* Verifica o candidato */

    verificarCandidato();

}

/* =========================================
 VERIFICAR CANDIDATO
========================================= */

function verificarCandidato() {

  const cargo =
      cargos[cargoAtual];


  /* Procura o candidato pelo número */

  const candidato =
      candidatos[cargo.tipo][
          numerosDigitados
      ];


  if (candidato) {

      nomeCandidato.textContent =
          candidato.nome;


      partidoCandidato.textContent =
          candidato.partido;


      mensagemUrna.textContent =
          "CONFIRA SEUS DADOS";


  }

  else {

      nomeCandidato.textContent =
          "Digite o número";


      partidoCandidato.textContent =
          "---";


      mensagemUrna.textContent =
          "DIGITE O NÚMERO DO CANDIDATO";

  }

}


/* =========================================
 DIGITAR NÚMERO
========================================= */

teclas.forEach(

  function (tecla) {

      tecla.addEventListener(

          "click",

          function () {

              /* Não permite votar após confirmar */

              if (votoConfirmado) {

                  return;

              }


              const quantidadeMaxima =
                  cargos[cargoAtual].quantidade;


              /* Verifica o limite de números */

              if (

                  numerosDigitados.length >=
                  quantidadeMaxima

              ) {

                  return;

              }


              /* Pega o número da tecla */

              const numero =
                  tecla.dataset.numero;


              /* Adiciona o número */

              numerosDigitados +=
                  numero;


              /* Toca o som */

              tocarSomTecla();


              /* Atualiza a tela */

              atualizarTela();

          }

      );

  }

);


/* =========================================
 BOTÃO CORRIGE
========================================= */

botaoCorrige.addEventListener(

    "click",

    function () {

        /* Toca o som do botão */

        tocarSomCorrige();


        /* Remove o último número */

        numerosDigitados =
            numerosDigitados.slice(
                0,
                -1
            );


        /* Atualiza a tela */

        atualizarTela();

    }

);

/* =========================================
 BOTÃO BRANCO
========================================= */

botaoBranco.addEventListener(

    "click",

    function () {

        if (votoConfirmado) {

            return;

        }


        /* Toca o som */

        tocarSomBranco();


        /* Limpa os números */

        numerosDigitados = "";


        /* Marca o voto como branco */

        votoBranco = true;


        /* Atualiza a tela */

        atualizarTela();


        /* Mostra a informação */

        nomeCandidato.textContent =
            "VOTO EM BRANCO";


        partidoCandidato.textContent =
            "---";


        mensagemUrna.textContent =
            "PRESSIONE CONFIRMA";

    }

);
/* =========================================
 BOTÃO CONFIRMA
========================================= */

botaoConfirma.addEventListener(

    "click",

    function () {

        if (votoConfirmado) {

            return;

        }


        const cargo =
            cargos[cargoAtual];


        const candidato =
            candidatos[cargo.tipo][
                numerosDigitados
            ];


        /*
           Se não existe candidato
           e não foi voto branco
        */

        if (

            !candidato &&

            !votoBranco

        ) {

            mensagemUrna.textContent =
                "VOTO NULO";

        }


        /*
           Toca o som da confirmação
        */

        tocarSomConfirma();


        /*
           Mostra a confirmação
        */

        mensagemUrna.textContent =
            "VOTO CONFIRMADO";


        votoConfirmado = true;


        /*
           Aguarda antes de mudar
           para o próximo cargo
        */

        setTimeout(

            function () {

                proximoCargo();

            },

            1200

        );

    }

);
/* =========================================
 PRÓXIMO CARGO
========================================= */

function proximoCargo() {

  /* Avança o cargo */

  cargoAtual++;


  /*
     Verifica se ainda existem cargos
  */

  if (

      cargoAtual < cargos.length

  ) {

      /* Limpa a votação */

      numerosDigitados = "";


      votoBranco = false;


      votoConfirmado = false;


      /* Atualiza a urna */

      atualizarTela();

  }

  else {

      finalizarEleicao();

  }

}


/* =========================================
 FINALIZAR ELEIÇÃO
========================================= */

/* =========================================
   FINALIZAR ELEIÇÃO
========================================= */

function finalizarEleicao() {

    /*
       Esconde todas as caixas
       de números
    */

    numero1.style.display = "none";

    numero2.style.display = "none";

    numero3.style.display = "none";

    numero4.style.display = "none";

    numero5.style.display = "none";


    /*
       Mostra somente FIM
    */

    cargoTela.textContent =
        "FIM";


    /*
       Remove os outros textos
    */

    nomeCandidato.textContent =
        "";


    partidoCandidato.textContent =
        "";


    /*
       Limpa a mensagem inferior
    */

    mensagemUrna.textContent =
        "";


    /*
       Toca a melodia final
    */

    setTimeout(

        function () {

            tocarSomFinal();

        },

        300

    );

}