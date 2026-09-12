/* =========================================
   ESTADO GLOBAL DO SOBERANO
========================================= */
let nivel = 1;
let almas = 0;
let almasNecessarias = 30;

let vidaMax = 20;
let vida = vidaMax;
let danoAtaque = 5;
let agilidade = 0;

let macasMax = 5;
let macas = macasMax;
let animaisCapturados = [];

let animalAtual = null;

// CARREGAMENTO DAS IMAGENS PRINCIPAIS
const heroiImg = new Image();
heroiImg.src = "assets/img/heroi.png";

const fundoArenaImg = new Image();
fundoArenaImg.src = "assets/img/fundo_arena.png";

const fogueiraFundoImg = new Image();
fogueiraFundoImg.src = "assets/img/fogueira_fundo.png";

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
   SISTEMA DE MODAIS E INTERFACE
========================================= */

function mostrarModal(texto, callbackOk = null, textoOk = "OK", callbackCancelar = null, textoCancelar = "Cancelar") {
    document.getElementById("modal-box").classList.remove("modo-bestiario");
    document.getElementById("modal-texto").innerText = texto;
    let botoesContainer = document.getElementById("modal-botoes-container");
    botoesContainer.innerHTML = "";

    let btnOk = document.createElement("button");
    btnOk.className = "modal-btn";
    btnOk.innerText = textoOk;
    btnOk.onclick = () => {
        fecharModal();
        if (callbackOk) callbackOk();
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
    document.getElementById("modal-box").classList.remove("modo-bestiario");
    document.getElementById("modal-overlay").style.display = "none";
}

function atualizarStatus() {
    document.getElementById("status-panel").innerText =
        `Nv: ${nivel} | Almas: ${almas} | ❤️ HP: ${vida}/${vidaMax} | ⚔️ Dano: ${danoAtaque} | 💨 Agilidade: ${agilidade} | 🍎 Maçãs: ${macas}/${macasMax}`;
}

function definirBotoes(html) {
    document.getElementById("menu-acoes").innerHTML = html;
}

/* =========================================
   EXPLORAÇÃO E AÇÕES
========================================= */

function explorar() {
    animalAtual = inimigos[Math.floor(Math.random() * inimigos.length)];
    document.getElementById("narrativa-texto").innerText = `⚠️ Um(a) ${animalAtual.nome} selvagem surgiu das sombras!`;

    document.getElementById("monstro-info").style.display = "block";
    document.getElementById("monstro-arena").src = animalAtual.imgSrc;
    document.getElementById("titulo-arena").innerText = `⚔️ ${animalAtual.nome.toUpperCase()} ⚔️`;

    definirBotoes(`
        <button class="btn" onclick="jogarMaca()" style="background-color: #2d5a27;">🍎 Jogar Maçã Mágica</button><br>
        <button class="btn" onclick="fugir()" style="background-color: #5a2727;">🏃 Tentar Fugir</button>
    `);
}

function jogarMaca() {
    if (macas > 0) {
        macas--;
        atualizarStatus();

        if (Math.random() <= animalAtual.chance) {
            animaisCapturados.push(animalAtual.nome);
            almas += animalAtual.almas;
            mostrarModal(`🌟 ${animalAtual.nome} foi capturado(a) na maçã!\nVossa Majestade ganhou ${animalAtual.almas} Almas.`, () => {
                restaurarMenuPrincipal();
            });
        } else {
            mostrarModal(`❌ O(a) ${animalAtual.nome} desviou e iniciou um ataque feroz!`, () => {
                iniciarArena();
            });
        }
    } else {
        mostrarModal("❌ Suas maçãs acabaram! Defenda-se na arena!", () => {
            iniciarArena();
        });
    }
}

function fugir() {
    const chanceFuga = Math.random();

    if (chanceFuga < 0.35) {
        mostrarModal("🏃 Vossa Majestade usou a agilidade e conseguiu fugir das sombras!", () => {
            restaurarMenuPrincipal();
        });
    } else {
        mostrarModal(`❌ A fuga falhou! O(a) ${animalAtual.nome} cercou Vossa Majestade e atacou!`, () => {
            iniciarArena();
        });
    }
}

function restaurarMenuPrincipal() {
    limparTeclas();
    window.onkeydown = null;
    window.onkeyup = null;
    pararAnimacaoFogueira();

    document.getElementById("container").classList.remove("em-combate");
    document.getElementById("container").classList.remove("em-fogueira");

    document.getElementById("monstro-info").style.display = "none";
    document.getElementById("fogueira-arte-container").style.display = "none";
    document.getElementById("arena-box").style.display = "none";
    document.getElementById("fogueira-box").style.display = "none";

    document.getElementById("menu-acoes").style.display = "block";
    document.getElementById("narrativa-texto").innerText = "O reino aguarda suas ordens, meu Soberano.";
    atualizarStatus();

    definirBotoes(`
        <button class="btn" onclick="explorar()">🌲 Explorar Ermos</button><br>
        <button class="btn" onclick="fogueira()">🔥 Descansar na Fogueira</button><br>
        <button class="btn" onclick="mostrarInventario()">🎒 Ver Feras Capturadas</button>
    `);
}

/* =========================================
   BESTIÁRIO E INVENTÁRIO
========================================= */

function mostrarInventario() {
    if (animaisCapturados.length === 0) {
        mostrarModal("O canil imperial ainda me parece vazio, meu Soberano.");
        return;
    }

    const modalBox = document.getElementById("modal-box");
    const modalTexto = document.getElementById("modal-texto");
    const botoesContainer = document.getElementById("modal-botoes-container");

    modalBox.classList.add("modo-bestiario");

    const contagem = {};
    animaisCapturados.forEach(animal => {
        contagem[animal] = (contagem[animal] || 0) + 1;
    });

    let listaHTML = `<ul style="list-style: none; padding: 0; margin: 0;">`;

    for (const [nome, qtd] of Object.entries(contagem)) {
        listaHTML += `
            <li style="padding: 8px; border: 1px solid rgba(255,51,51,0.3); margin-bottom: 6px; border-radius: 4px; display: flex; justify-content: space-between; font-size: 9px; cursor: pointer;" onclick="exibirDetalhesFera('${nome}')">
                <span>• ${nome}</span>
                <span style="color: #ffcc00;">x${qtd}</span>
            </li>`;
    }

    listaHTML += `</ul>`;

    modalTexto.innerHTML = `
        <div id="bestiario-lista">
            <h4 style="color: #ff3333; font-size: 9px; margin-top: 0; margin-bottom: 10px;">FERAS DOMADAS</h4>
            ${listaHTML}
        </div>
        <div id="bestiario-detalhes">
            <p style="font-size: 9px; color: #aaa;">Selecione uma fera ao lado para inspecionar vossa conquista.</p>
        </div>
    `;

    botoesContainer.innerHTML = `<button class="modal-btn" onclick="fecharModal()">OK</button>`;
    document.getElementById("modal-overlay").style.display = "flex";
}

function exibirDetalhesFera(nomeFera) {
    const dados = inimigos.find(i => i.nome === nomeFera);
    const detalhesContainer = document.getElementById("bestiario-detalhes");

    if (dados) {
        detalhesContainer.innerHTML = `
            <img src="${dados.imgSrc}" alt="${dados.nome}" style="max-width: 120px; max-height: 120px; margin-bottom: 10px; border-radius: 6px; border: 1px solid #ff3333;">
            <h3 style="color: #ff3333; font-size: 10px; margin: 5px 0;">${dados.nome}</h3>
            <p style="font-size: 8px; color: #ffcc00; line-height: 1.6;">
                <b>Dano Base:</b> ${dados.dano}<br>
                <b>Almas Concedidas:</b> ${dados.almas}<br>
                <b>Ataque:</b> ${dados.simboloAtaque}
            </p>
        `;
    }
}