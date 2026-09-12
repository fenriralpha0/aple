/* =========================================
   SISTEMA DE COMBATE E ARENA
========================================= */

let canvas, ctx;
const tamanhoPers = 70;
const hitboxPers = 30;

let coracaoX = 500, coracaoY = 310;
let obstaculos = [];
let tempoRestante = 5.0;
let intervaloArena = null;

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

    document.getElementById("container").classList.add("em-combate");

    document.getElementById("menu-acoes").style.display = "none";
    document.getElementById("monstro-info").style.display = "block";
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

    let velCalculada = Math.max(2.0, animalAtual.velocidade - (agilidade * 0.5));

    obstaculos = [];
    for (let i = 0; i < animalAtual.quantidade; i++) {
        obstaculos.push({
            x: Math.random() * (canvas.width - 60) + 30,
            y: -(i * 120),
            velocidade: velCalculada
        });
    }

    // Aceita tanto Setas direcionais quanto WASD
    window.onkeydown = (e) => {
        if (e.key === "Enter" && !intervaloArena) {
            document.getElementById("arena-start").style.display = "none";
            intervaloArena = setInterval(loopArena, 30);
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

    if (intervaloArena) clearInterval(intervaloArena);
    intervaloArena = null;
}

function loopArena() {
    if (teclasPressionadas.ArrowLeft) coracaoX = Math.max(24, coracaoX - 7);
    if (teclasPressionadas.ArrowRight) coracaoX = Math.min(976, coracaoX + 7);
    if (teclasPressionadas.ArrowUp) coracaoY = Math.max(24, coracaoY - 7);
    if (teclasPressionadas.ArrowDown) coracaoY = Math.min(596, coracaoY + 7);

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
        ctx.font = "24px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("❤️", coracaoX - 12, coracaoY + 8);
    }

    const imgAtaque = carregarImagemAtaque(animalAtual.ataqueImgSrc);
    const tamanhoAtaque = 34;

    for (let obs of obstaculos) {
        obs.y += obs.velocidade;

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
            ctx.font = "22px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(animalAtual.simboloAtaque, obs.x - 12, obs.y + 8);
        }

        const dx = coracaoX - obs.x;
        const dy = coracaoY - obs.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);

        if (distancia < hitboxPers) {
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

    // AQUI É O ONDE A RECOMPENSA É PROCESSADA QUANDO O TEMPO ACABA
    if (tempoRestante <= 0) {
        clearInterval(intervaloArena);
        limparTeclas();
        window.onkeydown = null;
        window.onkeyup = null;

        // 1. Calcula 1/3 das almas (arredondado para baixo)
        const almasGanhas = Math.floor(animalAtual.almas / 3);

        // 2. Adiciona as almas ao total do jogador
        almas += almasGanhas;

        // 3. Atualiza o status na tela antes de abrir a modal
        atualizarStatus();

        // 4. Exibe a modal informando a recompensa ganha
        mostrarModal(
            `✨ Vossa Majestade superou a fúria de ${animalAtual.nome}!\n` +
            `🔮 Como recompensa de batalha, você absorveu ${almasGanhas} Almas!`,
            () => {
                restaurarMenuPrincipal();
            }
        );
    }
}