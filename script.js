/* =========================================
   ESTADO GLOBAL DO SOBERANO
========================================= */

let nivel = 1;
let almas = 0;
let almasNecessarias = 30;

let vidaMax = 30;
let vida = vidaMax;
let danoAtaque = 5;
let agilidade = 0;

let macasMax = 5;
let macas = macasMax;
let animaisCapturados = [];

let animalAtual = null;


/* =========================================
   SISTEMA DE CLASSES E HERÓIS
========================================= */

const classesDisponiveis = {
    rei: {
        nome: "Soberano Fenrir",
        imgSrc: "assets/img/heroi_rei.png",
        descricao: "👑 Rei Supremo (+5 HP, +2 Dano, +1 Agilidade)"
    },

    rainha: {
        nome: "Rainha Fenrys",
        imgSrc: "assets/img/heroi_rainha.png",
        descricao: "👸 Nobre e Graciosa (+8 HP, +2 Maçãs Máximas)"
    },

    cavaleiro: {
        nome: "Cavaleiro Imperial",
        imgSrc: "assets/img/heroi_cavaleiro.png",
        descricao: "🛡️ Tanque de Batalha (+10 HP Máximo)"
    },

    arqueiro: {
        nome: "Arqueiro das Sombras",
        imgSrc: "assets/img/heroi_arqueiro.png",
        descricao: "💨 Veloz e Esguio (+2 Agilidade Inicial)"
    },

    mago: {
        nome: "Mago Arcano",
        imgSrc: "assets/img/heroi_mago.png",
        descricao: "🔮 Mestre do Dano (+3 Dano de Ataque)"
    },

    domador: {
        nome: "Domador de Feras",
        imgSrc: "assets/img/heroi_domador.png",
        descricao: "🍎 Mestre das Maçãs (+3 Maçãs Máximas)"
    }
};

let classeAtual = "rei";


/* =========================================
   CARREGAMENTO DAS IMAGENS PRINCIPAIS
========================================= */

const heroiImg = new Image();
heroiImg.src = classesDisponiveis[classeAtual].imgSrc;

const fundoArenaImg = new Image();
fundoArenaImg.src = "assets/img/fundo_arena.png";

const fogueiraFundoImg = new Image();
fogueiraFundoImg.src = "assets/img/fogueira_fundo.png";


/* =========================================
   CONTROLES DA ARENA
========================================= */

let teclasPressionadas = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false
};

function limparTeclas() {
    teclasPressionadas.ArrowLeft = false;
    teclasPressionadas.ArrowRight = false;
    teclasPressionadas.ArrowUp = false;
    teclasPressionadas.ArrowDown = false;
}


/* =========================================
   SISTEMA DE CLASSES
========================================= */

function tocarEfeitoSelecao(isRoyal = false) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        if (isRoyal) {
            const notas = [523.25, 659.25, 783.99, 1046.50];

            notas.forEach((freq, index) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = "triangle";
                osc.frequency.value = freq;

                gain.gain.setValueAtTime(
                    0.2,
                    audioCtx.currentTime + index * 0.08
                );

                gain.gain.exponentialRampToValueAtTime(
                    0.001,
                    audioCtx.currentTime + index * 0.08 + 0.35
                );

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start(audioCtx.currentTime + index * 0.08);
                osc.stop(audioCtx.currentTime + index * 0.08 + 0.35);
            });

        } else {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = "sine";

            osc.frequency.setValueAtTime(
                440,
                audioCtx.currentTime
            );

            osc.frequency.exponentialRampToValueAtTime(
                880,
                audioCtx.currentTime + 0.15
            );

            gain.gain.setValueAtTime(
                0.15,
                audioCtx.currentTime
            );

            gain.gain.exponentialRampToValueAtTime(
                0.001,
                audioCtx.currentTime + 0.15
            );

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
        }

    } catch (e) {
        console.log("Áudio aguardando interação inicial.");
    }
}


