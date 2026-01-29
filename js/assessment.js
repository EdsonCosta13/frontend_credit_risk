// Assessment Module - CreditScore

class AssessmentManager {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
        this.stream = null;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.recordingStartTime = null;
        this.timerInterval = null;
        this.countdownInterval = null;
        this.countdownDuration = 5;
        this.countdownValue = 5;
        this.hasCompletedRecording = false;
        this.isRecordingActive = false;
        this.recordingUrl = null;
        this.recordingMimeType = null;
        this.isCameraOn = true;
        this.isMicOn = true;
        this.quizStarted = false;
        this.sessionId = null;
        this.currentQuestionData = null;
        this.selectedAnswer = null;
        this.totalQuestions = null;
        this.remainingQuestions = null;
        this.questionsAnswered = 0;
        this.quizScore = 0;
        this.quizRiskLevel = 'desconhecido';
        this.quizHistory = [];
        this.isLoadingQuestion = false;
        this.isSubmittingAnswer = false;
        this.evaluationSummary = null;
        this.pendingResultData = null;
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
        // Load user if exists, otherwise use Visitante
        const user = localStorage.getItem('currentUser');
        if (user) {
            try {
                this.currentUser = JSON.parse(user);
            } catch (e) {
                this.currentUser = { name: 'Visitante', id: 'guest_' + Date.now() };
            }
        } else {
            // Permite acesso sem login
            this.currentUser = { name: 'Visitante', id: 'guest_' + Date.now() };
        }

        // Setup controls
        document.getElementById('toggleCamera')?.addEventListener('click', () => this.toggleCamera());
        document.getElementById('toggleMic')?.addEventListener('click', () => this.toggleMic());
        document.getElementById('finishRecordingBtn')?.addEventListener('click', () => this.finalizeRecording());
        document.getElementById('startQuizBtn')?.addEventListener('click', () => this.startQuiz());

        this.hideRecordingReview();
        this.resetFinishButton();
        this.updateRecordingChip('idle', 'Inicializando camera');

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

            this.prepareRecordingFlow();

