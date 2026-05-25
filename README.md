---

## 📄 Arquivo: `README.md`

```markdown
# 🍬 G&H Doces - Sistema de Gestão de Encomendas

![Status](https://img.shields.io/badge/status-produção-brightgreen)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat&logo=netlify&logoColor=white)

## 📖 Sobre o Projeto

**G&H Doces** é um sistema completo de gestão de pedidos desenvolvido especialmente para a doceria **G&H Doces - Amor em formato de doces**. O sistema foi criado para facilitar o dia a dia da doceria, permitindo gerenciar encomendas, controlar finanças, registrar gastos e acompanhar vendas em tempo real.

### ✨ Funcionalidades Principais

| Funcionalidade | Descrição |
|----------------|-----------|
| 📝 **Pedidos Multi-produto** | Adicione múltiplos produtos no mesmo pedido com quantidades e preços personalizados |
| 💰 **Preços Variáveis** | Defina preços personalizados por produto ou use os preços padrão |
| 🎉 **Promoções Automáticas** | Detecta automaticamente promoções (ex: 3 Pavês por R$20,00) |
| 📊 **Dashboard Financeiro** | Gráficos de ganhos mensais e controle de lucro/prejuízo |
| 💸 **Controle de Gastos** | Registre gastos por categoria, local e descrição |
| 🔄 **Sincronização em Tempo Real** | Dados compartilhados entre todos os usuários via Firebase |
| 📱 **PWA Installável** | Instale como aplicativo no celular |
| 💾 **Backup e Restauração** | Exporte e importe dados em JSON |
| 📥 **Exportação de Relatórios** | Gere relatórios detalhados em TXT |

---

## 🚀 Demonstração Online

🔗 **Acesse o sistema:** [https://gehdoces-97753.netlify.app](https://gehdoces-97753.netlify.app)

> ⚠️ **Nota:** O sistema está em modo de teste. Para uso comercial, recomenda-se implementar autenticação.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|------------|--------|-------------|
| **HTML5** | - | Estrutura da aplicação |
| **CSS3** | - | Estilização e responsividade |
| **JavaScript** | ES6+ | Lógica e interatividade |
| **Firebase Firestore** | 10.8.0 | Banco de dados em tempo real |
| **Chart.js** | 4.4.0 | Gráficos financeiros |

---

## 📁 Estrutura do Projeto

```
gh-doces/
├── index.html          # Estrutura principal da aplicação
├── style.css           # Estilos e responsividade
├── script.js           # Lógica e integração com Firebase
├── manifest.json       # Configuração PWA (instalação)
└── README.md           # Documentação
```

---

## 🗄️ Estrutura do Banco de Dados (Firestore)

### Coleção: `orders`
```json
{
  "cliente": "Nome do cliente",
  "data": "2024-01-15",
  "diaSemana": "Segunda",
  "produtos": [
    { "nome": "Pavê", "quantidade": 2, "preco": 8.00 },
    { "nome": "Torta de Limão", "quantidade": 1, "preco": 7.00 }
  ],
  "total": 23.00,
  "isPromocao": false,
  "statusPedido": "pendente|realizado",
  "statusEntrega": "preparando|pronto|entregue",
  "statusPagamento": "pendente|pago|parcial",
  "observacoes": "Instruções especiais",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Coleção: `gastos`
```json
{
  "data": "2024-01-15",
  "valor": 45.90,
  "categoria": "Ingredientes",
  "local": "Supermercado",
  "descricao": "Compra de farinha e ovos",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Coleção: `configuracoes/precos`
```json
{
  "Maracujá Trufado": 8.00,
  "Pavê": 8.00,
  "Torta de Limão": 7.00,
  "Marido Gelado": 6.00
}
```
---

## 🎨 Paleta de Cores da Marca

| Cor | Código | Uso |
|-----|--------|-----|
| Rosa Fundo | `#FFF0F3` | Background da página |
| Rosa Doce | `#FFB7C5` | Detalhes e hover |
| Vermelho Amor | `#E63946` | Botões principais e cabeçalho |
| Vermelho Escuro | `#C1121F` | Botão "Adicionar" |
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
   - Para produtos personalizados, escolha a opção "Personalizado"
3. Clique em **"Adicionar outro produto"** se necessário
4. Escolha o **status de pagamento** (Pendente, Pago, Parcial)
5. Adicione **observações** (opcional - ex: "Entregar na esquina")
6. Clique em **"Adicionar Encomenda"**

### 2️⃣ Alterar Status do Pedido
- **Status do Pedido:** Clique em "⏳ Pendente" alterna para "✅ Realizado"
- **Status de Entrega:** Clique para alternar: "🟡 Preparando" → "🚚 Pronto" → "✔️ Entregue"
- **Status de Pagamento:** Clique para alternar: "💰 Pendente" → "✅ Pago" → "💳 Parcial"

### 3️⃣ Registrar Gastos (Controle Financeiro)
1. Vá para a aba **"Financeiro"**
2. Preencha:
   - **Data** do gasto
   - **Valor** (R$)
   - **Categoria** (Ingredientes, Embalagens, Divulgação, etc.)
   - **Local/Onde** foi comprado
   - **Descrição** do gasto
3. Clique em **"Adicionar Gasto"**

### 4️⃣ Gerenciar Preços dos Produtos
1. Vá para a aba **"Admin"**
2. Altere os preços padrão dos produtos
3. Clique em **"Salvar"** ao lado de cada produto
4. Os novos preços serão aplicados automaticamente nos próximos pedidos

### 5️⃣ Exportar Relatórios
- **Relatório de Pedidos:** Clique em "Exportar relatório" na aba Pedidos
- **Relatório Financeiro:** Clique em "Exportar relatório financeiro" na aba Financeiro

### 6️⃣ Backup e Restauração
- **Fazer Backup:** Clique em "Fazer backup" na aba Admin - baixa um arquivo .json
- **Restaurar Backup:** Clique em "Restaurar backup" e selecione o arquivo .json

---

## 📊 Demonstração das Telas

### 📋 Aba de Pedidos
- Formulário completo para criar pedidos com múltiplos produtos
- Filtros rápidos por status (Todos, Pendentes, Realizados, Prontos, Não pagos, Pagos)
- Lista de pedidos com ações integradas (alterar status, excluir)
- Painel de controle com estatísticas em tempo real

### 💰 Aba Financeira
- Gráfico de ganhos mensais (últimos 6 meses)
- Resumo de receitas vs despesas do mês atual
- Cálculo automático de lucro/prejuízo com sinalização visual
- Registro e histórico completo de gastos
- Exportação de relatório financeiro

### ⚙️ Aba Admin
- Gerenciamento de preços dos produtos (atualização em tempo real)
- Link de compartilhamento do sistema (copiar)
- Backup e restauração de todos os dados
- Status da conexão com o banco de dados

---

## 🤝 Como Contribuir

Contribuições são bem-vindas! Siga os passos:

1. Faça um **Fork** do projeto
2. Crie uma **branch** para sua feature 
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
3. **Commit** suas mudanças 
   ```bash
   git commit -m 'Adiciona nova funcionalidade'
   ```
4. **Push** para a branch 
   ```bash
   git push origin feature/nova-funcionalidade
   ```
5. Abra um **Pull Request**

---

## 🐛 Reportar Problemas

Encontrou um bug? Abra uma [issue](https://github.com/seu-usuario/gh-doces/issues) descrevendo:
- O que aconteceu
- Como reproduzir o erro
- O que era esperado acontecer
- Print da tela (se possível)

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais informações.

---

## 👩‍🍳 Sobre a G&H Doces

**G&H Doces** é uma doceria artesanal que nasceu do amor para realizar os sonho de um jovem casal

**Amor em formato de doces** ❤️🍬

---

## 📞 Contato

**G&H Doces**

- 📷 Instagram: @ghdoces.pe

---

## ⭐ Agradecimentos

- A todos os clientes que confiam e apoiam nosso sonho todos os dias ❤️
- **Firebase** pela infraestrutura gratuita e confiável
- **Netlify** pela hospedagem simples e eficiente
- **Chart.js** pela biblioteca de gráficos

---

<p align="center">
  Feito com ❤️ e muito açúcar para a G&H Doces
</p>

<p align="center">
  <strong>G&H Doces - Amor em formato de doces 🍬</strong>
</p>
```
---

## Extra

Ultilizei o banco de dados do Firebase e compartilhei o site no netlify
