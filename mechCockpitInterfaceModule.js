/**
 * MECHA COCKPIT ENGINE V7.9.5 - GLITCH VIEWPORT EDITION
 * Garante confinamento absoluto dentro da área de exibição de sites.
 * Injeta simulação de instabilidade de sinal (mal contato) a cada 60s via hardware.
 */
(function () {
    console.log("%c>> BATTLEMECH HUD V7.9.5 - GLITCH SYSTEM ACTIVE <<", "color: #00ff33; font-weight: bold; text-shadow: 0 0 5px #00ff33;");

    // 1. Injeção de Matriz Estética (CSS Adaptativo de Área Comprimida)
    const styleBlock = document.createElement("style");
    styleBlock.textContent = `
        #mecha-hud-frame {
            position: absolute;
            top: 0; left: 0; 
            width: 100%; height: 100%; /* Trava nas dimensões exatas do contêiner pai */
            pointer-events: none;
            z-index: 999999;
            box-sizing: border-box;
            border: 1px solid rgba(0, 255, 51, 0.06);
            box-shadow: inset 0 0 40px rgba(0, 255, 51, 0.02);
            font-family: 'Courier New', monospace;
            overflow: hidden;
        }

        /* Efeito Scanlines restrito à viewport útil */
        #mecha-hud-frame::before {
            content: " "; display: block; position: absolute;
            top: 0; left: 0; bottom: 0; right: 0;
            background: linear-gradient(rgba(100, 255, 50, 0.1) 0%, rgba(0, 0, 0, 0) 100%);
            background-size: 100% 6px;
            z-index: 10;
            opacity: 0.25;
        }

        /* Cantoneiras ajustadas para margens internas estáveis */
        .hud-bracket {
            position: absolute; width: 30px; height: 30px;
            border-color: rgba(0, 255, 51, 0.25); border-style: solid;
        }
        .t-l { top: 2px !important; left: 2px !important; border-width: 2px 0 0 2px; }
        .t-r { top: 2px !important; right: 2px !important; border-width: 2px 2px 0 0; }
        .b-l { bottom: 2px !important; left: 2px !important; border-width: 0 0 2px 2px; }
        .b-r { bottom: 2px !important; right: 2px !important; border-width: 0 2px 2px 0; }

        /* Dados HTML posicionados em relação aos cantos da área do site */
        #hud-diagnostics {
            position: absolute; bottom: 32px; left: 110px;
            color: #00ff33; text-shadow: 0 0 4px rgba(0, 255, 51, 0.5);
            font-size: 10px; line-height: 1.5; opacity: 0.2;
            z-index: 5;
        }

        #hud-target-node {
            position: absolute; top: 32px; left: 110px;
            color: #00ff33; text-shadow: 0 0 4px rgba(0, 255, 51, 0.5);
            font-size: 10px; text-align: left; opacity: 0.2;
            z-index: 5;
        }

        #hud-weapon-node {
            position: absolute; top: 32px; right: 110px;
            color: #00ff33; text-shadow: 0 0 4px rgba(0, 255, 51, 0.5);
            font-size: 10px; text-align: right; opacity: 0.2;
            z-index: 5;
        }

        #hud-vector-canvas {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            z-index: 1;
        }


        /* ==============================================================================
           MATRIZ DE CURTO CIRCUITO (MATE CORRETO / FLICKER CSS)
           ============================================================================== */
        @keyframes cockpit-interference {
            0%   { opacity: 1; transform: translate(0, 0) skewX(0deg); filter: contrast(1); }
            5%   { opacity: 0.2; transform: translate(-4px, 2px) skewX(4deg); filter: contrast(2); }
            10%  { opacity: 0.8; transform: translate(2px, -1px) skewX(-2deg); }
            15%  { opacity: 0.4; transform: translate(-1px, -2px) filter: blur(0.5px); }
            20%  { opacity: 1; transform: translate(0, 0) skewX(0deg); filter: blur(0px); }
            60%  { opacity: 0.3; transform: skewX(-4deg) scaleY(1.03); }
            65%  { opacity: 0.9; transform: translate(3px, 1px) skewX(0deg); }
            70%  { opacity: 1; transform: translate(0, 0); }
            100% { opacity: 1; transform: translate(0, 0) skewX(0deg); }
        }

        /* Classe gatilho injetada temporariamente via JS */
        .hud-glitch-active {
            animation: cockpit-interference 0.45s linear;
        }
    `;
    document.head.appendChild(styleBlock);

    // 2. Mapeamento do Contêiner Alvo (Webpage Viewport Focus)
    function bootVisualHUD() {
        const UIAnchor = document.getElementById("webpage-stack") || 
                         document.querySelector(".webview-container") || 
                         document.body;

        if (window.getComputedStyle(UIAnchor).position === "static") {
            UIAnchor.style.position = "relative";
        }

        const hudFrame = document.createElement("div");
        hudFrame.id = "mecha-hud-frame";
        hudFrame.innerHTML = `
            <div class="hud-bracket t-l"></div>
            <div class="hud-bracket t-r"></div>
            <div class="hud-bracket b-l"></div>
            <div class="hud-bracket b-r"></div>
            <canvas id="hud-vector-canvas"></canvas>
            <div id="hud-diagnostics">
                [SYS_LOC]: WEB_VIEWPORT<br>
                [REACTOR]: TOKAMAK_MAX_100%<br>
                [SHIELDS]: SOLID_STATE_ACTIVE<br>
                <span id="hud-terminal-log">> COCKPIT_READY_</span>
            </div>
            <div id="hud-target-node">
                TARGET: UNKNOWN_TRACK<br>
                DIST: -- m | ANG: 0.00°<br>
                TAG: SECURE_ZONE
            </div>
            <div id="hud-weapon-node">
                GAUSS_CANNON: READY<br>
                AMMO: 64%<br>
                STATUS: ONLINE
            </div>
        `;
        UIAnchor.appendChild(hudFrame);

        const canvas = document.getElementById("hud-vector-canvas");
        const ctx = canvas.getContext("2d");

        // 3. Sincronização Geométrica Baseada no Elemento Pai (Não na Janela Global)
        function synchronizeCanvasSize() {
            canvas.width = hudFrame.clientWidth;
            canvas.height = hudFrame.clientHeight;
        }

        const displayObserver = new ResizeObserver(() => {
            synchronizeCanvasSize();
        });
        displayObserver.observe(hudFrame);
        synchronizeCanvasSize();

        // 4. Loop de Renderização Vetorial de Cantos Redimensionáveis
        function renderLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const leftCornerX = 25; 
            const rightCornerX = canvas.width - 25;
            
            ctx.lineWidth = 1;
            ctx.font = "9px 'Courier New', monospace";

            // --- CANTO ESQUERDO: GRADES DE SENSOR ---
            ctx.strokeStyle = "rgba(0, 255, 51, 0.08)";
            ctx.fillStyle = "rgba(0, 255, 51, 0.15)";
            
            ctx.beginPath();
            ctx.moveTo(leftCornerX, 20); ctx.lineTo(leftCornerX, 200);
            ctx.moveTo(leftCornerX, canvas.height - 200); ctx.lineTo(leftCornerX, canvas.height - 20);
            
            for (let offset = 40; offset <= 160; offset += 40) {
                ctx.moveTo(leftCornerX, offset); ctx.lineTo(leftCornerX + 8, offset);
                const topLat = ((offset / 40) * 15).toFixed(0);
                ctx.fillText(`L.TRK:${topLat}°`, leftCornerX + 14, offset + 3);

                const bottomY = canvas.height - offset;
                ctx.moveTo(leftCornerX, bottomY); ctx.lineTo(leftCornerX + 8, bottomY);
                ctx.fillText(`L.NAV:${topLat}°`, leftCornerX + 14, bottomY + 3);
            }
            ctx.stroke();

            // --- CANTO DIREITO: ESCALAS BALÍSTICAS ---
            ctx.strokeStyle = "rgba(0, 255, 51, 0.08)";
            ctx.fillStyle = "rgba(0, 255, 51, 0.15)";
            
            ctx.beginPath();
            ctx.moveTo(rightCornerX, 20); ctx.lineTo(rightCornerX, 200);
            ctx.moveTo(rightCornerX, canvas.height - 200); ctx.lineTo(rightCornerX, canvas.height - 20);
            
            for (let offset = 40; offset <= 160; offset += 40) {
                ctx.moveTo(rightCornerX, offset); ctx.lineTo(rightCornerX - 8, offset);
                const topLon = (offset + 60).toFixed(0);
                ctx.fillText(`${topLon}°:R.ANG`, rightCornerX - 66, offset + 3);

                const bottomY = canvas.height - offset;
                ctx.moveTo(rightCornerX, bottomY); ctx.lineTo(rightCornerX - 8, bottomY);
                ctx.fillText(`${topLon}°:R.BAL`, rightCornerX - 66, bottomY + 3);
            }
            ctx.stroke();

            // --- DECORAÇÕES E QUADRANTES COMPACTOS ---
            ctx.strokeStyle = "rgba(0, 255, 51, 0.03)";
            ctx.beginPath();
            ctx.moveTo(leftCornerX, 20); ctx.lineTo(leftCornerX + 100, 20);
            ctx.moveTo(rightCornerX, 20); ctx.lineTo(rightCornerX - 100, 20);
            ctx.moveTo(leftCornerX, canvas.height - 20); ctx.lineTo(leftCornerX + 100, canvas.height - 20);
            ctx.moveTo(rightCornerX, canvas.height - 20); ctx.lineTo(rightCornerX - 100, canvas.height - 20);
            ctx.stroke();

            requestAnimationFrame(renderLoop);
        }
        renderLoop();

        // 5. Captura de Interações dentro do Frame Limitado
        const terminalOutput = document.getElementById("hud-terminal-log");
        let logTimeout;

        window.addEventListener("keydown", (event) => {
            clearTimeout(logTimeout);
            terminalOutput.style.color = "#ffffff";
            terminalOutput.innerText = `> KEY_INP: [${event.key.toUpperCase()}]`;

            logTimeout = setTimeout(() => {
                terminalOutput.style.color = "#00ff33";
                terminalOutput.innerText = "> COCKPIT_READY_";
            }, 600);
        });

        hudFrame.parentElement.addEventListener("click", (event) => {
            const rect = hudFrame.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            if (clickX >= 0 && clickY >= 0 && clickX <= rect.width && clickY <= rect.height) {
                const ping = document.createElement("div");
                ping.className = "sonar-ping";
                ping.style.top = `${clickY}px`;
                ping.style.left = `${clickX}px`;

                hudFrame.appendChild(ping);
                setTimeout(() => ping.remove(), 500);
            }
        });

        // ==============================================================================
        // 6. DISPARADOR DE INSTABILIDADE (MAL CONTATO COCKPIT)
        // ==============================================================================
        setInterval(() => {
            // Ativa o curto-circuito na viewport inteira (Canvas + Elementos HTML juntos)
            hudFrame.classList.add("hud-glitch-active");
            
            // Remove a classe após o término exato da animação (0.45 segundos)
            setTimeout(() => {
                hudFrame.classList.remove("hud-glitch-active");
            }, 450);
            
        }, Math.floor(Math.random() * (60000 - 10000 + 1)) + 10000); // Executa ciclicamente a cada 60000ms (1 minuto)
    }

    // 7. Loop de Varredura e Injeção Inteligente
    const systemRadar = setInterval(() => {
        const targetElement = document.getElementById("webpage-stack") || 
                              document.querySelector(".webview-container") || 
                              document.body;
        if (targetElement) {
            clearInterval(systemRadar);
            bootVisualHUD();
        }
    }, 400);
})();