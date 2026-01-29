# 🏦 CreditScore - Sistema de Avaliação de Crédito

<div align="center">

![Status](https://img.shields.io/badge/Status-Funcional-brightgreen)
![Versão](https://img.shields.io/badge/Vers%C3%A3o-2.0-blue)
![Licença](https://img.shields.io/badge/Licen%C3%A7a-MIT-yellow)
![Offline](https://img.shields.io/badge/Modo-Offline-orange)

Sistema completo de avaliação de crédito com interface moderna, questionário interativo e gravação de vídeo.

[🚀 Início Rápido](#-início-rápido) • [📖 Documentação](#-documentação) • [✨ Funcionalidades](#-funcionalidades) • [🎨 Screenshots](#-capturas-de-tela)

</div>

---

## 📋 Sobre o Projeto

O **CreditScore** é uma aplicação web moderna para avaliação de perfil de crédito que combina:

- 📝 **Questionário interativo** com 7 perguntas estratégicas
- 🎥 **Gravação de vídeo** para análise comportamental
- 📊 **Cálculo automático** de score e risco
- 💡 **Recomendações personalizadas** baseadas no perfil
- 📱 **Interface moderna** e responsiva

### 🌟 Diferenciais

- ✅ **100% Offline** - Funciona sem internet
- 🚫 **Sem API** - Não depende de servidores externos
- 🔒 **Privado** - Dados armazenados localmente
- ⚡ **Rápido** - Respostas instantâneas
- 🎨 **Moderno** - Interface limpa e intuitiva

---

## 🚀 Início Rápido

### Pré-requisitos

- 🌐 Navegador moderno (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)
- 📷 Webcam funcional
- 🎤 Microfone funcional

### Instalação

1. **Clone ou baixe o projeto**
```bash
git clone https://github.com/seu-usuario/creditscore.git
cd creditscore
```

2. **Abra no navegador**
```bash
# Simplesmente abra o arquivo index.html
# Ou use um servidor local
python -m http.server 8000
# Acesse: http://localhost:8000
```

3. **Pronto! 🎉**
- Sistema funcionando sem configurações adicionais
- Sem necessidade de npm install ou build
- Sem dependências externas

---

## ✨ Funcionalidades

### 🔐 Autenticação
- [x] Cadastro de usuário com validação
- [x] Login com email e senha
- [x] Máscaras para CPF e telefone
- [x] Validação de campos em tempo real

### 📊 Dashboard
- [x] Visualização de todas as avaliações
- [x] Estatísticas (Total, Aprovadas, Em Análise, Rejeitadas)
- [x] Filtros por status
- [x] Busca por protocolo
- [x] Visualização detalhada de cada avaliação

### 🎥 Avaliação
- [x] 7 questões sobre perfil financeiro
- [x] Gravação de vídeo automática
- [x] Progresso visual em tempo real
- [x] Controles de câmera e microfone
- [x] Preview e download da gravação

### 📈 Resultado
- [x] Score de 0 a 100 pontos
- [x] Status: Aprovado / Em Análise / Não Aprovado
- [x] Protocolo único de identificação
- [x] Recomendações personalizadas
- [x] Opção de impressão

---

## 🎯 Como Usar

### 1. Criar Conta
```
1. Clique em "Criar Conta"
2. Preencha: Nome, Email, CPF, Telefone, Senha
3. Aceite os termos
4. Clique em "Criar Conta"
```

### 2. Fazer Avaliação
```
1. No Dashboard, clique em "Nova Avaliação"
2. Permita acesso à câmera e microfone
3. Aguarde a contagem regressiva
4. Clique em "Começar Questionário"
5. Responda as 7 questões
6. Clique em "Concluir gravação"
```

### 3. Ver Resultado
```
1. Seu score será calculado automaticamente
2. Visualize seu status
3. Leia as recomendações
4. Imprima ou volte ao dashboard
```

---

## 🎨 Capturas de Tela

### Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard)
*Painel principal com estatísticas e histórico de avaliações*

### Avaliação
![Avaliação](https://via.placeholder.com/800x400?text=Avaliação)
*Tela de avaliação com vídeo e questionário*

### Resultado
![Resultado](https://via.placeholder.com/800x400?text=Resultado)
*Resultado final com score e recomendações*

---

## 🏗️ Estrutura do Projeto

```
creditscore/
├── 📄 index.html              # Página inicial (redireciona)
├── 📁 css/
│   └── styles.css             # Estilos modernos
├── 📁 js/
│   ├── auth.js                # Autenticação
│   ├── dashboard.js           # Dashboard
│   └── assessment.js          # Avaliação (sem API)
├── 📁 pages/
│   ├── signin.html            # Login
│   ├── signup.html            # Cadastro
│   ├── dashboard.html         # Painel
│   ├── assessment.html        # Avaliação
│   └── result.html            # Resultado
├── 📄 README.md               # Este arquivo
├── 📄 MELHORIAS.md            # Documentação completa
├── 📄 GUIA-RAPIDO.md          # Guia de uso
└── 📄 RESUMO-EXECUTIVO.md     # Resumo executivo
```

---

## 🎨 Tecnologias

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos com animações
- **JavaScript (Vanilla)** - Lógica sem frameworks

### APIs do Navegador
- **LocalStorage** - Persistência de dados
- **MediaRecorder** - Gravação de vídeo
- **getUserMedia** - Acesso à câmera/microfone

### Estilo
- **Variáveis CSS** - Tema customizável
- **Flexbox/Grid** - Layout responsivo
- **Animations** - Transições suaves

---

## 📊 Sistema de Pontuação

### Questões e Pontos

| Questão | Peso |
|---------|------|
| Motivo do crédito | 5-20 pontos |
| Renda mensal | 5-20 pontos |
| Tempo de empresa | 5-20 pontos |
| Valor solicitado | 5-20 pontos |
| Outras rendas | 5-15 pontos |
| Plano de pagamento | 3-20 pontos |
| Uso do valor | 5-20 pontos |

**Total Máximo**: 135 pontos (convertido para escala 0-100)

### Classificação de Risco

| Score | Risco | Status |
|-------|-------|--------|
| 70-100 | Baixo | ✅ Aprovado |
| 40-69 | Médio | ⏳ Em Análise |
| 0-39 | Alto | ❌ Não Aprovado |

---

## 🎯 Roadmap

### ✅ Versão 2.0 (Atual)
- [x] Remoção completa de API
- [x] Interface modernizada
- [x] Animações e transições
- [x] Mensagens amigáveis
- [x] Sistema de pontuação local

### 🔮 Próximas Versões

#### v2.1 - PWA
- [ ] Service Workers
- [ ] Instalação offline
- [ ] Cache de recursos
- [ ] Notificações push

#### v2.2 - Exportação
- [ ] Exportar para PDF
- [ ] Gráficos de evolução
- [ ] Comparação entre avaliações
- [ ] Backup/restore de dados

#### v2.3 - Personalização
- [ ] Tema claro/escuro
- [ ] Customização de cores
- [ ] Tutorial interativo
- [ ] Mais idiomas

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📚 Documentação Adicional

- 📖 [**MELHORIAS.md**](MELHORIAS.md) - Lista completa de melhorias implementadas
- 🚀 [**GUIA-RAPIDO.md**](GUIA-RAPIDO.md) - Guia rápido de uso
- 📊 [**RESUMO-EXECUTIVO.md**](RESUMO-EXECUTIVO.md) - Resumo executivo do projeto

---

## ❓ FAQ

### Preciso de servidor?
❌ Não! O sistema funciona 100% no navegador.

### Meus dados são seguros?
✅ Sim! Tudo fica armazenado localmente no seu dispositivo.

### Funciona offline?
✅ Sim! Depois de carregar uma vez, funciona sem internet.

### Funciona no celular?
⚠️ Sim, mas a experiência é melhor em desktop/laptop.

### Como faço backup dos dados?
💾 Os dados ficam no localStorage. Use ferramentas de exportação do navegador.

### Posso personalizar?
✅ Sim! O código é aberto e bem documentado.

---

## 🐛 Problemas Conhecidos

- 📱 Interface mobile pode ter limitações em telas pequenas
- 🎥 Alguns navegadores podem ter restrições de gravação
- 💾 LocalStorage tem limite de ~5-10MB por domínio

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Autores

- **Desenvolvedor Principal** - *Desenvolvimento e Design* - [Seu Nome]

---

## 🙏 Agradecimentos

- Inspiração em sistemas modernos de fintech
- Comunidade open source
- Feedback de usuários beta

---

## 📞 Contato

- 📧 Email: contato@creditscore.com
- 🌐 Website: https://creditscore.com
- 💬 Issues: https://github.com/seu-usuario/creditscore/issues

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela!**

Feito com ❤️ e ☕

[⬆ Voltar ao topo](#-creditscore---sistema-de-avaliação-de-crédito)

</div>
