// Assessment Module - CreditScore

class AssessmentManager {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
        this.stream = null;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.recordingStartTime = null;
        if (this.mediaRecorder) {
            this.mediaRecorder.onstop = null;
            this.mediaRecorder = null;
        }
        this.timerInterval = null;
        this.countdownInterval = null;
        this.countdownDuration = 5;
        this.countdownValue = 5;
        this.minimumRecordingMs = 5 * 60 * 1000;
        this.canFinishRecording = false;
        this.hasCompletedRecording = false;
        this.recordingUrl = null;
        this.recordingMimeType = null;
        this.isCameraOn = true;
        this.isMicOn = true;
        this.currentUser = null;

        this.questions = [
            {
                id: 1,
                text: "Qual é o principal motivo para solicitar este crédito?",
                options: [
                    { text: "Compra de imóvel", value: "imovel", score: 20 },
                    { text: "Compra de veículo", value: "veiculo", score: 18 },
                    { text: "Investimento em negócio", value: "negocio", score: 15 },
                    { text: "Consolidação de dívidas", value: "dividas", score: 10 },
                    { text: "Gastos pessoais", value: "pessoais", score: 5 }
                ]
            },
            {
                id: 2,
                text: "Qual é sua renda mensal aproximada?",
                options: [
                    { text: "Até R$ 2.000", value: "ate2k", score: 5 },
                    { text: "R$ 2.001 a R$ 5.000", value: "2k-5k", score: 10 },
                    { text: "R$ 5.001 a R$ 10.000", value: "5k-10k", score: 15 },
                    { text: "R$ 10.001 a R$ 20.000", value: "10k-20k", score: 18 },
                    { text: "Acima de R$ 20.000", value: "acima20k", score: 20 }
                ]
            },
            {
                id: 3,
                text: "Há quanto tempo você trabalha na empresa atual?",
                options: [
                    { text: "Menos de 6 meses", value: "menos6m", score: 5 },
                    { text: "6 meses a 1 ano", value: "6m-1a", score: 8 },
                    { text: "1 a 2 anos", value: "1a-2a", score: 12 },
                    { text: "2 a 5 anos", value: "2a-5a", score: 16 },
                    { text: "Mais de 5 anos", value: "mais5a", score: 20 }
                ]
            },
            {
                id: 4,
                text: "Qual valor você pretende solicitar?",
                options: [
                    { text: "Até R$ 10.000", value: "ate10k", score: 20 },
                    { text: "R$ 10.001 a R$ 50.000", value: "10k-50k", score: 15 },
                    { text: "R$ 50.001 a R$ 100.000", value: "50k-100k", score: 12 },
                    { text: "R$ 100.001 a R$ 300.000", value: "100k-300k", score: 8 },
                    { text: "Acima de R$ 300.000", value: "acima300k", score: 5 }
                ]
            },
            {
                id: 5,
                text: "Você possui outras fontes de renda?",
                options: [
                    { text: "Sim, renda fixa adicional", value: "renda_fixa", score: 15 },
                    { text: "Sim, renda variável", value: "renda_variavel", score: 10 },
                    { text: "Sim, investimentos", value: "investimentos", score: 12 },
                    { text: "Não, apenas salário", value: "apenas_salario", score: 5 }
                ]
            },
            {
                id: 6,
                text: "Qual seu plano para pagamento do empréstimo?",
                options: [
                    { text: "Pagamento antecipado quando possível", value: "antecipado", score: 20 },
                    { text: "Parcelas em dia conforme contrato", value: "em_dia", score: 15 },
                    { text: "Renegociação se necessário", value: "renegociacao", score: 8 },
                    { text: "Ainda não tenho um plano definido", value: "sem_plano", score: 3 }
                ]
            },
            {
                id: 7,
                text: "Como você planeja usar o valor solicitado?",
                options: [
                    { text: "Pagamento à vista de bem/serviço", value: "avista", score: 18 },
                    { text: "Investimento produtivo", value: "investimento", score: 20 },
                    { text: "Reserva de emergência", value: "emergencia", score: 12 },
                    { text: "Gastos diversos", value: "diversos", score: 5 }
                ]
            }
        ];
    }

    async init() {
        // Load user if exists
        const user = localStorage.getItem('currentUser');
        if (user) {
            this.currentUser = JSON.parse(user);
        } else {
            this.currentUser = { name: 'Visitante' };
        }

        // Setup controls
        document.getElementById('toggleCamera')?.addEventListener('click', () => this.toggleCamera());
        document.getElementById('toggleMic')?.addEventListener('click', () => this.toggleMic());
        document.getElementById('finishRecordingBtn')?.addEventListener('click', () => this.finalizeRecording());

        this.hideRecordingReview();
        this.resetFinishButton();

        // Start camera
        await this.startCamera();
    }

    async startCamera() {

        try {

            this.stream = await navigator.mediaDevices.getUserMedia({

                video: { facingMode: 'user', width: 1280, height: 720 },

                audio: true

            });



            const userVideo = document.getElementById('userVideo');

            if (userVideo) userVideo.srcObject = this.stream;

            this.renderQuestion();

            this.prepareRecordingFlow();

            this.updateVideoStatus('<span style="color:#00C853;">Camera ativa</span>');



        } catch (error) {

            console.error('Erro:', error);

            this.updateVideoStatus('Permita o acesso a camera e microfone para continuar.');

            alert('Nao foi possivel acessar a camera. Permita o acesso e tente novamente.');

        }

    }

    prepareRecordingFlow() {

        this.recordingStartTime = null;

        this.recordedChunks = [];

        this.recordingMimeType = null;

        this.hasCompletedRecording = false;

        this.canFinishRecording = false;

        this.countdownValue = this.countdownDuration;

        if (this.timerInterval) {

            clearInterval(this.timerInterval);

            this.timerInterval = null;

        }

        const timerEl = document.getElementById('recordingTimer');

        if (timerEl) timerEl.textContent = '00:00';

        this.resetFinishButton();

        this.hideRecordingReview();

        this.startCountdown();

    }



    startCountdown() {

        const overlay = document.getElementById('countdownOverlay');

        const valueEl = document.getElementById('countdownValue');

        if (!overlay || !valueEl) {

            this.startRecording();

            return;

        }

        this.clearCountdown();

        this.updateVideoStatus('Preparando gravacao...');

        this.countdownValue = this.countdownDuration;

        valueEl.textContent = this.countdownValue;

        overlay.classList.add('visible');

        this.countdownInterval = setInterval(() => {

            this.countdownValue -= 1;

            if (this.countdownValue > 0) {

                valueEl.textContent = this.countdownValue;

            } else {

                this.clearCountdown();

                this.startRecording();

            }

        }, 1000);

    }



    clearCountdown() {

        if (this.countdownInterval) {

            clearInterval(this.countdownInterval);

            this.countdownInterval = null;

        }

        const overlay = document.getElementById('countdownOverlay');

        if (overlay) overlay.classList.remove('visible');

    }



    resetFinishButton() {

        const btn = document.getElementById('finishRecordingBtn');

        if (btn) {

            btn.style.display = 'none';

            btn.disabled = true;

            btn.textContent = 'Concluir gravacao';

        }

        const hint = document.getElementById('minimumTimerHint');

        if (hint) {

            hint.style.display = 'block';

            hint.textContent = 'Disponivel apos 5 minutos de gravacao';

        }

        this.canFinishRecording = false;

    }



    hideRecordingReview() {

        const review = document.getElementById('recordingReview');

        if (review) review.classList.remove('visible');

        const playback = document.getElementById('recordedPlayback');

        if (playback) {

            playback.pause();

            playback.removeAttribute('src');

            playback.load();

        }

        const download = document.getElementById('downloadRecording');

        if (download) {

            download.style.display = 'none';

            download.removeAttribute('href');

        }

        if (this.recordingUrl) {

            URL.revokeObjectURL(this.recordingUrl);

            this.recordingUrl = null;

        }

    }



    showFinishRecordingButton() {

        this.canFinishRecording = true;

        const btn = document.getElementById('finishRecordingBtn');

        if (btn) {

            btn.style.display = 'inline-flex';

            btn.disabled = false;

        }

        const hint = document.getElementById('minimumTimerHint');

        if (hint) hint.textContent = 'Voce pode concluir a gravacao quando estiver pronto.';

    }



    updateVideoStatus(message) {

        const status = document.getElementById('videoStatus');

        if (status) status.innerHTML = message;

    }



    getSupportedMimeType() {

        if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {

            return null;

        }

        const types = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];

        return types.find(type => MediaRecorder.isTypeSupported(type)) || null;

    }



    finalizeRecording() {

        if (!this.canFinishRecording) {

            alert('A gravacao precisa ter no minimo 5 minutos para ser concluida.');

            return;

        }

        if (this.hasCompletedRecording) return;

        const btn = document.getElementById('finishRecordingBtn');

        if (btn) {

            btn.disabled = true;

            btn.textContent = 'Finalizando gravacao...';

        }

        this.updateVideoStatus('Finalizando gravacao...');

        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {

            this.mediaRecorder.stop();

        } else {

            this.handleRecordingCompleted();

        }

    }



    handleRecordingCompleted() {

        if (this.timerInterval) {

            clearInterval(this.timerInterval);

            this.timerInterval = null;

        }

        this.recordingStartTime = null;

        const btn = document.getElementById('finishRecordingBtn');

        if (btn) {

            btn.disabled = true;

            btn.style.display = 'inline-flex';

            btn.textContent = 'Gravacao concluida';

        }

        const hint = document.getElementById('minimumTimerHint');

        if (hint) hint.textContent = 'Gravacao salva localmente. Continue a avaliacao.';



        if (this.recordingUrl) {

            URL.revokeObjectURL(this.recordingUrl);

            this.recordingUrl = null;

        }



        if (this.recordedChunks.length && typeof URL !== 'undefined') {

            const blob = new Blob(this.recordedChunks, { type: this.recordingMimeType || 'video/webm' });

            this.recordingUrl = URL.createObjectURL(blob);

            this.recordedChunks = [];

        }



        if (this.recordingUrl) {

            const playback = document.getElementById('recordedPlayback');

            if (playback) {

                playback.src = this.recordingUrl;

                playback.muted = true;

                playback.controls = true;

                playback.load();

            }

            const download = document.getElementById('downloadRecording');

            if (download) {

                download.href = this.recordingUrl;

                download.style.display = 'inline-flex';

                download.download = 'gravacao-credit-score-' + Date.now() + '.webm';

            }

            const review = document.getElementById('recordingReview');

            if (review) review.classList.add('visible');

        }



        this.hasCompletedRecording = true;

        this.canFinishRecording = false;

        this.updateVideoStatus('<span style="color:#00C853;">Gravacao finalizada</span>');

    }



    startRecording() {

        if (!this.stream) return;

        this.recordedChunks = [];

        this.hasCompletedRecording = false;

        try {

            this.clearCountdown();

            const mimeType = this.getSupportedMimeType();

            this.recordingMimeType = mimeType;

            this.mediaRecorder = mimeType ? new MediaRecorder(this.stream, { mimeType }) : new MediaRecorder(this.stream);

            this.mediaRecorder.ondataavailable = (e) => {

                if (e.data.size > 0) this.recordedChunks.push(e.data);

            };

            this.mediaRecorder.onstop = () => this.handleRecordingCompleted();

            this.mediaRecorder.start(1000);

            this.recordingStartTime = Date.now();

            this.updateVideoStatus('<span style="color:#FF5252;">Gravando</span>');

            this.startTimer();

        } catch (e) {

            console.error('Erro gravacao:', e);

            this.updateVideoStatus('Nao foi possivel iniciar a gravacao.');

        }

    }


    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            if (!this.recordingStartTime) return;
            const elapsed = Date.now() - this.recordingStartTime;
            const min = Math.floor(elapsed / 60000);
            const sec = Math.floor((elapsed % 60000) / 1000);
            const el = document.getElementById('recordingTimer');
            if (el) el.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
            if (!this.canFinishRecording && elapsed >= this.minimumRecordingMs) {
                this.showFinishRecordingButton();
            }
        }, 1000);
    }

    stopRecording() {
        if (this.mediaRecorder?.state === 'recording') this.mediaRecorder.stop();
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.clearCountdown();
        if (this.stream) this.stream.getTracks().forEach(t => t.stop());
    }

    toggleCamera() {
        if (!this.stream) return;
        const track = this.stream.getVideoTracks()[0];
        if (track) {
            track.enabled = !track.enabled;
            this.isCameraOn = track.enabled;
            document.getElementById('toggleCamera')?.classList.toggle('disabled', !this.isCameraOn);
        }
    }

    toggleMic() {
        if (!this.stream) return;
        const track = this.stream.getAudioTracks()[0];
        if (track) {
            track.enabled = !track.enabled;
            this.isMicOn = track.enabled;
            document.getElementById('toggleMic')?.classList.toggle('disabled', !this.isMicOn);
        }
    }

    renderQuestion() {
        const q = this.questions[this.currentQuestion];
        const container = document.getElementById('quizContent');
        const existing = this.answers.find(a => a.questionId === q.id);

        const optionsHtml = q.options.map(opt => `
            <div class="option-item ${existing?.value === opt.value ? 'selected' : ''}" 
                 onclick="assessment.selectOption(${q.id}, '${opt.value}', ${opt.score})">
                <div class="option-radio"></div>
                <span class="option-text">${opt.text}</span>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="question-container">
                <div class="question-number">Questão ${this.currentQuestion + 1} de ${this.questions.length}</div>
                <div class="question-text">${q.text}</div>
                <div class="options-list">${optionsHtml}</div>
            </div>
        `;

        this.updateProgress();
        this.updateNavButtons();
    }

    selectOption(questionId, value, score) {
        this.answers = this.answers.filter(a => a.questionId !== questionId);
        this.answers.push({ questionId, value, score });
        this.renderQuestion();
    }

    updateProgress() {
        const pct = ((this.currentQuestion + 1) / this.questions.length) * 100;
        const fill = document.getElementById('progressFill');
        const text = document.getElementById('progressText');
        if (fill) fill.style.width = `${pct}%`;
        if (text) text.textContent = `${this.currentQuestion + 1}/${this.questions.length}`;
    }

    updateNavButtons() {
        const prev = document.getElementById('prevBtn');
        const next = document.getElementById('nextBtn');
        const submit = document.getElementById('submitBtn');

        if (prev) prev.disabled = this.currentQuestion === 0;

        const isLast = this.currentQuestion === this.questions.length - 1;
        if (next) next.style.display = isLast ? 'none' : 'block';
        if (submit) submit.style.display = isLast ? 'block' : 'none';
    }

    nextQuestion() {
        const q = this.questions[this.currentQuestion];
        if (!this.answers.some(a => a.questionId === q.id)) {
            alert('Selecione uma opção.');
            return;
        }
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.renderQuestion();
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderQuestion();
        }
    }

    submitQuiz() {
        if (this.answers.length < this.questions.length) {
            alert('Responda todas as questões.');
            return;
        }


        if (!this.hasCompletedRecording) {

            alert('Conclua a gravacao de video antes de finalizar.');

            return;

        }



        
        // Calculate result
        const total = this.answers.reduce((s, a) => s + a.score, 0);
        const max = this.questions.reduce((s, q) => s + Math.max(...q.options.map(o => o.score)), 0);
        const pct = Math.round((total / max) * 100);

        let status, statusClass, message;
        if (pct >= 70) {
            status = 'APROVADO';
            statusClass = 'approved';
            message = 'Parabéns! Seu perfil foi aprovado para análise de crédito.';
        } else if (pct >= 50) {
            status = 'EM ANÁLISE';
            statusClass = 'pending';
            message = 'Seu perfil será analisado pela equipe especializada.';
        } else {
            status = 'NÃO APROVADO';
            statusClass = 'rejected';
            message = 'Seu perfil não atende aos critérios atuais.';
        }

        const duration = document.getElementById('recordingTimer')?.textContent || '00:00';
        const now = new Date();
        const protocol = `CS${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

        // Capture avatar
        const avatar = this.captureAvatar();

        // Save result
        const result = {
            userName: this.currentUser?.name || 'Cliente',
            score: pct,
            status,
            statusClass,
            message,
            duration,
            date: now.toLocaleDateString('pt-BR'),
            protocol,
            avatar
        };

        // Save to current result
        localStorage.setItem('assessmentResult', JSON.stringify(result));
        
        // Save to history
        const history = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
        history.unshift(result);
        localStorage.setItem('assessmentHistory', JSON.stringify(history));
        
        this.stopRecording();
        window.location.href = 'result.html';
    }

    captureAvatar() {
        const video = document.getElementById('userVideo');
        const canvas = document.createElement('canvas');
        canvas.width = 144;
        canvas.height = 144;
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -144, 0, 144, 144);
        ctx.restore();
        return canvas.toDataURL();
    }
}

// Global instance
const assessment = new AssessmentManager();

// Global functions
function nextQuestion() { assessment.nextQuestion(); }
function previousQuestion() { assessment.previousQuestion(); }
function submitQuiz() { assessment.submitQuiz(); }

// Init
document.addEventListener('DOMContentLoaded', () => assessment.init());
