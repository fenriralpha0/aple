/* =========================================
   SISTEMA DE COMBATE E ARENA (Refatorado)
========================================= */

let canvas, ctx;
const tamanhoPers = 80;
const hitboxPers = 32;

let coracaoX = 500, coracaoY = 310;
let obstaculos = [];
let tempoRestante = 5.0;
let animFrameId = null;
let ultimoTempo = 0;
let estaEncerrado = false;

const ataquesImagens = {};

function carregarImagemAtaque(src) {
    if (!ataquesImagens[src]) {
        const img = new Image();
        img.src = src;
        ataquesImagens[src] = img;
    }
    return ataquesImagens[src];
}

function iniciarArena() {
    limparTeclas();
    estaEncerrado = false;

    document.getElementById("container").classList.add("em-combate");
    document.getElementById("menu-acoes").style.display = "none";
    document.getElementById("monstro-info").style.display = "none";
    document.getElementById("fogueira-arte-container").style.display = "none";
    document.getElementById("fogueira-box").style.display = "none";
    document.getElementById("arena-box").style.display = "flex";
    document.getElementById("arena-start").style.display = "flex";

    document.getElementById("monstro-arena").src = animalAtual.imgSrc;
    document.getElementById("titulo-arena").innerText = `⚔️ ${animalAtual.nome.toUpperCase()} ⚔️`;
    document.getElementById("narrativa-texto").innerText = `Resista ao poder de ${animalAtual.nome}!`;

    canvas = document.getElementById("canvasArena");
    canvas.width = 1000;
    canvas.height = 620;
    ctx = canvas.getContext("2d");

    coracaoX = canvas.width / 2;
    coracaoY = canvas.height / 2 + 80;
    tempoRestante = animalAtual.tempoLuta;

    const velCalculada = animalAtual.velocidade * 60;

    obstaculos = [];
    for (let i = 0; i < animalAtual.quantidade; i++) {
        obstaculos.push({
            x: Math.random() * (canvas.width - 60) + 30,
            y: -(i * 120),
            velocidade: velCalculada
        });
    }

    window.onkeydown = (e) => {
        if (e.key === "Enter" && !animFrameId && !estaEncerrado) {
            document.getElementById("arena-start").style.display = "none";
            ultimoTempo = performance.now();
            animFrameId = requestAnimationFrame(loopArena);
            return;
        }

        const key = e.key.toLowerCase();
        if (key === "arrowleft" || key === "a") teclasPressionadas.ArrowLeft = true;
        if (key === "arrowright" || key === "d") teclasPressionadas.ArrowRight = true;
        if (key === "arrowup" || key === "w") teclasPressionadas.ArrowUp = true;
        if (key === "arrowdown" || key === "s") teclasPressionadas.ArrowDown = true;
    };

    window.onkeyup = (e) => {
        const key = e.key.toLowerCase();
        if (key === "arrowleft" || key === "a") teclasPressionadas.ArrowLeft = false;
        if (key === "arrowright" || key === "d") teclasPressionadas.ArrowRight = false;
        if (key === "arrowup" || key === "w") teclasPressionadas.ArrowUp = false;
        if (key === "arrowdown" || key === "s") teclasPressionadas.ArrowDown = false;
    };

    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = null;
}

function encerrarArena() {
    estaEncerrado = true;
    if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
    }
    limparTeclas();
    window.onkeydown = null;
    window.onkeyup = null;
}

function loopArena(timestamp) {
    if (estaEncerrado) return;

    const dt = Math.min((timestamp - ultimoTempo) / 1000, 0.1);
    ultimoTempo = timestamp;

    const velPersonagem = (7 + (agilidade * 0.6)) * 60;

    if (teclasPressionadas.ArrowLeft) coracaoX = Math.max(24, coracaoX - velPersonagem * dt);
    if (teclasPressionadas.ArrowRight) coracaoX = Math.min(976, coracaoX + velPersonagem * dt);
    if (teclasPressionadas.ArrowUp) coracaoY = Math.max(24, coracaoY - velPersonagem * dt);
    if (teclasPressionadas.ArrowDown) coracaoY = Math.min(596, coracaoY + velPersonagem * dt);

    if (fundoArenaImg.complete && fundoArenaImg.naturalWidth !== 0) {
        ctx.drawImage(fundoArenaImg, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (heroiImg.complete && heroiImg.naturalWidth !== 0) {
        ctx.drawImage(
            heroiImg,
            coracaoX - tamanhoPers / 2,
            coracaoY - tamanhoPers / 2,
            tamanhoPers,
            tamanhoPers
        );
    } else {
        ctx.font = "36px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("❤️", coracaoX - 18, coracaoY + 12);
    }

    const imgAtaque = carregarImagemAtaque(animalAtual.ataqueImgSrc);
    const tamanhoAtaque = 55;

    for (let obs of obstaculos) {
        obs.y += obs.velocidade * dt;

        if (obs.y > 620) {
            obs.y = -30;
            obs.x = Math.random() * 940 + 30;
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
            ctx.font = "28px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(animalAtual.simboloAtaque, obs.x - 14, obs.y + 10);
        }

        const dx = coracaoX - obs.x;
        const dy = coracaoY - obs.y;
        const distancia = Math.hypot(dx, dy);

        if (distancia < hitboxPers) {
            encerrarArena();
            vida = Math.max(0, vida - animalAtual.dano);
            atualizarStatus();

            if (vida <= 0) {
                verificarMorte();
            } else {
                mostrarModal(
                    `💥 Vossa Majestade foi atingida por ${animalAtual.nome}! Perdeu ${animalAtual.dano} de HP.`,
                    () => restaurarMenuPrincipal()
                );
            }
            return;
        }
    }

    tempoRestante -= dt;
    document.getElementById("tempo-restante").innerText =
        `Tempo de Sobrevivência: ${Math.max(0, tempoRestante).toFixed(1)}s`;

    if (tempoRestante <= 0) {
        encerrarArena();
        const almasGanhas = Math.floor(animalAtual.almas / 3);
        almas += almasGanhas;
        atualizarStatus();

        mostrarModal(
            `✨ Vossa Majestade superou a fúria de ${animalAtual.nome}!\n` +
            `🔮 Como recompensa de batalha, você absorveu ${almasGanhas} Almas!`,
            () => restaurarMenuPrincipal()
        );
        return;
    }

    animFrameId = requestAnimationFrame(loopArena);
}