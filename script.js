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
    { nome: "Pombo da Podridão", chance: 0.7, dano: 3, almas: 10, velocidade: 5, quantidade: 1, tempoLuta: 6.0, imgSrc: "assets/img/pombo.png", simboloAtaque: "🐾" },
    { nome: "Capivara do Abismo", chance: 0.5, dano: 5, almas: 15, velocidade: 7, quantidade: 1, tempoLuta: 8.0, imgSrc: "assets/img/capivara.png", simboloAtaque: "🐾" },
    { nome: "Lobo das Cinzas", chance: 0.3, dano: 10, almas: 30, velocidade: 9, quantidade: 2, tempoLuta: 10.0, imgSrc: "assets/img/lobo.png", simboloAtaque: "⚡" },
    { nome: "Urso Pardo Corrompido", chance: 0.1, dano: 18, almas: 80, velocidade: 11, quantidade: 3, tempoLuta: 12.0, imgSrc: "assets/img/urso.png", simboloAtaque: "💥" }
];

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
    const ctx = canvas.getContext("2d");
    let tempo = 0;

    let particulas = [];
    for(let i = 0; i < 25; i++) {
        particulas.push({
            x: 175 + (Math.random() * 30 - 15),
            y: 200 + Math.random() * 20,
            vx: Math.random() * 1.5 - 0.75,
            vy: - (Math.random() * 2 + 1),
            tamanho: Math.random() * 4 + 2,
            vida: Math.random() * 30
        });
    }

    function render() {
        tempo += 0.05;

        ctx.fillStyle = "#090d16";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ffffff";
        for (let i = 0; i < 20; i++) {
            let x = (i * 37) % canvas.width;
            let y = (i * 23) % 100;
            ctx.fillRect(x, y, 1.5, 1.5);
        }

        ctx.fillStyle = "#fffbe0";
        ctx.beginPath();
        ctx.arc(280, 50, 25, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#03060a";
        for (let i = 0; i < 8; i++) {
            let x = i * 50;
            ctx.beginPath();
            ctx.moveTo(x, 170);
            ctx.lineTo(x + 25, 100);
            ctx.lineTo(x + 50, 170);
            ctx.fill();
        }

        ctx.fillStyle = "#0c1829";
        ctx.fillRect(0, 220, canvas.width, 80);

        ctx.fillStyle = "rgba(255, 251, 224, 0.15)";
        ctx.fillRect(260, 230 + Math.sin(tempo) * 2, 40, 40);

        ctx.strokeStyle = "#4a2e12";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(155, 220); ctx.lineTo(195, 205);
        ctx.moveTo(195, 220); ctx.lineTo(155, 205);
        ctx.stroke();

        ctx.fillStyle = "#ff4500";
        ctx.beginPath();
        ctx.arc(175, 205, 18 + Math.sin(tempo * 3) * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffaa00";
        ctx.beginPath();
        ctx.arc(175, 205, 10 + Math.cos(tempo * 4) * 2, 0, Math.PI * 2);
        ctx.fill();

        for (let p of particulas) {
            p.x += p.vx;
            p.y += p.vy;
            p.vida -= 1;

            if (p.vida <= 0 || p.y < 120) {
                p.x = 175 + (Math.random() * 30 - 15);
                p.y = 205;
                p.vy = - (Math.random() * 2 + 1);
                p.vida = 30;
            }

            ctx.fillStyle = "rgba(255, 200, 50, " + (p.vida / 30) + ")";
            ctx.fillRect(p.x, p.y, p.tamanho, p.tamanho);
        }

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
    // ARENA AUMENTADA: Dimensões atualizadas para 500x480
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
            y: - (i * 120),
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

function loopArena() {
    // MOVIMENTAÇÃO AJUSTADA PARA OS NOVOS LIMITES DA ARENA
    if (teclasPressionadas.ArrowLeft && coracaoX > 25) coracaoX -= 7;
    if (teclasPressionadas.ArrowRight && coracaoX < 475) coracaoX += 7;
    if (teclasPressionadas.ArrowUp && coracaoY > 25) coracaoY -= 7;
    if (teclasPressionadas.ArrowDown && coracaoY < 455) coracaoY += 7;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = "24px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("❤️", coracaoX - 12, coracaoY + 8);

    ctx.font = "22px Arial";
    ctx.fillStyle = "white";

    for (let obs of obstaculos) {
        obs.y += obs.velocidade;
        
        if (obs.y > 480) {
            obs.y = -30;
            obs.x = Math.random() * 440 + 30;
        }

        ctx.fillText(animalAtual.simboloAtaque, obs.x - 12, obs.y + 8);

        if (Math.abs(coracaoX - obs.x) < 22 && Math.abs(coracaoY - obs.y) < 22) {
            clearInterval(intervaloArena);
            limparTeclas();
            window.onkeydown = null;
            window.onkeyup = null;
            vida -= animalAtual.dano;
            mostrarModal(`💥 Vossa Majestade foi atingida por ${animalAtual.nome}! Perdeu ${animalAtual.dano} de HP.`, () => {
                verificarMorte();
            });
            return;
        }
    }

    tempoRestante -= 0.03;
    document.getElementById("tempo-restante").innerText = `Tempo de Sobrevivência: ${tempoRestante.toFixed(1)}s`;

    if (tempoRestante <= 0) {
        clearInterval(intervaloArena);
        limparTeclas();
        window.onkeydown = null;
        window.onkeyup = null;
        mostrarModal(`✨ Vossa Majestade superou a fúria de ${animalAtual.nome}!`, () => {
            restaurarMenuPrincipal();
        });
    }
}

function verificarMorte() {
    if (vida <= 0) {
        mostrarModal("💀 YOU DIED 💀\nA escuridão consumiu o reino. Todas as almas foram perdidas.", () => {
            almas = 0;
            vida = vidaMax;
            macas = macasMax;
            restaurarMenuPrincipal();
        });
    } else {
        restaurarMenuPrincipal();
    }
}

/* =========================================
   GLOSSÁRIO / BESTIÁRIO NO MODAL
========================================= */

function mostrarInventario() {
    if (animaisCapturados.length === 0) {
        mostrarModal("O canil imperial ainda está vazio, meu Soberano.");
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