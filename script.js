// ATRIBUTOS DO SOBERANO
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
const inimigos = [
    { nome: "Pombo da Podridão", chance: 0.7, dano: 3, almas: 10, velocidade: 5, quantidade: 1, tempoLuta: 6.0, imgSrc: "assets/img/animais/pombo.png", ataqueImgSrc: "assets/img/ataques/ataque_pombo.png", simboloAtaque: "🐾" },
    { nome: "Capivara do Abismo", chance: 0.5, dano: 5, almas: 15, velocidade: 7, quantidade: 1, tempoLuta: 8.0, imgSrc: "assets/img/animais/capivara.png", ataqueImgSrc: "assets/img/ataques/ataque_capivara.png", simboloAtaque: "🐾" },
    { nome: "Lobo das Cinzas", chance: 0.3, dano: 10, almas: 30, velocidade: 9, quantidade: 2, tempoLuta: 10.0, imgSrc: "assets/img/animais/lobo.png", ataqueImgSrc: "assets/img/ataques/ataque_lobo.png", simboloAtaque: "⚡" },
    { nome: "Urso Pardo Corrompido", chance: 0.1, dano: 18, almas: 80, velocidade: 11, quantidade: 3, tempoLuta: 15.0, imgSrc: "assets/img/animais/urso.png", ataqueImgSrc: "assets/img/ataques/ataque_urso.png", simboloAtaque: "💥" },
    { nome: "Lagosta Infernal", chance: 0.2, dano: 11, almas: 35, velocidade: 9.5, quantidade: 2, tempoLuta: 12.0, imgSrc: "assets/img/animais/lagosta.png", ataqueImgSrc: "assets/img/ataques/ataque_lagosta.png", simboloAtaque: "🔥" }
];

// PREPARAÇÃO DAS IMAGENS
const heroiImg = new Image();
heroiImg.src = "assets/img/heroi.png";

const fundoArenaImg = new Image();
fundoArenaImg.src = "assets/img/fundo_arena.png";

const fogueiraFundoImg = new Image();
fogueiraFundoImg.src = "assets/img/fogueira_fundo.png"; // Imagem completa do fundo da fogueira

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

function explorar() {
    animalAtual = inimigos[Math.floor(Math.random() * inimigos.length)];
    document.getElementById("narrativa-texto").innerText = `⚠️ Um(a) ${animalAtual.nome} selvagem surgiu das sombras!`;

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
    mostrarModal("Retirada tática executada com sucesso.", () => {
        restaurarMenuPrincipal();
    });
}