            this.updateVideoStatus('<span style="color:#00C853;">Camera ativa</span>');



        } catch (error) {

            console.error('Erro:', error);

            this.updateVideoStatus('Permita o acesso à câmera e microfone para continuar.');

            this.updateRecordingChip('idle', 'Permissão necessária');

            this.updateRecordingHint('Permita o acesso à câmera e microfone para iniciar a avaliação.');

            alert('Não foi possível acessar a câmera e microfone.\n\nPara realizar a avaliação, você precisa permitir o acesso. Verifique as configurações do seu navegador e tente novamente.');

        }

    }

    handleQuizCompletion() {

        this.quizStarted = false;

        this.currentQuestionData = null;

        this.remainingQuestions = 0;

        this.renderQuestion();

        const overlay = document.getElementById('quizStartOverlay');

        if (overlay) {

            overlay.classList.remove('hidden');

        }

        const summaryData = this.pendingResultData?.evaluationSummary || this.evaluationSummary;

        if (summaryData) {

            this.renderEvaluationSummary(summaryData);

            this.updateSummaryNote(this.hasCompletedRecording

                ? 'Gravacao concluida. Finalizando avaliacao...'

                : 'Finalize a gravacao para concluir sua avaliacao.');

        } else if (overlay) {

            const title = overlay.querySelector('h2');

            const desc = overlay.querySelector('p');

            const btn = overlay.querySelector('button');

            if (title) title.textContent = 'Questionario concluido';

            if (desc) desc.textContent = 'Estamos finalizando sua avaliacao...';

            if (btn) btn.style.display = 'none';

        }

        this.tryFinalizeAssessment();

    }

    tryFinalizeAssessment() {

        if (!this.pendingResultData) return;

        if (!this.hasCompletedRecording) {

            this.updateRecordingHint('Finalize a gravacao para enviar sua avaliacao.');

            if (this.evaluationSummary) {

                this.updateSummaryNote('Finalize a gravacao para concluir sua avaliacao.');

            }

            return;

        }

        if (this.evaluationSummary) {

            this.updateSummaryNote('Gerando resultado final...');

        }

        this.generateResultAndRedirect(this.pendingResultData);

        this.pendingResultData = null;

    }

    generateResultAndRedirect(apiData) {

        const summary = apiData?.evaluationSummary || this.evaluationSummary;

        const summaryScore = typeof summary?.finalScore === 'number' ? summary.finalScore : null;
        const fallbackScore = typeof apiData?.updatedScore === 'number' ? apiData.updatedScore : this.quizScore;
        const pct = Math.max(0, Math.min(100, Math.round(summaryScore ?? fallbackScore ?? 0)));

        const derivedRisk = summary?.inferredRiskLevel || apiData?.inferredRiskLevel || this.quizRiskLevel || '';
        const risk = (derivedRisk || '').toLowerCase();

        const statusMeta = this.getStatusFromRiskLevel(risk);

        const duration = document.getElementById('recordingTimer')?.textContent || '00:00';

        const now = new Date();

        const protocol = `CS${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

        const avatar = this.captureAvatar();

        const result = {

            userName: this.currentUser?.name || 'Cliente',

            score: pct,

            status: statusMeta.status,

            statusClass: statusMeta.statusClass,

            message: statusMeta.message,

            duration,

            date: now.toLocaleDateString('pt-BR'),

            protocol,

            avatar

        };

        if (summary?.historySummary) {

            result.historySummary = summary.historySummary;

        }

        if (Array.isArray(summary?.recommendations)) {

            result.recommendations = summary.recommendations;

        }

        if (summary?.inferredRiskLevel) {

            result.inferredRiskLevel = summary.inferredRiskLevel;

        }

        localStorage.setItem('assessmentResult', JSON.stringify(result));

        const history = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');

        history.unshift(result);

        localStorage.setItem('assessmentHistory', JSON.stringify(history));

        window.location.href = 'result.html';

    }

    getStatusFromRiskLevel(risk) {

        const mapping = {

            baixo: {

                status: 'APROVADO',

                statusClass: 'approved',

                message: 'Perfil considerado de baixo risco. Parabens!'

            },

            medio: {

                status: 'EM ANALISE',

                statusClass: 'pending',

                message: 'Seu perfil sera avaliado por nossa equipe especializada.'

            },

            alto: {

                status: 'NAO APROVADO',

                statusClass: 'rejected',

                message: 'Identificamos risco elevado para concessao neste momento.'

            }

        };

        return mapping[risk] || {

            status: 'EM ANALISE',

            statusClass: 'pending',

            message: 'Seu questionario foi recebido e esta em avaliacao.'

        };

    }

    prepareRecordingFlow() {

        this.recordingStartTime = null;

        this.recordedChunks = [];

        this.recordingMimeType = null;

        this.hasCompletedRecording = false;

        this.isRecordingActive = false;

        this.countdownValue = this.countdownDuration;

        if (this.timerInterval) {

            clearInterval(this.timerInterval);

            this.timerInterval = null;

        }

        const timerEl = document.getElementById('recordingTimer');

        if (timerEl) timerEl.textContent = '00:00';

        this.resetFinishButton();

        this.hideRecordingReview();

        this.updateRecordingHint('Prepare-se, a gravacao iniciara em instantes.');

        this.updateRecordingChip('countdown', 'Preparando...');

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

        this.updateRecordingChip('countdown', `Gravacao inicia em ${this.countdownValue}s`);

        this.countdownInterval = setInterval(() => {

            this.countdownValue -= 1;

            if (this.countdownValue > 0) {

                valueEl.textContent = this.countdownValue;

                this.updateRecordingChip('countdown', `Gravacao inicia em ${this.countdownValue}s`);

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

        this.updateRecordingHint('Aguardando inicio da gravacao...');

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

        const btn = document.getElementById('finishRecordingBtn');

        if (btn) {

            btn.style.display = 'inline-flex';

            btn.disabled = false;

            btn.textContent = 'Concluir gravacao';

        }

        this.updateRecordingHint('Clique em "Concluir gravacao" quando terminar.');

    }

    setQuizLoading(isLoading, message) {
        const overlay = document.getElementById('quizLoadingIndicator');
        const text = document.getElementById('quizLoadingText');
        if (!overlay) return;
        if (isLoading) {
            overlay.classList.add('visible');
            if (text && message) text.textContent = message;
        } else {
            overlay.classList.remove('visible');
        }
    }

    renderEvaluationSummary(summary) {
        const card = document.getElementById('quizSummaryCard');
        const startCard = document.getElementById('quizStartCard');
        if (!card || !startCard) return;
        if (!summary) {
            card.classList.remove('show');
            startCard.style.display = 'flex';
            this.updateSummaryNote('');
            return;
        }
        startCard.style.display = 'none';
        card.classList.add('show');
        const scoreEl = document.getElementById('summaryScore');
        if (scoreEl) scoreEl.textContent = typeof summary.finalScore === 'number' ? `${summary.finalScore}` : '--';
        const riskEl = document.getElementById('summaryRisk');
        if (riskEl) riskEl.textContent = `Risco ${(summary.inferredRiskLevel || this.quizRiskLevel || '--').toUpperCase()}`;
        const historyEl = document.getElementById('summaryHistory');
        if (historyEl) historyEl.textContent = summary.historySummary || 'Resumo nao disponivel.';
        const recList = document.getElementById('summaryRecommendations');
        if (recList) {
            recList.innerHTML = '';
            if (Array.isArray(summary.recommendations) && summary.recommendations.length) {
                summary.recommendations.forEach(rec => {
                    const li = document.createElement('li');
                    li.textContent = rec;
                    recList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = 'Sem recomendacoes adicionais.';
                recList.appendChild(li);
            }
        }
    }

    updateSummaryNote(message) {
        const note = document.getElementById('summaryNote');
        if (!note) return;
        if (!message) {
            note.textContent = '';
            note.style.display = 'none';
            return;
        }
        note.style.display = 'block';
        note.textContent = message;
    }



    updateRecordingHint(message) {

        const hint = document.getElementById('minimumTimerHint');

        if (!hint) return;

        if (!message) {

            hint.style.display = 'none';

            hint.textContent = '';

            return;

        }

        hint.style.display = 'block';

        hint.textContent = message;

    }



    updateRecordingChip(state, message) {

        const chip = document.getElementById('recordingChip');

        const text = document.getElementById('recordingChipText');

        if (!chip || !text) return;

        chip.classList.remove('recording', 'countdown', 'finished', 'idle');

        const allowed = ['recording', 'countdown', 'finished', 'idle'];

        const nextState = allowed.includes(state) ? state : 'idle';

        chip.classList.add(nextState);

        if (message) text.textContent = message;

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

        if (this.hasCompletedRecording) return;

        if (!this.isRecordingActive || !this.mediaRecorder) {

            alert('A gravação ainda não foi iniciada. Aguarde alguns instantes.');

            return;

        }

        const btn = document.getElementById('finishRecordingBtn');

        if (btn) {

            btn.disabled = true;

            btn.textContent = 'Finalizando gravacao...';

        }

        this.updateVideoStatus('Finalizando gravacao...');

        this.updateRecordingHint('Finalizando gravacao...');

        this.updateRecordingChip('recording', 'Finalizando...');

        if (this.mediaRecorder.state === 'recording') {

            this.mediaRecorder.stop();

        } else {

            this.handleRecordingCompleted();

        }

    }

    async startQuiz() {
        if (this.quizStarted) return;

        const btn = document.getElementById('startQuizBtn');
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Iniciando...';
        }

        try {
            // Sistema local - sem API
            this.sessionId = 'LOCAL_' + Date.now();
            localStorage.setItem('quizSessionId', this.sessionId);

            this.questionsAnswered = 0;
            this.totalQuestions = this.questions.length;
            this.remainingQuestions = this.questions.length;
            this.quizHistory = [];
            this.selectedAnswer = null;
            this.currentQuestionData = null;
            this.pendingResultData = null;
            this.evaluationSummary = null;
            this.quizScore = 0;
            this.currentQuestion = 0;
            this.renderEvaluationSummary(null);
            this.updateSummaryNote('');

            this.quizStarted = true;

            const overlay = document.getElementById('quizStartOverlay');
            if (overlay) overlay.classList.add('hidden');

            // Carregar primeira questão
            this.loadLocalQuestion();

        } catch (error) {
            console.error('Erro ao iniciar quiz:', error);
            alert('Não foi possível iniciar o questionário. Por favor, tente novamente.');
            this.quizStarted = false;
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.textContent = 'Iniciar quiz';
            }
        }
    }

    loadLocalQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.completeQuiz();
            return;
        }

        const question = this.questions[this.currentQuestion];
        this.currentQuestionData = {
            id: question.id,
            text: question.text,
            options: question.options.map(opt => opt.text)
        };
        
        this.remainingQuestions = this.questions.length - this.currentQuestion - 1;
        this.selectedAnswer = null;
        this.renderQuestion();
    }

    async submitLocalAnswer() {
        if (!this.selectedAnswer) {
            alert('Por favor, selecione uma opção antes de continuar.');
            return;
        }

        this.isLoadingQuestion = true;
        this.isSubmittingAnswer = true;
        this.setQuizLoading(true, 'Processando resposta...');

        // Simular delay de processamento
        await new Promise(resolve => setTimeout(resolve, 500));

        const question = this.questions[this.currentQuestion];
        const selectedOption = question.options.find(opt => opt.text === this.selectedAnswer);
        
        if (selectedOption) {
            this.quizScore += selectedOption.score;
            this.quizHistory.push({
                questionId: question.id,
                answer: this.selectedAnswer,
                score: selectedOption.score
            });
        }

        this.questionsAnswered += 1;
        this.currentQuestion += 1;

        // Calcular nível de risco
        const maxScore = this.questions.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.score)), 0);
        const percentage = (this.quizScore / maxScore) * 100;
        
        if (percentage >= 70) {
            this.quizRiskLevel = 'baixo';
        } else if (percentage >= 40) {
            this.quizRiskLevel = 'medio';
        } else {
            this.quizRiskLevel = 'alto';
        }

        this.isLoadingQuestion = false;
        this.isSubmittingAnswer = false;
        this.setQuizLoading(false);

        // Carregar próxima questão ou finalizar
        if (this.currentQuestion < this.questions.length) {
            this.loadLocalQuestion();
        } else {
            this.completeQuiz();
        }
    }

    completeQuiz() {
        this.quizStarted = false;
        this.currentQuestionData = null;
        this.remainingQuestions = 0;
        
        // Gerar resumo de avaliação
        const maxScore = this.questions.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.score)), 0);
        const percentage = Math.round((this.quizScore / maxScore) * 100);
        
        this.evaluationSummary = {
            finalScore: percentage,
            inferredRiskLevel: this.quizRiskLevel,
            historySummary: `Você respondeu ${this.questionsAnswered} questões e obteve ${this.quizScore} pontos de um total possível de ${maxScore}.`,
            recommendations: this.generateRecommendations()
        };

        this.pendingResultData = {
            evaluationSummary: this.evaluationSummary,
            updatedScore: percentage,
            inferredRiskLevel: this.quizRiskLevel
        };

        this.renderQuestion();
        const overlay = document.getElementById('quizStartOverlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }

        this.renderEvaluationSummary(this.evaluationSummary);
        this.updateSummaryNote(this.hasCompletedRecording
            ? 'Gravacao concluida. Finalizando avaliacao...'
            : 'Finalize a gravacao para concluir sua avaliacao.');

        this.tryFinalizeAssessment();
    }

    generateRecommendations() {
        const recommendations = [];
        
        if (this.quizRiskLevel === 'alto') {
            recommendations.push('Considere aumentar sua renda mensal antes de solicitar crédito');
            recommendations.push('Trabalhe na estabilização de seu emprego atual');
            recommendations.push('Planeje melhor o uso do crédito');
        } else if (this.quizRiskLevel === 'medio') {
            recommendations.push('Continue construindo seu histórico financeiro');
            recommendations.push('Considere fontes de renda adicionais');
            recommendations.push('Mantenha um plano de pagamento consistente');
        } else {
            recommendations.push('Excelente perfil de crédito!');
            recommendations.push('Continue mantendo seus compromissos financeiros em dia');
            recommendations.push('Considere oportunidades de investimento');
        }
        
        return recommendations;
    }



    handleRecordingCompleted() {

        if (this.timerInterval) {

            clearInterval(this.timerInterval);

            this.timerInterval = null;

        }

        this.recordingStartTime = null;

        this.isRecordingActive = false;

        if (this.mediaRecorder) {

            this.mediaRecorder.onstop = null;

            this.mediaRecorder = null;

        }

        const btn = document.getElementById('finishRecordingBtn');

        if (btn) {

            btn.disabled = true;

            btn.style.display = 'inline-flex';

            btn.textContent = 'Gravacao concluida';

        }

        this.updateRecordingHint('Gravacao salva localmente. Continue a avaliacao.');



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
        this.updateRecordingChip('finished', 'Gravacao finalizada');
        this.updateVideoStatus('<span style="color:#00C853;">Gravacao finalizada</span>');
        if (this.evaluationSummary) {
            this.updateSummaryNote('Gravacao concluida. Finalizando avaliacao...');
        }
        this.tryFinalizeAssessment();

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

            this.isRecordingActive = true;

            this.updateRecordingChip('recording', 'Gravando agora');

            this.updateVideoStatus('<span style="color:#FF5252;">Gravando</span>');

            this.showFinishRecordingButton();

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
        this.isRecordingActive = false;
        if (this.hasCompletedRecording) {
            this.updateRecordingChip('finished', 'Gravacao finalizada');
            this.updateRecordingHint('Gravacao finalizada. Continue a avaliacao.');
        } else {
            this.updateRecordingChip('idle', 'Camera pausada');
            this.updateRecordingHint('Camera pausada.');
        }
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
        const container = document.getElementById('quizContent');
        if (!container) return;

        if (!this.currentQuestionData) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>${this.quizStarted ? 'Carregando proxima pergunta...' : 'Clique em "Iniciar quiz" para comecar.'}</p>
                </div>
            `;
            this.updateProgress();
            this.updateNavButtons();
            return;
        }

        const total = this.computeTotalQuestions();
        const currentIndex = this.questionsAnswered + 1;
        const options = Array.isArray(this.currentQuestionData.options) ? this.currentQuestionData.options : [];

        const optionsHtml = options.map((opt, index) => `
            <div class="option-item ${this.selectedAnswer === opt ? 'selected' : ''}" 
                 onclick="assessment.selectOption(${index})">
                <div class="option-radio"></div>
                <span class="option-text">${opt}</span>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="question-container">
                <div class="question-number">Questao ${currentIndex} de ${total}</div>
                <div class="question-text">${this.currentQuestionData.text || ''}</div>
                <div class="options-list">${optionsHtml}</div>
            </div>
        `;

        this.updateProgress(total, currentIndex);
        this.updateNavButtons();
    }

    computeTotalQuestions() {
        if (this.totalQuestions) return this.totalQuestions;
        const remaining = typeof this.remainingQuestions === 'number' ? this.remainingQuestions : 0;
        const base = this.currentQuestionData ? 1 : 0;
        return Math.max(1, this.questionsAnswered + remaining + base);
    }

    selectOption(optionIndex) {
        if (!this.currentQuestionData) return;
        const optionValue = this.currentQuestionData.options?.[optionIndex];
        if (!optionValue) return;
        this.selectedAnswer = optionValue;
        this.renderQuestion();
    }

    updateProgress(total = this.computeTotalQuestions(), currentIndex = this.quizStarted ? this.questionsAnswered + 1 : 0) {
        const pct = total ? (currentIndex / total) * 100 : 0;
        const fill = document.getElementById('progressFill');
        const text = document.getElementById('progressText');
        if (fill) fill.style.width = `${pct}%`;
        if (text) text.textContent = total ? `${currentIndex}/${total}` : '0/0';
    }

    updateNavButtons() {
        const prev = document.getElementById('prevBtn');
        const next = document.getElementById('nextBtn');
        const submit = document.getElementById('submitBtn');

        if (prev) {
            prev.disabled = true;
            prev.style.visibility = 'hidden';
        }

        if (next) {
            next.classList.remove('loading');
            if (!this.currentQuestionData) {
                next.disabled = true;
                next.textContent = 'Aguardando...';
            } else {
                next.style.display = 'block';
                if (this.isLoadingQuestion) {
                    next.disabled = true;
                    next.textContent = this.isSubmittingAnswer ? 'Enviando resposta...' : 'Carregando...';
                    next.classList.add('loading');
                } else {
                    next.disabled = !this.selectedAnswer;
                    next.textContent = this.remainingQuestions === 0 ? 'Enviar e finalizar' : 'Enviar resposta';
                }
            }
        }

        if (submit) submit.style.display = 'none';
    }

    nextQuestion() {
        this.submitCurrentAnswer();
    }

    previousQuestion() {
        alert('Não é possível voltar para questões anteriores.\n\nResponda com atenção antes de avançar.');
    }

    async submitCurrentAnswer() {
        if (!this.quizStarted || !this.currentQuestionData) {
            alert('Inicie o questionário para responder às perguntas.');
            return;
        }
        if (!this.selectedAnswer) {
            alert('Por favor, selecione uma opção antes de continuar.');
            return;
        }
        await this.submitLocalAnswer();
    }

    submitQuiz() {
        if (this.pendingResultData && this.hasCompletedRecording) {
            this.generateResultAndRedirect(this.pendingResultData);
            this.pendingResultData = null;
            return;
        }
        alert('Para finalizar, você precisa:\n\n- Completar todas as questões\n- Concluir a gravação de vídeo\n\nContinue o processo para ver seus resultados.');
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