function abrirSelecaoClasse() {

    const modalBox = document.getElementById("modal-box");
    const modalTexto = document.getElementById("modal-texto");
    const botoesContainer =
        document.getElementById("modal-botoes-container");

    modalBox.classList.remove("modo-bestiario");

    let html = `
        <h3 style="color: #8fa3b3; margin-top: 0; font-size: 11px;">
            👑 ESCOLHA SEU HERÓI 👑
        </h3>
    `;

    html += `
        <div style="
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-top: 10px;
            max-height: 50vh;
            overflow-y: auto;
        ">
    `;

    for (const [key, c] of Object.entries(classesDisponiveis)) {

        const estaSelecionado = key === classeAtual;
        const ehRealeza = key === "rei" || key === "rainha";

        let estiloBorda = "";

        if (estaSelecionado) {
            estiloBorda = `
                border: 2px solid #ffcc00;
                background: rgba(255, 204, 0, 0.25);
                box-shadow: 0 0 14px rgba(255, 204, 0, 0.8);
            `;
        } else if (ehRealeza) {
            estiloBorda = `
                border: 1px solid #ffcc00;
                background: rgba(255, 204, 0, 0.08);
                box-shadow: 0 0 8px rgba(255, 204, 0, 0.35);
            `;
        } else {
            estiloBorda = `
                border: 1px solid #5a6a78;
                background: #090c10;
            `;
        }

        html += `
            <div
                style="
                    padding: 10px;
                    border-radius: 6px;
                    cursor: pointer;
                    text-align: center;
                    transition: all 0.2s;
                    ${estiloBorda}
                "
                onclick="selecionarClasse('${key}')"
            >
                <img
                    src="${c.imgSrc}"
                    style="
                        width: 55px;
                        height: 55px;
                        object-fit: contain;
                        margin: 0 auto;
                        display: block;
                    "
                >

                <div style="
                    font-size: 9px;
                    color: ${ehRealeza ? "#ffcc00" : "#8fa3b3"};
                    margin-top: 6px;
                    font-weight: bold;
                ">
                    ${c.nome}
                </div>

                <div style="
                    font-size: 7px;
                    color: #aaa;
                    margin-top: 4px;
                    line-height: 1.4;
                ">
                    ${c.descricao}
                </div>
            </div>
        `;
    }

    html += `</div>`;

    modalTexto.innerHTML = html;

    botoesContainer.innerHTML = `
        <button class="modal-btn" onclick="fecharModal()">
            Voltar
        </button>
    `;

    document.getElementById("modal-overlay").style.display = "flex";
}


function selecionarClasse(chave) {

    if (!classesDisponiveis[chave]) return;

    if (chave === classeAtual) {
        mostrarModal(
            `Vossa Majestade já está no comando de ${classesDisponiveis[chave].nome}!`
        );

        return;
    }

    mostrarModal(
        `⚠️ ATENÇÃO, MEU SOBERANO!\n\nTrocar para ${classesDisponiveis[chave].nome} resetará todo o progresso atual (Nível, Almas e Feras Domadas).\n\nDeseja realmente iniciar uma nova jornada?`,
        () => aplicarTrocaClasse(chave),
        "Sim, Reiniciar",
        () => abrirSelecaoClasse(),
        "Cancelar"
    );
}


function aplicarTrocaClasse(chave) {

    classeAtual = chave;

    const c = classesDisponiveis[chave];

    heroiImg.src = c.imgSrc;

    nivel = 1;
    almas = 0;
    almasNecessarias = 30;
    animaisCapturados = [];

    vidaMax = 20;
    danoAtaque = 5;
    agilidade = 0;
    macasMax = 5;

    const ehRealeza =
        chave === "rei" ||
        chave === "rainha";

    tocarEfeitoSelecao(ehRealeza);

    if (chave === "rei") {
        vidaMax = 25;
        danoAtaque = 7;
        agilidade = 1;

    } else if (chave === "rainha") {
        vidaMax = 28;
        macasMax = 7;

    } else if (chave === "cavaleiro") {
        vidaMax = 30;

    } else if (chave === "arqueiro") {
        agilidade = 2;

    } else if (chave === "mago") {
        danoAtaque = 8;

    } else if (chave === "domador") {
        macasMax = 8;
    }

    vida = vidaMax;
    macas = macasMax;

    atualizarStatus();

    if (chave === "rei") {
        mostrarModal(
            `👑 Curvem-se perante o Soberano Fenrir!\nUma nova jornada se inicia no Nível 1 com o comando do Rei Supremo!`
        );

    } else if (chave === "rainha") {
        mostrarModal(
            `👸 Salvem a Rainha!\nUma nova jornada se inicia no Nível 1 sob a graça da Rainha!`
        );

    } else {
        mostrarModal(
            `✨ Nova jornada iniciada!\nVossa Majestade assumiu o manto de ${c.nome} no Nível 1.`
        );
    }
}


/* =========================================
   SISTEMA DE MODAIS
========================================= */

function mostrarModal(
    texto,
    callbackOk = null,
    textoOk = "OK",
    callbackCancelar = null,
    textoCancelar = "Cancelar"
) {

    document
        .getElementById("modal-box")
        .classList.remove("modo-bestiario");

    document.getElementById("modal-texto").innerText = texto;

    let botoesContainer =
        document.getElementById("modal-botoes-container");

    botoesContainer.innerHTML = "";

    let btnOk = document.createElement("button");

    btnOk.className = "modal-btn";
    btnOk.innerText = textoOk;

    btnOk.onclick = () => {
        fecharModal();

        if (callbackOk) {
            callbackOk();
        }
    };

    botoesContainer.appendChild(btnOk);

    if (callbackCancelar) {

        let btnCancelar = document.createElement("button");

        btnCancelar.className = "modal-btn";
        btnCancelar.innerText = textoCancelar;

        btnCancelar.onclick = () => {
            fecharModal();

            callbackCancelar();
        };

        botoesContainer.appendChild(btnCancelar);
    }

    document.getElementById("modal-overlay").style.display = "flex";
}


