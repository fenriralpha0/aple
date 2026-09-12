/* =========================================
   ESTADO GLOBAL DO SOBERANO
========================================= */
let nivel = 1;
let almas = 0;
let almasNecessarias = 30;

let vidaMax = 20;
let vida = vidaMax;
let danoAtaque = 5;
let agilidade = 1;

let macasMax = 5;
let macas = macasMax;
let animaisCapturados = [];

let animalAtual = null;

const heroiImg = new Image();
const fundoArenaImg = new Image();
fundoArenaImg.src = "assets/img/fundo_arena.png";

const fogueiraFundoImg = new Image();
fogueiraFundoImg.src = "assets/img/fogueira_fundo.png";

let teclasPressionadas = {
    ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false
};

const personagensDisponiveis = [
    { id: "rei", nome: "Soberano Fenrir", imgSrc: "assets/img/heroi_rei.png", descricao: "Equilibrado em vitalidade e agilidade.", hpBase: 20, danoBase: 5, agiBase: 1 },
    { id: "rainha", nome: "Rainha Soberana", imgSrc: "assets/img/heroi_rainha.png", descricao: "Graciosa e fatal no campo de batalha.", hpBase: 18, danoBase: 6, agiBase: 2 },
    { id: "cavaleiro", nome: "Paladino Sombrio", imgSrc: "assets/img/heroi_cavaleiro.png", descricao: "Alta vitalidade e resiliência extrema.", hpBase: 30, danoBase: 4, agiBase: 0 },
    { id: "mago", nome: "Arcanista do Abismo", imgSrc: "assets/img/heroi_mago.png", descricao: "Causa grande dano base aos inimigos.", hpBase: 15, danoBase: 8, agiBase: 1 },
    { id: "arqueiro", nome: "Arqueiro Mestre", imgSrc: "assets/img/heroi_arqueiro.png", descricao: "Movimentação rápida e precisão cirúrgica.", hpBase: 18, danoBase: 5, agiBase: 3 },
    { id: "domador", nome: "Domador de Feras", imgSrc: "assets/img/heroi_domador.png", descricao: "Especialista em lidar com criaturas selvagens.", hpBase: 22, danoBase: 5, agiBase: 2 }
];

let heroiSelecionado = personagensDisponiveis[0];

function renderizarSeletorPersonagens() {
    const grid = document.getElementById("lista-personagens");
    if (!grid) return;
    grid.innerHTML = "";
    personagensDisponiveis.forEach((p) => {
        const card = document.createElement("div");
        card.className = `card-personagem ${p.id === heroiSelecionado.id ? "ativo" : ""}`;
        card.onclick = () => selecionarPersonagem(p);
        card.innerHTML = `<img src="${p.imgSrc}" alt="${p.nome}" title="${p.nome}">`;
        grid.appendChild(card);
    });
}

function selecionarPersonagem(personagem) {
    heroiSelecionado = personagem;
    heroiImg.src = personagem.imgSrc;
    vidaMax = personagem.hpBase;
    vida = vidaMax;
    danoAtaque = personagem.danoBase;
    agilidade = personagem.agiBase;

    document.getElementById("nome-personagem").innerText = personagem.nome;
    document.getElementById("desc-personagem").innerText = personagem.descricao;
    atualizarStatus();
    renderizarSeletorPersonagens();
}

function limparTeclas() {
    teclasPressionadas = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false };
}

function mostrarModal(texto, callbackOk = null) {
    const container = document.getElementById("modal-container");
    const msg = document.getElementById("modal-mensagem");
    const btn = document.getElementById("modal-btn-ok");

    msg.innerText = texto;
    container.style.display = "flex";

    btn.onclick = () => {
        container.style.display = "none";
        if (callbackOk) callbackOk();
    };
}

function atualizarStatus() {
    document.getElementById("txt-nivel").innerText = `Nv: ${nivel}`;
    document.getElementById("txt-almas").innerText = `👻 Almas: ${almas}`;
    document.getElementById("txt-hp").innerText = `❤️ HP: ${vida}/${vidaMax}`;
    document.getElementById("txt-dano").innerText = `⚔️ Dano: ${danoAtaque}`;
    document.getElementById("txt-agilidade").innerText = `💨 Agilidade: ${agilidade}`;
    document.getElementById("txt-macas").innerText = `🍎 Maçãs: ${macas}/${macasMax}`;
}

