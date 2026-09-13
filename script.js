/* =========================================
   ESTADO GLOBAL DO SOBERANO
========================================= */
let nivel = 1;
let almas = 0;
let almasNecessarias = 30;

let vidaMax = 30;
let vida = vidaMax;
let danoAtaque = 5;
let agilidade = 1;

let macasMax = 5;
let macas = macasMax;
let animaisCapturados = [];

let animalAtual = null;

/* =========================================
   SISTEMA DE CLASSES E HERÓIS
========================================= */

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

let classeAtual = "rei"; // Define o Soberano Fenrir como a classe inicial padrão!

// CARREGAMENTO DAS IMAGENS PRINCIPAIS
const heroiImg = new Image();
heroiImg.src = classesDisponiveis[classeAtual].imgSrc;

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

/* =========================================
   SELEÇÃO DE PERSONAGENS
========================================= */

/* =========================================
   SELEÇÃO DE PERSONAGENS COM DESTAQUE E EFEITOS
========================================= */

// Função de Áudio Sintetizado para Efeitos Sonoros Reais
function tocarEfeitoSelecao(isRoyal = false) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (isRoyal) {
            // Fanfarra Real Impetuosa (Arpejo Dourado)
            const notas = [523.25, 659.25, 783.99, 1046.50]; // Do, Mi, Sol, Do
            notas.forEach((freq, index) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "triangle";
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.2, audioCtx.currentTime + index * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + index * 0.08 + 0.35);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(audioCtx.currentTime + index * 0.08);
                osc.stop(audioCtx.currentTime + index * 0.08 + 0.35);
            });
        } else {
            // Som suave de seleção comum
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(440, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
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
    const botoesContainer = document.getElementById("modal-botoes-container");

    modalBox.classList.remove("modo-bestiario");
    
    let html = `<h3 style="color: #8fa3b3; margin-top: 0; font-size: 11px;">👑 ESCOLHA SEU HERÓI 👑</h3>`;
    html += `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 10px; max-height: 50vh; overflow-y: auto;">`;

    for (const [key, c] of Object.entries(classesDisponiveis)) {
        const estaSelecionado = (key === classeAtual);
        const ehRealeza = (key === 'rei' || key === 'rainha');

        let estiloBorda = "";

        if (estaSelecionado) {
            estiloBorda = "border: 2px solid #ffcc00; background: rgba(255, 204, 0, 0.25); box-shadow: 0 0 14px rgba(255, 204, 0, 0.8);";
        } else if (ehRealeza) {
            // Brilho Dourado Imponente para o Rei e a Rainha
            estiloBorda = "border: 1px solid #ffcc00; background: rgba(255, 204, 0, 0.08); box-shadow: 0 0 8px rgba(255, 204, 0, 0.35);";
        } else {
            estiloBorda = "border: 1px solid #5a6a78; background: #090c10;";
        }

        html += `
            <div style="padding: 10px; border-radius: 6px; cursor: pointer; text-align: center; transition: all 0.2s; ${estiloBorda}" onclick="selecionarClasse('${key}')">
                <img src="${c.imgSrc}" style="width: 55px; height: 55px; object-fit: contain; margin: 0 auto; display: block;">
                <div style="font-size: 9px; color: ${ehRealeza ? '#ffcc00' : '#8fa3b3'}; margin-top: 6px; font-weight: bold;">${c.nome}</div>
                <div style="font-size: 7px; color: #aaa; margin-top: 4px; line-height: 1.4;">${c.descricao}</div>
            </div>
        `;
    }
    html += `</div>`;

    modalTexto.innerHTML = html;
    botoesContainer.innerHTML = `<button class="modal-btn" onclick="fecharModal()">Voltar</button>`;
    document.getElementById("modal-overlay").style.display = "flex";
}

function selecionarClasse(chave) {
    if (!classesDisponiveis[chave]) return;

    // Se já estiver com a classe selecionada, apenas fecha o aviso
    if (chave === classeAtual) {
        mostrarModal(`Vossa Majestade já está no comando de ${classesDisponiveis[chave].nome}!`);
        return;
    }

    // Modal de confirmação para evitar perdas acidentais
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

    // RESET COMPLETO DO PROGRESSO
    nivel = 1;
    almas = 0;
    almasNecessarias = 30;
    animaisCapturados = [];

    // Atributos base
    vidaMax = 20;
    danoAtaque = 5;
    agilidade = 0;
    macasMax = 5;

    const ehRealeza = (chave === 'rei' || chave === 'rainha');
    tocarEfeitoSelecao(ehRealeza);

    if (chave === 'rei') {
        vidaMax = 25;
        danoAtaque = 7;
        agilidade = 1;
    } else if (chave === 'rainha') {
        vidaMax = 28;
        macasMax = 7;
    } else if (chave === 'cavaleiro') {
        vidaMax = 30;
    } else if (chave === 'arqueiro') {
        agilidade = 2;
    } else if (chave === 'mago') {
        danoAtaque = 8;
    } else if (chave === 'domador') {
        macasMax = 8;
    }

    vida = vidaMax;
    macas = macasMax;

    atualizarStatus();

    // Mensagens de confirmação
    if (chave === 'rei') {
        mostrarModal(`👑 Curvem-se perante o Soberano Fenrir!\nUma nova jornada se inicia no Nível 1 com o comando do Rei Supremo!`);
    } else if (chave === 'rainha') {
        mostrarModal(`👸 Salvem a Rainha!\nUma nova jornada se inicia no Nível 1 sob a graça da Rainha!`);
    } else {
        mostrarModal(`✨ Nova jornada iniciada!\nVossa Majestade assumiu o manto de ${c.nome} no Nível 1.`);
    }
}

/* =========================================
   SISTEMA DE MODAIS E INTERFACE
========================================= */

    document.getElementById("nome-personagem").innerText = personagem.nome;
    document.getElementById("desc-personagem").innerText = personagem.descricao;
    atualizarStatus();
    renderizarSeletorPersonagens();


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
    const nomeClasse = classesDisponiveis[classeAtual] ? classesDisponiveis[classeAtual].nome : "Herói";
    document.getElementById("status-panel").innerText =
        `[${nomeClasse}] Nv: ${nivel} | Almas: ${almas} | ❤️ HP: ${vida}/${vidaMax} | ⚔️ Dano: ${danoAtaque} | 💨 Agilidade: ${agilidade} | 🍎 Maçãs: ${macas}/${macasMax}`;
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

    definirBotoes(`
        <button class="btn" onclick="explorar()">🌲 Explorar Ermos</button><br>
        <button class="btn" onclick="fogueira()">🔥 Descansar na Fogueira</button><br>
        <button class="btn" onclick="mostrarInventario()">🎒 Ver Feras Capturadas</button><br>
        <button class="btn" onclick="abrirSelecaoClasse()" style="background-color: #3b2d54;">👑 Escolher Herói</button>
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

/* =========================================
   SISTEMA DE DERROTA
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

// Inicializa o status do herói ao abrir a página
atualizarStatus();