function restaurarMenuPrincipal() {
    limparTeclas();
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
   LÓGICA DA FOGUEIRA
========================================= */

let fogueiraAnimId = null;
let faiscas = [];

function criarFaisca(canvasWidth, canvasHeight) {
    // Ajuste fino: X em 0.15 para o alinhamento perfeito
    const origX = canvasWidth * 0.15;
    const origY = canvasHeight * 0.72;

    return {
        x: origX + (Math.random() * 12 - 6),
        y: origY,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 2.0 - 0.8,
        tamanho: Math.random() * 2 + 1,
        vida: 1.0,
        cor: Math.random() > 0.3 ? "#ff4500" : "#ffcc00"
    };
}

function fogueira() {
    vida = vidaMax;
    macas = macasMax;
    atualizarStatus();

    document.getElementById("container").classList.add("em-fogueira");
    document.getElementById("menu-acoes").style.display = "none";
    document.getElementById("monstro-info").style.display = "none";
    document.getElementById("arena-box").style.display = "none";

    document.getElementById("fogueira-arte-container").style.display = "flex";
    document.getElementById("fogueira-box").style.display = "flex";
    document.getElementById("narrativa-texto").innerText = "As chamas acalmam vossa alma. Vida e maçãs foram restauradas.";

    iniciarDesenhoFogueira();
    atualizarPainelFogueira();
}

function atualizarPainelFogueira() {
    const infoContainer = document.getElementById("fogueira-status-detalhes");
    const botoesContainer = document.getElementById("fogueira-botoes");

    infoContainer.innerHTML = `
        ✨ <b>Nível Atual:</b> ${nivel}<br>
        👻 <b>Almas Disponíveis:</b> ${almas}<br>
        🔮 <b>Custo Próximo Nível:</b> ${almasNecessarias} Almas<br><hr style="border: 0; border-top: 1px solid #444; margin: 10px 0;">
        ❤️ <b>Vitalidade:</b> ${vidaMax} HP (+5/nível)<br>
        ⚔️ <b>Dano Base:</b> ${danoAtaque} (+3/nível)<br>
        💨 <b>Agilidade:</b> Nv. ${agilidade} (Desaceleração de projéteis)
    `;

    botoesContainer.innerHTML = `
        <button class="btn" onclick="uparAtributo('vitalidade')" style="background-color: #8b0000;">❤️ Upar Vitalidade (+5 HP)</button>
        <button class="btn" onclick="uparAtributo('dano')" style="background-color: #a0522d;">⚔️ Upar Dano (+3 Dano)</button>
        <button class="btn" onclick="uparAtributo('agilidade')" style="background-color: #2e8b57;">💨 Upar Agilidade (Projéteis Lentos)</button>
        <button class="btn" onclick="restaurarMenuPrincipal()" style="background-color: #444; margin-top: 10px;">🚪 Levantar-se e Sair</button>
    `;
}

function uparAtributo(tipo) {
    if (almas >= almasNecessarias) {
        almas -= almasNecessarias;
        nivel++;
        almasNecessarias = Math.floor(almasNecessarias * 1.5);

        let mensagem = "";
        if (tipo === 'vitalidade') {
            vidaMax += 5;
            vida = vidaMax;
            mensagem = "❤️ Vossa Vitalidade aumentou! (+5 HP Max)";
        } else if (tipo === 'dano') {
            danoAtaque += 3;
            mensagem = "⚔️ Seu Dano de ataque aumentou! (+3 Dano)";
        } else if (tipo === 'agilidade') {
            agilidade += 1;
            mensagem = "💨 Vossa Agilidade aumentou! Ataques inimigos ficarão mais lentos.";
        }

        atualizarStatus();
        mostrarModal(`✨ ${mensagem}`, () => {
            atualizarPainelFogueira();
        });
    } else {
        mostrarModal("❌ Almas insuficientes para este sacrifício.");
    }
}

function iniciarDesenhoFogueira() {
    const canvas = document.getElementById("canvasFogueira");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    faiscas = [];

    function render() {
        ctx.imageSmoothingEnabled = false;

        // Desenha a Imagem Completa do Cenário
        if (fogueiraFundoImg.complete && fogueiraFundoImg.naturalWidth !== 0) {
            ctx.drawImage(fogueiraFundoImg, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = "#090d16";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Gerencia as Faíscas
        if (faiscas.length < 30) {
            faiscas.push(criarFaisca(canvas.width, canvas.height));
        }

        for (let i = faiscas.length - 1; i >= 0; i--) {
            let p = faiscas[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vida -= 0.02;

            ctx.fillStyle = p.cor;
            ctx.globalAlpha = Math.max(0, p.vida);
            ctx.fillRect(p.x, p.y, p.tamanho, p.tamanho);

            if (p.vida <= 0 || p.y < canvas.height * 0.3) {
                faiscas.splice(i, 1);
            }
        }

        ctx.globalAlpha = 1.0;

        fogueiraAnimId = requestAnimationFrame(render);
    }

    if (fogueiraAnimId) cancelAnimationFrame(fogueiraAnimId);
    render();
}

function pararAnimacaoFogueira() {
    if (fogueiraAnimId) {
        cancelAnimationFrame(fogueiraAnimId);
        fogueiraAnimId = null;
    }
}

/* =========================================
   COMBATE NA ARENA
========================================= */

let canvas, ctx;

// TAMANHO DO PERSONAGEM E HITBOX PROPORCIONAL
const tamanhoPers = 48;
const hitboxPers = tamanhoPers * 0.6;

let coracaoX = 250, coracaoY = 380;
let obstaculos = [];
let tempoRestante = 5.0;
let intervaloArena = null;

function iniciarArena() {
    limparTeclas();

    document.getElementById("container").classList.add("em-combate");

    document.getElementById("menu-acoes").style.display = "none";
    document.getElementById("monstro-info").style.display = "block";
    document.getElementById("fogueira-arte-container").style.display = "none";
    document.getElementById("fogueira-box").style.display = "none";
    document.getElementById("arena-box").style.display = "flex";

    document.getElementById("monstro-arena").src = animalAtual.imgSrc;
    document.getElementById("titulo-arena").innerText = `⚔️ ${animalAtual.nome.toUpperCase()} ⚔️`;
    document.getElementById("narrativa-texto").innerText = `Resista ao poder de ${animalAtual.nome}!`;

    canvas = document.getElementById("canvasArena");
    canvas.width = 500;
    canvas.height = 480;

    ctx = canvas.getContext("2d");

    coracaoX = 250;
    coracaoY = 380;
    tempoRestante = animalAtual.tempoLuta;

    let velCalculada = Math.max(2.0, animalAtual.velocidade - (agilidade * 0.5));

    obstaculos = [];
    for (let i = 0; i < animalAtual.quantidade; i++) {
        obstaculos.push({
            x: Math.random() * 440 + 30,
            y: -(i * 120),
            velocidade: velCalculada
        });
    }

    window.onkeydown = (e) => {
        if (teclasPressionadas.hasOwnProperty(e.key)) {
            e.preventDefault();
            teclasPressionadas[e.key] = true;
        }
    };

    window.onkeyup = (e) => {
        if (teclasPressionadas.hasOwnProperty(e.key)) {
            e.preventDefault();
            teclasPressionadas[e.key] = false;
        }
    };

    if (intervaloArena) clearInterval(intervaloArena);
    intervaloArena = setInterval(loopArena, 30);
}

const ataquesImagens = {};

function carregarImagemAtaque(src) {
    if (!ataquesImagens[src]) {
        const img = new Image();
        img.src = src;
        ataquesImagens[src] = img;
    }

    return ataquesImagens[src];
}

function loopArena() {
    if (teclasPressionadas.ArrowLeft && coracaoX > 25) coracaoX -= 7;
    if (teclasPressionadas.ArrowRight && coracaoX < 475) coracaoX += 7;
    if (teclasPressionadas.ArrowUp && coracaoY > 25) coracaoY -= 7;
    if (teclasPressionadas.ArrowDown && coracaoY < 455) coracaoY += 7;

    if (fundoArenaImg.complete && fundoArenaImg.naturalWidth !== 0) {
        ctx.drawImage(fundoArenaImg, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // DESENHA O PERSONAGEM
    if (heroiImg.complete && heroiImg.naturalWidth !== 0) {
        ctx.drawImage(
            heroiImg,
            coracaoX - tamanhoPers / 2,
            coracaoY - tamanhoPers / 2,
            tamanhoPers,
            tamanhoPers
        );
    } else {
        ctx.font = "24px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("❤️", coracaoX - 12, coracaoY + 8);
    }

    const imgAtaque = carregarImagemAtaque(animalAtual.ataqueImgSrc);
    const tamanhoAtaque = 34;

    for (let obs of obstaculos) {
        obs.y += obs.velocidade;

        if (obs.y > 480) {
            obs.y = -30;
            obs.x = Math.random() * 440 + 30;
        }

        if (imgAtaque.complete && imgAtaque.naturalWidth !== 0) {
            ctx.drawImage(
                imgAtaque,
                obs.x - tamanhoAtaque / 2,
                obs.y - tamanhoAtaque / 2,
                tamanhoAtaque,
                tamanhoAtaque
            );
        } else {
            ctx.font = "22px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(animalAtual.simboloAtaque, obs.x - 12, obs.y + 8);
        }

        // HITBOX PROPORCIONAL AO PERSONAGEM
        if (
            Math.abs(coracaoX - obs.x) < hitboxPers &&
            Math.abs(coracaoY - obs.y) < hitboxPers
        ) {
            clearInterval(intervaloArena);
            limparTeclas();
            window.onkeydown = null;
            window.onkeyup = null;

            vida -= animalAtual.dano;

            mostrarModal(
                `💥 Vossa Majestade foi atingida por ${animalAtual.nome}! Perdeu ${animalAtual.dano} de HP.`,
                () => {
                    verificarMorte();
                }
            );

            return;
        }
    }

    tempoRestante -= 0.03;
    document.getElementById("tempo-restante").innerText =
        `Tempo de Sobrevivência: ${tempoRestante.toFixed(1)}s`;

    if (tempoRestante <= 0) {
        clearInterval(intervaloArena);
        limparTeclas();
        window.onkeydown = null;
        window.onkeyup = null;

        mostrarModal(
            `✨ Vossa Majestade superou a fúria de ${animalAtual.nome}!`,
            () => {
                restaurarMenuPrincipal();
            }
        );
    }
}

function verificarMorte() {
    if (vida <= 0) {
        mostrarModal(
            "💀 YOU DIED 💀\nA escuridão consumiu o reino. Todas as almas foram perdidas.",
            () => {
                almas = 0;
                vida = vidaMax;
                macas = macasMax;
                restaurarMenuPrincipal();
            }
        );
    } else {
        restaurarMenuPrincipal();
    }
}

/* =========================================
   GLOSSÁRIO / BESTIÁRIO NO MODAL
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

    botoesContainer.innerHTML =
        `<button class="modal-btn" onclick="fecharModal()">OK</button>`;

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