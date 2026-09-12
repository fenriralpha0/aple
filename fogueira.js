/* =========================================
   LÓGICA E RENDERIZAÇÃO DA FOGUEIRA
========================================= */

let fogueiraAnimId = null;
let faiscas = [];

function criarFaisca(canvasWidth, canvasHeight) {
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
        💨 <b>Agilidade:</b> Nv. ${agilidade} (Aumenta velocidade de esquiva)
    `;

    botoesContainer.innerHTML = `
        <button class="btn" onclick="uparAtributo('vitalidade')" style="background-color: #8b0000;">❤️ Upar Vitalidade (+5 HP)</button>
        <button class="btn" onclick="uparAtributo('dano')" style="background-color: #a0522d;">⚔️ Upar Dano (+3 Dano)</button>
        <button class="btn" onclick="uparAtributo('agilidade')" style="background-color: #2e8b57;">💨 Upar Agilidade (+Velocidade do Herói)</button>
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
            mensagem = "💨 Vossa Agilidade aumentou! Vossa Majestade se moverá mais rápido na arena.";
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

        if (fogueiraFundoImg.complete && fogueiraFundoImg.naturalWidth !== 0) {
            ctx.drawImage(fogueiraFundoImg, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = "#090d16";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

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