function explorar() {
    if (!inimigos || inimigos.length === 0) return;
    animalAtual = inimigos[Math.floor(Math.random() * inimigos.length)];

    document.getElementById("narrativa-texto").innerText = `⚠️ Um(a) ${animalAtual.nome} selvagem surgiu das sombras!`;
    document.getElementById("menu-acoes").style.display = "none";
    document.getElementById("monstro-info").style.display = "flex";
    document.getElementById("monstro-img").src = animalAtual.imgSrc;
    document.getElementById("monstro-nome").innerText = animalAtual.nome;

    const seletor = document.getElementById("seletor-personagens");
    if (seletor) seletor.style.display = "none";
}

function curarComMaca() {
    if (macas > 0) {
        if (vida >= vidaMax) {
            mostrarModal("Vossa vida já está no máximo!");
            return;
        }
        macas--;
        vida = Math.min(vidaMax, vida + 10);
        atualizarStatus();
        mostrarModal("🍎 Vossa Majestade comeu uma maçã e recuperou HP!");
    } else {
        mostrarModal("❌ Suas maçãs acabaram!");
    }
}

function fugir() {
    if (Math.random() < 0.4) {
        mostrarModal("🏃 Vossa Majestade usou a agilidade e conseguiu fugir!", () => restaurarMenuPrincipal());
    } else {
        mostrarModal(`❌ A fuga falhou! O(a) ${animalAtual.nome} atacou!`, () => iniciarArena());
    }
}

function verificarMorte() {
    mostrarModal("☠️ Vossa Majestade caiu em batalha! Suas almas foram perdidas...", () => {
        almas = 0;
        vida = vidaMax;
        restaurarMenuPrincipal();
    });
}

function restaurarMenuPrincipal() {
    limparTeclas();
    window.onkeydown = null;
    window.onkeyup = null;
    if (typeof pararAnimacaoFogueira === "function") pararAnimacaoFogueira();
    if (typeof encerrarArena === "function") encerrarArena();

    document.getElementById("container").className = "";
    document.getElementById("monstro-info").style.display = "none";
    document.getElementById("fogueira-arte-container").style.display = "none";
    document.getElementById("fogueira-box").style.display = "none";
    document.getElementById("arena-box").style.display = "none";
    document.getElementById("altar-box").style.display = "none";

    document.getElementById("menu-acoes").style.display = "flex";
    document.getElementById("narrativa-texto").innerText = "O reino aguarda suas ordens, meu Soberano.";
    
    const seletor = document.getElementById("seletor-personagens");
    if (seletor) seletor.style.display = "block";

    atualizarStatus();
}

function abrirAltar() {
    // Oculta os elementos do menu principal para isolar a tela do Altar
    document.getElementById("menu-acoes").style.display = "none";
    document.getElementById("narrativa-box").style.display = "none"; 
    
    // Exibe o Altar como container principal
    const altarBox = document.getElementById("altar-box");
    altarBox.style.display = "flex";
    altarBox.style.flexDirection = "column";
    altarBox.style.justifyContent = "center";
    altarBox.style.margin = "auto 0";

    const lista = document.getElementById("lista-feras");
    if (animaisCapturados.length === 0) {
        lista.innerHTML = "<p style='font-size: 0.8em; color: #888; margin: 20px 0;'>Nenhuma fera capturada ainda.</p>";
    } else {
        lista.innerHTML = animaisCapturados.map(f => `<p style='margin: 8px 0;'>🔮 ${f}</p>`).join("");
    }
}

function restaurarMenuPrincipal() {
    limparTeclas();
    window.onkeydown = null;
    window.onkeyup = null;
    if (typeof pararAnimacaoFogueira === "function") pararAnimacaoFogueira();
    if (typeof encerrarArena === "function") encerrarArena();

    // Reseta classes e telas secundárias
    document.getElementById("container").className = "";
    document.getElementById("monstro-info").style.display = "none";
    document.getElementById("fogueira-arte-container").style.display = "none";
    document.getElementById("fogueira-box").style.display = "none";
    document.getElementById("arena-box").style.display = "none";
    document.getElementById("altar-box").style.display = "none";

    // Restaura a visibilidade da narrativa e do menu inicial
    document.getElementById("narrativa-box").style.display = "block";
    document.getElementById("menu-acoes").style.display = "flex";
    document.getElementById("narrativa-texto").innerText = "O reino aguarda suas ordens, meu Soberano.";
    
    const seletor = document.getElementById("seletor-personagens");
    if (seletor) seletor.style.display = "block";

    atualizarStatus();
}

window.addEventListener("DOMContentLoaded", () => {
    renderizarSeletorPersonagens();
    selecionarPersonagem(personagensDisponiveis[0]);
});