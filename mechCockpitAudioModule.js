// MECHA COCKPIT SOUND SYSTEM - V7 (TACTICAL FORTRESS COMPLETE EDITION)
(function() {
    // ========================================================
    // MATRIZ DE ÁUDIO BASE64 - COCKPIT COMPLETO
    // Substitua apenas o texto dentro das aspas (mantenha o 'data:audio/...')
    // ========================================================
    const AUDIOS = {
        key:        "data:audio/mp3;base64,COLE_BASE64_TECLAS",
        open:       "data:audio/mp3;base64,COLE_BASE64_ABRIR_ABA",
        close:      "data:audio/mp3;base64,COLE_BASE64_FECHAR_ABA",
        navBack:    "data:audio/mp3;base64,COLE_BASE64_NAVEGAR_VOLTAR",
        navFwd:     "data:audio/mp3;base64,COLE_BASE64_NAVEGAR_AVANCAR",
        navReload:  "data:audio/mp3;base64,COLE_BASE64_RECARREGAR_F5",
        dlStart:    "data:audio/mp3;base64,COLE_BASE64_DOWNLOAD_INICIADO",
        dlDone:     "data:audio/mp3;base64,COLE_BASE64_DOWNLOAD_CONCLUIDO",
        sonar:      "data:audio/mp3;base64,COLE_BASE64_SONAR_DE_MIDIA",
        panel:      "data:audio/mp3;base64,COLE_BASE64_PAINEL_LATERAL"
    };

    // Banco de memória de áudio
    const soundBank = {};
    for (let key in AUDIOS) {
        soundBank[key] = new Audio(AUDIOS[key]);
    }

    // CONTROLE DE POTÊNCIA (VOLUMES: 0.0 a 1.0)
    const volumeConfig = {
        key: 0.15, navBack: 0.20, navFwd: 0.20, navReload: 0.25,
        open: 0.30, close: 0.25, dlStart: 0.30, dlDone: 0.40,
        sonar: 0.25, panel: 0.20
    };

    function playMechaSound(type) {
        try {
            const targetSound = soundBank[type];
            if (!targetSound || targetSound.src.includes("COLE_BASE64")) return;

            // Clonagem de nó para garantir polifonia (sons sobrepostos sem atraso)
            const audioClone = targetSound.cloneNode();
            audioClone.volume = volumeConfig[type];
            audioClone.play().catch(() => {});
        } catch (e) {
            console.error("Falha no gatilho acústico:", type, e);
        }
    }

    // ========================================================
    // INTERCEPTADORES DE TELEMETRIA (EVENT HOOKS)
    // ========================================================

    // 1. INPUT DE TECLADO (MATE-SWITCH)
    window.addEventListener('keydown', (e) => {
        if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter') {
            playMechaSound('key');
        }
    }, true);

    // 2. CLIQUES EM BOTÕES DO SISTEMA (NAVEGAÇÃO E PAINÉIS)
    document.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const title = button.title ? button.title.toLowerCase() : '';
        const cls = button.className.toLowerCase();

        if (title.includes('voltar') || title.includes('back') || cls.includes('back')) {
            playMechaSound('navBack');
        }
        else if (title.includes('avançar') || title.includes('forward') || cls.includes('forward')) {
            playMechaSound('navFwd');
        }
        else if (title.includes('recarregar') || title.includes('reload') || cls.includes('reload')) {
            playMechaSound('navReload');
        }
        else if (title.includes('painel') || title.includes('panel') || cls.includes('toggle-sidebar')) {
            playMechaSound('panel');
        }
    }, true);

    // 3. MONITORAMENTO DE MUTAÇÕES DE INTERFACE (ABAS, SONAR E DOWNLOADS)
    const initSystemObservers = () => {
        const tabStrip = document.querySelector('.tab-strip') || document.getElementById('tabs-container');
        const appRoot = document.getElementById('app') || document.body;

        if (tabStrip) {
            let activeAudioTabs = new Set();

            const tabObserver = new MutationObserver((mutations) => {
                for (let mutation of mutations) {
                    if (mutation.type === 'childList') {
                        if (mutation.addedNodes.length > 0) {
                            for (let node of mutation.addedNodes) {
                                if (node.classList && (node.classList.contains('tab') || node.querySelector('.tab'))) {
                                    playMechaSound('open');
                                }
                            }
                        }
                        if (mutation.removedNodes.length > 0) {
                            for (let node of mutation.removedNodes) {
                                if (node.classList && (node.classList.contains('tab') || node.querySelector('.tab'))) {
                                    playMechaSound('close');
                                }
                            }
                        }
                    }
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const tab = mutation.target.closest('.tab');
                        if (tab) {
                            const isPlayingAudio = tab.classList.contains('audio-playing');
                            const tabId = tab.id || tab.getAttribute('data-id');
                            
                            if (isPlayingAudio && !activeAudioTabs.has(tabId)) {
                                activeAudioTabs.add(tabId);
                                playMechaSound('sonar');
                            } else if (!isPlayingAudio && activeAudioTabs.has(tabId)) {
                                activeAudioTabs.delete(tabId);
                            }
                        }
                    }
                }
            });

            tabObserver.observe(tabStrip, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
        }

        if (appRoot) {
            let downloadIsActive = false;

            const globalObserver = new MutationObserver((mutations) => {
                const dlProgress = document.querySelector('.download-progress, .download-manager progress');
                if (dlProgress && !downloadIsActive) {
                    downloadIsActive = true;
                    playMechaSound('dlStart');
                }
                else if (!dlProgress && downloadIsActive) {
                    downloadIsActive = false;
                    playMechaSound('dlDone');
                }
            });

            globalObserver.observe(appRoot, { childList: true, subtree: true });
        }
    };

    const checkInterval = setInterval(() => {
        if (document.querySelector('.tab-strip') || document.getElementById('tabs-container')) {
            clearInterval(checkInterval);
            initSystemObservers();
            console.log(">> MECHA COCKPIT SOUND SYSTEM V7 LOGGED AND ACTIVE <<");
        }
    }, 1000);
})();