function fecharModal() {

    fecharDetalhesFera();

    document
        .getElementById("modal-box")
        .classList.remove("modo-bestiario");

    document.getElementById("modal-overlay").style.display = "none";
}


function atualizarStatus() {

    const nomeClasse =
        classesDisponiveis[classeAtual]
            ? classesDisponiveis[classeAtual].nome
            : "Herói";

    document.getElementById("status-panel").innerText =
        `[${nomeClasse}] Nv: ${nivel} | Almas: ${almas} | ❤️ HP: ${vida}/${vidaMax} | ⚔️ Dano: ${danoAtaque} | 💨 Agilidade: ${agilidade} | 🍎 Maçãs: ${macas}/${macasMax}`;
}


function definirBotoes(html) {
    document.getElementById("menu-acoes").innerHTML = html;
}


/* =========================================
   EXPLORAÇÃO
========================================= */

function explorar() {

    animalAtual =
        inimigos[Math.floor(Math.random() * inimigos.length)];

    document.getElementById("narrativa-texto").innerText =
        `⚠️ Um(a) ${animalAtual.nome} selvagem surgiu das sombras!`;

    document.getElementById("monstro-info").style.display = "block";

    document.getElementById("monstro-arena").src =
        animalAtual.imgSrc;

    document.getElementById("titulo-arena").innerText =
        `⚔️ ${animalAtual.nome.toUpperCase()} ⚔️`;

    definirBotoes(`
        <button
            class="btn"
            onclick="jogarMaca()"
            style="background-color: #2d5a27;"
        >
            🍎 Jogar Maçã Mágica
        </button>
        <br>

        <button
            class="btn"
            onclick="fugir()"
            style="background-color: #5a2727;"
        >
            🏃 Tentar Fugir
        </button>
    `);
}


function jogarMaca() {

    if (macas > 0) {

        macas--;

        atualizarStatus();

        if (Math.random() <= animalAtual.chance) {

            animaisCapturados.push(animalAtual.nome);

            almas += animalAtual.almas;

            mostrarModal(
                `🌟 ${animalAtual.nome} foi capturado(a) na maçã!\nVossa Majestade ganhou ${animalAtual.almas} Almas.`,
                () => {
                    restaurarMenuPrincipal();
                }
            );

        } else {

            mostrarModal(
                `❌ O(a) ${animalAtual.nome} desviou e iniciou um ataque feroz!`,
                () => {
                    iniciarArena();
                }
            );
        }

    } else {

        mostrarModal(
            "❌ Suas maçãs acabaram! Defenda-se na arena!",
            () => {
                iniciarArena();
            }
        );
    }
}


function fugir() {

    const chanceFuga = Math.random();

    if (chanceFuga < 0.35) {

        mostrarModal(
            "🏃 Vossa Majestade usou a agilidade e conseguiu fugir das sombras!",
            () => {
                restaurarMenuPrincipal();
            }
        );

    } else {

        mostrarModal(
            `❌ A fuga falhou! O(a) ${animalAtual.nome} cercou Vossa Majestade e atacou!`,
            () => {
                iniciarArena();
            }
        );
    }
}


function restaurarMenuPrincipal() {

    limparTeclas();

    window.onkeydown = null;
    window.onkeyup = null;

    if (typeof pararAnimacaoFogueira === "function") {
        pararAnimacaoFogueira();
    }

    document
        .getElementById("container")
        .classList.remove("em-combate");

    document
        .getElementById("container")
        .classList.remove("em-fogueira");

    document.getElementById("monstro-info").style.display = "none";

    document
        .getElementById("fogueira-arte-container")
        .style.display = "none";

    document.getElementById("arena-box").style.display = "none";

    document.getElementById("fogueira-box").style.display = "none";

    document.getElementById("menu-acoes").style.display = "block";

    document.getElementById("narrativa-texto").innerText =
        "O reino aguarda suas ordens, meu Soberano.";

    atualizarStatus();

    definirBotoes(`
        <button class="btn" onclick="explorar()">
            🌲 Explorar Ermos
        </button>
        <br>

        <button class="btn" onclick="fogueira()">
            🔥 Descansar na Fogueira
        </button>
        <br>

        <button class="btn" onclick="mostrarInventario()">
            🎒 Ver Feras Capturadas
        </button>
        <br>

        <button
            class="btn"
            onclick="abrirSelecaoClasse()"
            style="background-color: #3b2d54;"
        >
            👑 Escolher Herói
        </button>
    `);
}


