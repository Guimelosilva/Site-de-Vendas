---

## README.md

```markdown
# 🍬 G&H Doces - Sistema de Gestão de Encomendas

![Status](https://img.shields.io/badge/status-produção-brightgreen)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)

---

## 📖 Sobre o Projeto

**G&H Doces** é um sistema completo de gestão de pedidos desenvolvido especialmente para a doceria **G&H Doces - Amor em formato de doces**.

> 💑 Este projeto foi criado por um casal que deseja realizar sonhos através dos doces. Cada pedido, cada entrega e cada sorriso é motivo para continuar acreditando que o amor transforma vidas.

O sistema foi desenvolvido para facilitar o dia a dia da doceria, permitindo gerenciar encomendas, controlar finanças, registrar gastos e acompanhar vendas em tempo real.

---

## ✨ Funcionalidades Principais

| Funcionalidade | Descrição |
|----------------|-----------|
| 📝 **Pedidos Multi-produto** | Adicione múltiplos produtos no mesmo pedido |
| 💰 **Preços Variáveis** | Defina preços personalizados por produto |
| 🎉 **Promoções Automáticas** | Detecta automaticamente promoções |
| 📊 **Dashboard Financeiro** | Gráficos de ganhos mensais e controle de lucro/prejuízo |
| 💸 **Controle de Gastos** | Registre gastos por categoria, local e descrição |
| 🔄 **Sincronização em Tempo Real** | Dados compartilhados entre todos os usuários |
| 📱 **PWA Installável** | Instale como aplicativo no celular |
| 💾 **Backup e Restauração** | Exporte e importe dados em JSON |
| 📥 **Exportação de Relatórios** | Gere relatórios detalhados em TXT |

---

## 🚀 Demonstração Online

🔗 **Acesse o sistema:** [https://gehdoces-97753.netlify.app](https://gehdoces-97753.netlify.app)

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Finalidade |
|------------|-------------|
| **HTML5** | Estrutura da aplicação |
| **CSS3** | Estilização e responsividade |
| **JavaScript** | Lógica e interatividade |
| **Firebase Firestore** | Banco de dados em tempo real |
| **Chart.js** | Gráficos financeiros |

---

## 📁 Estrutura do Projeto

```
gh-doces/
├── index.html          # Estrutura principal
├── style.css           # Estilos e responsividade
├── script.js           # Lógica e integração com Firebase
├── manifest.json       # Configuração PWA
└── README.md           # Documentação
```

---

## 🎨 Paleta de Cores da Marca

| Cor | Código | Uso |
|-----|--------|-----|
| Rosa Fundo | `#FFF0F3` | Background da página |
| Rosa Doce | `#FFB7C5` | Detalhes e hover |
| Vermelho Amor | `#E63946` | Botões principais |
| Verde Maracujá | `#9CBE5F` | Promoções e status positivo |
| Verde Pago | `#27AE60` | Status de pagamento confirmado |
| Vermelho Pendente | `#E74C3C` | Status pendente |

---

## 📱 Como Instalar como App no Celular

### iOS (iPhone)
1. Abra o site no **Safari**
2. Toque no botão **Compartilhar** (ícone de caixa com seta)
3. Role para baixo e toque em **"Adicionar à Tela de Início"**
4. Confirme o nome **"G&H Doces"** e toque em **"Adicionar"**

### Android
1. Abra o site no **Chrome**
2. Toque nos **3 pontinhos** no canto superior direito
3. Selecione **"Adicionar à tela inicial"**
4. Confirme o nome **"G&H Doces"** e toque em **"Adicionar"**

---

## 🚀 Como Usar - Guia Rápido

### 1️⃣ Adicionar um Pedido
1. Preencha o nome do **cliente** e a **data**
2. Selecione os **produtos** (quantidade e preço)
3. Clique em **"Adicionar outro produto"** se necessário
4. Escolha o **status de pagamento**
5. Adicione **observações** (opcional)
6. Clique em **"Adicionar Encomenda"**

### 2️⃣ Alterar Status do Pedido
- **Status do Pedido:** Clique em "⏳ Pendente" alterna para "✅ Realizado"
- **Status de Entrega:** Clique para alternar: "🟡 Preparando" → "🚚 Pronto" → "✔️ Entregue"
- **Status de Pagamento:** Clique para alternar: "💰 Pendente" → "✅ Pago" → "💳 Parcial"

### 3️⃣ Registrar Gastos
1. Vá para a aba **"Financeiro"**
2. Preencha data, valor, categoria, local e descrição
3. Clique em **"Adicionar Gasto"**

### 4️⃣ Exportar Relatórios
- **Relatório de Pedidos:** Clique em "Exportar relatório" na aba Pedidos
- **Relatório Financeiro:** Clique em "Exportar relatório financeiro" na aba Financeiro

### 5️⃣ Backup e Restauração
- **Fazer Backup:** Clique em "Fazer backup" na aba Admin
- **Restaurar Backup:** Clique em "Restaurar backup" e selecione o arquivo

---

## 🔧 Configuração para Desenvolvimento

### Pré-requisitos
- Conta no [Firebase](https://console.firebase.google.com)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/gh-doces.git
cd gh-doces
```

2. **Crie um projeto no Firebase**
   - Acesse [console.firebase.google.com](https://console.firebase.google.com)
   - Crie um novo projeto
   - Ative o **Firestore Database**

3. **Configure as regras do Firestore**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

4. **Adicione suas credenciais no `index.html`**

5. **Hospede no Netlify**
   - Crie uma conta em [netlify.com](https://netlify.com)
   - Arraste a pasta do projeto
   - O link será gerado automaticamente

---

## 📊 Demonstração das Telas

### 📋 Aba de Pedidos
- Formulário para criar pedidos com múltiplos produtos
- Filtros rápidos por status
- Lista de pedidos com ações integradas
- Painel de controle com estatísticas

### 💰 Aba Financeira
- Gráfico de ganhos mensais
- Resumo de receitas vs despesas
- Cálculo automático de lucro/prejuízo
- Registro e histórico de gastos

### ⚙️ Aba Admin
- Gerenciamento de preços dos produtos
- Link de compartilhamento do sistema
- Backup e restauração de dados

---

## 👩‍🍳 Sobre a G&H Doces

**G&H Doces** é uma doceria artesanal que nasceu do amor de um casal que decidiu transformar sonhos em realidade através dos doces.

Cada encomenda é feita com carinho e dedicação, levando sabor e alegria para a vida dos nossos clientes.

**Amor em formato de doces** ❤️🍬

---

## 📷 Redes Sociais

📱 **Instagram:** [@ghdoces.pe](https://instagram.com/ghdoces.pe)

---

## ⭐ Agradecimento

A todos os clientes que confiam e apoiam nosso sonho todos os dias. 💕

---

<p align="center">
  Feito com ❤️ e muito açúcar pela G&H Doces
</p>

<p align="center">
  <strong>G&H Doces - Amor em formato de doces 🍬</strong>
</p>
```

---