/* =========================================
   BESTIÁRIO
========================================= */

function mostrarInventario() {

    if (animaisCapturados.length === 0) {

        mostrarModal(
            "O canil imperial ainda me parece vazio, meu Soberano."
        );

        return;
    }

    const modalBox =
        document.getElementById("modal-box");

    const modalTexto =
        document.getElementById("modal-texto");

    const botoesContainer =
        document.getElementById("modal-botoes-container");

    modalBox.classList.add("modo-bestiario");

    const contagem = {};

    animaisCapturados.forEach(animal => {
        contagem[animal] =
            (contagem[animal] || 0) + 1;
    });

    let cardsHTML = "";

    for (const [nome, qtd] of Object.entries(contagem)) {

        const dados =
            inimigos.find(i => i.nome === nome);

        if (!dados) continue;

        cardsHTML += `
            <div
                class="fera-card"
                onclick="exibirDetalhesFera('${nome}')"
            >

                <div class="fera-card-imagem">
                    <img
                        src="${dados.imgSrc}"
                        alt="${dados.nome}"
                    >
                </div>

                <div class="fera-card-nome">
                    ${dados.nome}
                </div>

                <div class="fera-card-qtd">
                    Capturada: x${qtd}
                </div>

            </div>
        `;
    }

    modalTexto.innerHTML = `
        <div id="bestiario-container">

            <div id="bestiario-cabecalho">

                <div>
                    <h2>🐾 FERAS CAPTURADAS 🐾</h2>

                    <p>
                        Suas conquistas do reino.
                        Clique em uma fera para inspecioná-la.
                    </p>
                </div>

                <div id="bestiario-contador">
                    ${Object.keys(contagem).length} FERA(S)
                </div>

            </div>

            <div id="bestiario-grid">
                ${cardsHTML}
            </div>

        </div>
    `;

    botoesContainer.innerHTML = `
        <button
            class="modal-btn"
            onclick="fecharModal()"
        >
            Voltar
        </button>
    `;

    document
        .getElementById("modal-overlay")
        .style.display = "flex";
}


function exibirDetalhesFera(nomeFera) {

    const dados =
        inimigos.find(i => i.nome === nomeFera);

    if (!dados) return;

    const contagem =
        animaisCapturados.filter(
            animal => animal === nomeFera
        ).length;

    const modalAnterior =
        document.getElementById("fera-detalhes-overlay");

    if (modalAnterior) {
        modalAnterior.remove();
    }

    const detalhesHTML =
        document.createElement("div");

    detalhesHTML.id =
        "fera-detalhes-overlay";

    detalhesHTML.innerHTML = `
        <div id="fera-detalhes-modal">

            <button
                id="fera-detalhes-fechar"
                onclick="fecharDetalhesFera()"
                aria-label="Fechar"
            >
                ✕
            </button>

            <div class="fera-detalhes-imagem">
                <img
                    src="${dados.imgSrc}"
                    alt="${dados.nome}"
                >
            </div>

            <h2>
                ${dados.nome}
            </h2>

            <div class="fera-detalhes-qtd">
                🐾 Capturada: x${contagem}
            </div>

            <div class="fera-detalhes-info">

                <div class="fera-info-item">
                    <span>⚔️ Dano</span>
                    <strong>${dados.dano}</strong>
                </div>

                <div class="fera-info-item">
                    <span>🔮 Almas</span>
                    <strong>${dados.almas}</strong>
                </div>

                <div class="fera-info-item">
                    <span>🎯 Chance</span>
                    <strong>${Math.round(dados.chance * 100)}%</strong>
                </div>

                <div class="fera-info-item">
                    <span>💥 Ataque</span>
                    <img
                        src="${dados.ataqueImgSrc}"
                        alt="Ataque de ${dados.nome}"
                        style="
                            width: 45px;
                            height: 45px;
                            object-fit: contain;
                            image-rendering: pixelated;
                        "
                    >
                </div>

            </div>

            <button
                class="modal-btn"
                onclick="fecharDetalhesFera()"
            >
                Voltar para as Feras
            </button>

        </div>
    `;

    document
        .getElementById("modal-box")
        .appendChild(detalhesHTML);
}


function fecharDetalhesFera() {

    const detalhes =
        document.getElementById("fera-detalhes-overlay");

    if (detalhes) {
        detalhes.remove();
    }
}


/* =========================================
   DERROTA
========================================= */

function verificarMorte() {

    mostrarModal(
        "💀 Vossa Majestade sucumbiu às sombras do reino...",

        () => {

            vida = vidaMax;
            macas = macasMax;
            almas = Math.floor(almas / 2);

            restaurarMenuPrincipal();
        },

        "Ressuscitar"
    );
}


/* =========================================
   INICIALIZAÇÃO
========================================= */

atualizarStatus();