// ========== VARIÁVEIS GLOBAIS ==========
let orders = [];
let gastos = [];
let currentFilter = 'all';
let currentGastoFilter = 'all';
let ganhosChart = null;
let produtosPrecos = {};

// Produtos base
const produtosBase = ['Maracujá Trufado', 'Pavê', 'Torta de Limão', 'Marido Gelado'];

// ========== FUNÇÕES AUXILIARES ==========
function getDiaSemana(data) {
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return dias[new Date(data).getDay()];
}

function calcularTotalProdutos(produtos) {
    let total = 0;
    produtos.forEach(p => {
        total += p.preco * p.quantidade;
    });
    return total;
}

function isPromocao(produtos) {
    // Verifica se tem 3 ou mais do mesmo produto com preço padrão
    for (const produto of produtos) {
        const precoPadrao = produtosPrecos[produto.nome];
        if (precoPadrao && (produto.nome === 'Pavê' || produto.nome === 'Maracujá Trufado')) {
            if (produto.quantidade >= 3 && produto.preco === precoPadrao) {
                return true;
            }
        }
    }
    return false;
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27AE60' : type === 'warning' ? '#E63946' : '#2B2D42'};
        color: white;
        padding: 12px 24px;
        border-radius: 10px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// ========== GERENCIAR PREÇOS ==========
function carregarPrecosFirebase() {
    db.collection('configuracoes').doc('precos').onSnapshot((doc) => {
        if (doc.exists) {
            produtosPrecos = doc.data();
        } else {
            // Preços padrão
            produtosPrecos = {
                'Maracujá Trufado': 8.00,
                'Pavê': 8.00,
                'Torta de Limão': 7.00,
                'Marido Gelado': 6.00
            };
            salvarPrecosFirebase();
        }
        
        // Atualizar campos de preço na interface
        document.getElementById('preco_maracuja').value = produtosPrecos['Maracujá Trufado'] || 8.00;
        document.getElementById('preco_pave').value = produtosPrecos['Pavê'] || 8.00;
        document.getElementById('preco_torta').value = produtosPrecos['Torta de Limão'] || 7.00;
        document.getElementById('preco_marido').value = produtosPrecos['Marido Gelado'] || 6.00;
        
        // Atualizar preview de preços nos selects
        atualizarPrecosNosSelects();
    });
}

function salvarPrecosFirebase() {
    db.collection('configuracoes').doc('precos').set(produtosPrecos);
}

async function salvarPrecoProduto(produto, preco) {
    produtosPrecos[produto] = parseFloat(preco);
    await db.collection('configuracoes').doc('precos').set(produtosPrecos);
    showNotification(`Preço do ${produto} atualizado!`, 'success');
    atualizarPrecosNosSelects();
}

function atualizarPrecosNosSelects() {
    const selects = document.querySelectorAll('.produto-nome');
    selects.forEach(select => {
        const options = select.querySelectorAll('option');
        options.forEach(option => {
            if (option.value !== '' && option.value !== 'Personalizado') {
                const preco = produtosPrecos[option.value];
                if (preco) {
                    option.text = `${option.value} - R$ ${preco.toFixed(2)}`;
                }
            }
        });
    });
}

// ========== FUNÇÕES DO FIRESTORE ==========
function carregarPedidosRealtime() {
    db.collection('orders').orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
        orders = [];
        snapshot.forEach(doc => {
            orders.push({ 
                firebaseId: doc.id, 
                ...doc.data() 
            });
        });
        renderOrders();
        atualizarGrafico();
        atualizarEstatisticasPedidos();
    }, (error) => {
        console.error('Erro ao carregar pedidos:', error);
    });
}

function carregarGastosRealtime() {
    db.collection('gastos').orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
        gastos = [];
        snapshot.forEach(doc => {
            gastos.push({ firebaseId: doc.id, ...doc.data() });
        });
        renderGastos();
        atualizarGrafico();
    });
}

function addOrder(cliente, data, produtos, statusPagamento, observacoes) {
    const total = calcularTotalProdutos(produtos);
    const temPromocao = isPromocao(produtos);
    
    const order = {
        cliente: cliente,
        data: data,
        diaSemana: getDiaSemana(data),
        produtos: produtos,
        total: total,
        isPromocao: temPromocao,
        statusPedido: 'pendente',
        statusEntrega: 'preparando',
        statusPagamento: statusPagamento,
        observacoes: observacoes || '',
        createdAt: new Date().toISOString()
    };
    
    db.collection('orders').add(order)
        .then(() => showNotification('Pedido adicionado com sucesso!', 'success'))
        .catch(error => {
            console.error('Erro ao adicionar pedido:', error);
            showNotification('Erro ao adicionar pedido!', 'warning');
        });
}

function deleteOrder(firebaseId) {
    if (confirm('❌ Tem certeza que deseja excluir este pedido?')) {
        db.collection('orders').doc(firebaseId).delete()
            .then(() => showNotification('Pedido excluído!', 'success'))
            .catch(error => showNotification('Erro ao excluir!', 'warning'));
    }
}

function deleteAllOrders() {
    if (confirm('⚠️ EXCLUIR TODOS OS PEDIDOS?')) {
        db.collection('orders').get().then(snapshot => {
            const batch = db.batch();
            snapshot.forEach(doc => batch.delete(doc.ref));
            batch.commit().then(() => showNotification('Todos pedidos excluídos!', 'success'));
        });
    }
}

function marcarTodosPagos() {
    if (confirm('✅ Marcar TODOS como pagos?')) {
        db.collection('orders').get().then(snapshot => {
            const batch = db.batch();
            snapshot.forEach(doc => batch.update(doc.ref, { statusPagamento: 'pago' }));
            batch.commit().then(() => showNotification('Todos marcados como pagos!', 'success'));
        });
    }
}

function toggleStatusPedido(firebaseId) {
    const order = orders.find(o => o.firebaseId === firebaseId);
    if (order) {
        const novoStatus = order.statusPedido === 'pendente' ? 'realizado' : 'pendente';
        db.collection('orders').doc(firebaseId).update({ statusPedido: novoStatus });
    }
}

function toggleStatusEntrega(firebaseId, currentStatus) {
    const statusMap = { 'preparando': 'pronto', 'pronto': 'entregue', 'entregue': 'preparando' };
    db.collection('orders').doc(firebaseId).update({ statusEntrega: statusMap[currentStatus] });
}

function toggleStatusPagamento(firebaseId, currentStatus) {
    const statusMap = { 'pendente': 'pago', 'pago': 'parcial', 'parcial': 'pendente' };
    db.collection('orders').doc(firebaseId).update({ statusPagamento: statusMap[currentStatus] });
}

function addGasto(data, valor, categoria, local, descricao) {
    const gasto = { data, valor: parseFloat(valor), categoria, local, descricao, createdAt: new Date().toISOString() };
    db.collection('gastos').add(gasto)
        .then(() => showNotification('Gasto registrado!', 'success'))
        .catch(error => showNotification('Erro ao registrar gasto!', 'warning'));
}

function deleteGasto(firebaseId) {
    if (confirm('❌ Excluir este gasto?')) {
        db.collection('gastos').doc(firebaseId).delete()
            .then(() => showNotification('Gasto excluído!', 'success'));
    }
}

// FINANCEIRO 
function getGanhosPorMes() {
    const ganhosPorMes = {};
    orders.forEach(order => {
        if (order.statusPagamento === 'pago') {
            const mes = order.data.substring(0, 7);
            ganhosPorMes[mes] = (ganhosPorMes[mes] || 0) + order.total;
        }
    });
    return ganhosPorMes;
}

function getGastosPorMes() {
    const gastosPorMes = {};
    gastos.forEach(gasto => {
        const mes = gasto.data.substring(0, 7);
        gastosPorMes[mes] = (gastosPorMes[mes] || 0) + gasto.valor;
    });
    return gastosPorMes;
}

function atualizarGrafico() {
    const ganhosPorMes = getGanhosPorMes();
    const gastosPorMes = getGastosPorMes();
    
    const meses = [];
    const ganhosArray = [];
    const gastosArray = [];
    const lucrosArray = [];
    
    const hoje = new Date();
    for (let i = 5; i >= 0; i--) {
        const mes = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        const mesStr = `${mes.getFullYear()}-${String(mes.getMonth() + 1).padStart(2, '0')}`;
        const nomeMes = mes.toLocaleString('pt-BR', { month: 'short' }).replace('.', '') + `/${mes.getFullYear()}`;
        meses.push(nomeMes);
        
        ganhosArray.push(ganhosPorMes[mesStr] || 0);
        gastosArray.push(gastosPorMes[mesStr] || 0);
        lucrosArray.push((ganhosPorMes[mesStr] || 0) - (gastosPorMes[mesStr] || 0));
    }
    
    const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
    const receitaMes = ganhosPorMes[mesAtual] || 0;
    const despesasMes = gastosPorMes[mesAtual] || 0;
    const resultadoMes = receitaMes - despesasMes;
    
    document.getElementById('totalReceitaMes').textContent = `R$ ${receitaMes.toFixed(2)}`;
    document.getElementById('totalDespesasMes').textContent = `R$ ${despesasMes.toFixed(2)}`;
    document.getElementById('resultadoMes').textContent = `R$ ${Math.abs(resultadoMes).toFixed(2)}`;
    
    const resultadoStatus = document.getElementById('resultadoStatus');
    const lucroCard = document.getElementById('lucroCard');
    if (resultadoMes >= 0) {
        resultadoStatus.innerHTML = '✅ POSITIVO (Lucro)';
        lucroCard.classList.add('positivo');
        lucroCard.classList.remove('negativo');
    } else {
        resultadoStatus.innerHTML = '❌ NEGATIVO (Prejuízo)';
        lucroCard.classList.add('negativo');
        lucroCard.classList.remove('positivo');
    }
    
    const ctx = document.getElementById('ganhosChart');
    if (!ctx) return;
    if (ganhosChart) ganhosChart.destroy();
    
    ganhosChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: meses,
            datasets: [
                { label: '📥 Ganhos (R$)', data: ganhosArray, backgroundColor: '#27AE60', borderRadius: 8 },
                { label: '📤 Gastos (R$)', data: gastosArray, backgroundColor: '#E74C3C', borderRadius: 8 },
                { label: '📊 Lucro/Prejuízo', data: lucrosArray, backgroundColor: '#3498DB', borderRadius: 8 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: R$ ${ctx.raw.toFixed(2)}` } } },
            scales: { y: { beginAtZero: true, ticks: { callback: (v) => 'R$ ' + v.toFixed(2) } } }
        }
    });
}

function atualizarEstatisticasPedidos() {
    document.getElementById('totalPedidos').textContent = orders.length;
    document.getElementById('totalPendentes').textContent = orders.filter(o => o.statusPedido === 'pendente').length;
    document.getElementById('totalRealizados').textContent = orders.filter(o => o.statusPedido === 'realizado').length;
    document.getElementById('totalProntos').textContent = orders.filter(o => o.statusEntrega === 'pronto').length;
}

// RENDERIZAÇÃO
function renderOrders() {
    let filteredOrders = [...orders];
    switch(currentFilter) {
        case 'pendente': filteredOrders = orders.filter(o => o.statusPedido === 'pendente'); break;
        case 'realizado': filteredOrders = orders.filter(o => o.statusPedido === 'realizado'); break;
        case 'pronto': filteredOrders = orders.filter(o => o.statusEntrega === 'pronto'); break;
        case 'nao_pago': filteredOrders = orders.filter(o => o.statusPagamento === 'pendente'); break;
        case 'pago': filteredOrders = orders.filter(o => o.statusPagamento === 'pago'); break;
        default: filteredOrders = orders;
    }
    
    const tbody = document.getElementById('ordersList');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (filteredOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center;">📭 Nenhum pedido encontrado</td></tr>';
    } else {
        filteredOrders.forEach(order => {
            const tr = document.createElement('tr');
            
            const statusPedidoClass = order.statusPedido === 'realizado' ? 'realizado' : 'pendente';
            const statusPedidoText = order.statusPedido === 'realizado' ? '✅ Realizado' : '⏳ Pendente';
            
            let statusEntregaText = '', statusEntregaClass = '';
            if (order.statusEntrega === 'preparando') { statusEntregaText = '🟡 Preparando'; statusEntregaClass = 'preparando'; }
            else if (order.statusEntrega === 'pronto') { statusEntregaText = '🚚 Pronto entrega'; statusEntregaClass = 'pronto'; }
            else { statusEntregaText = '✔️ Entregue'; statusEntregaClass = 'entregue'; }
            
            let statusPagamentoText = '', statusPagamentoClass = '';
            if (order.statusPagamento === 'pago') { statusPagamentoText = '✅ Pago'; statusPagamentoClass = 'pago'; }
            else if (order.statusPagamento === 'pendente') { statusPagamentoText = '💰 Pendente'; statusPagamentoClass = 'pendente'; }
            else { statusPagamentoText = '💳 Parcial'; statusPagamentoClass = 'parcial'; }
            
            // Resumo dos produtos
            let produtosResumo = '';
            order.produtos.forEach(p => {
                produtosResumo += `<span>${p.quantidade}x ${p.nome} ${p.preco !== produtosPrecos[p.nome] ? `(R$ ${p.preco.toFixed(2)})` : ''}</span> `;
            });
            
            tr.innerHTML = `
                <td><span class="status-badge ${statusPedidoClass}" data-id="${order.firebaseId}">${statusPedidoText}</span></td>
                <td>${order.cliente}</td>
                <td>${order.data} (${order.diaSemana})</td>
                <td><div class="produto-resumo">${produtosResumo}</div></td>
                <td>R$ ${order.total.toFixed(2)}</td>
                <td><span class="pagamento-badge ${statusPagamentoClass}" data-id="${order.firebaseId}" data-status="${order.statusPagamento}">${statusPagamentoText}</span></td>
                <td><span class="status-entrega ${statusEntregaClass}" data-id="${order.firebaseId}" data-status="${order.statusEntrega}">${statusEntregaText}</span></td>
                <td>${order.observacoes || '-'}</td>
                <td><button class="delete-btn" data-id="${order.firebaseId}">🗑️</button></td>
            `;
            tbody.appendChild(tr);
        });
    }
    
    document.querySelectorAll('.status-badge').forEach(b => b.addEventListener('click', () => toggleStatusPedido(b.dataset.id)));
    document.querySelectorAll('.status-entrega').forEach(b => b.addEventListener('click', () => toggleStatusEntrega(b.dataset.id, b.dataset.status)));
    document.querySelectorAll('.pagamento-badge').forEach(b => b.addEventListener('click', () => toggleStatusPagamento(b.dataset.id, b.dataset.status)));
    document.querySelectorAll('.delete-btn').forEach(b => b.addEventListener('click', () => deleteOrder(b.dataset.id)));
}

function renderGastos() {
    let filteredGastos = [...gastos];
    const hoje = new Date();
    
    if (currentGastoFilter === 'mes') {
        const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
        filteredGastos = gastos.filter(g => g.data.substring(0, 7) === mesAtual);
    } else if (currentGastoFilter === 'ultimos3') {
        const tresMesesAtras = new Date(hoje.getFullYear(), hoje.getMonth() - 3, 1);
        filteredGastos = gastos.filter(g => new Date(g.data) >= tresMesesAtras);
    }
    
    const tbody = document.getElementById('gastosList');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (filteredGastos.length === 0) {
        tbody.innerHTML = '<td><td colspan="6" style="text-align: center;">📭 Nenhum gasto registrado</td></tr>';
    } else {
        filteredGastos.sort((a,b) => new Date(b.data) - new Date(a.data)).forEach(gasto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${gasto.data}</td><td>${gasto.categoria}</td><td>${gasto.local}</td>
                <td>${gasto.descricao}</td><td style="color:#E74C3C;">- R$ ${gasto.valor.toFixed(2)}</td>
                <td><button class="delete-gasto-btn" data-id="${gasto.firebaseId}">🗑️</button></td>
            `;
            tbody.appendChild(tr);
        });
    }
    document.querySelectorAll('.delete-gasto-btn').forEach(btn => btn.addEventListener('click', () => deleteGasto(btn.dataset.id)));
}

// FUNÇÕES DE MÚLTIPLOS PRODUTOS
let produtoCounter = 1;

function adicionarLinhaProduto() {
    const container = document.getElementById('produtosList');
    const newIndex = container.children.length;
    const newDiv = document.createElement('div');
    newDiv.className = 'produto-item';
    newDiv.setAttribute('data-index', newIndex);
    newDiv.innerHTML = `
        <div class="form-row">
            <select class="produto-nome" style="flex:2;" required>
                <option value="">Selecione...</option>
                <option value="Maracujá Trufado">Maracujá Trufado - R$ ${produtosPrecos['Maracujá Trufado'] || 8.00}</option>
                <option value="Pavê">Pavê - R$ ${produtosPrecos['Pavê'] || 8.00}</option>
                <option value="Torta de Limão">Torta de Limão - R$ ${produtosPrecos['Torta de Limão'] || 7.00}</option>
                <option value="Marido Gelado">Marido Gelado - R$ ${produtosPrecos['Marido Gelado'] || 6.00}</option>
                <option value="Personalizado">🎨 Personalizado (preço livre)</option>
            </select>
            <input type="number" class="produto-qtd" placeholder="Qtd" value="1" min="1" style="flex:1;">
            <input type="number" class="produto-preco" placeholder="Preço R$" step="0.01" style="flex:1;">
            <button type="button" class="btn-remover-produto" style="background:#c0392b; padding:8px 12px;">🗑️</button>
        </div>
    `;
    container.appendChild(newDiv);
    
    // Adicionar eventos
    newDiv.querySelector('.produto-nome').addEventListener('change', () => atualizarPreviewTotal());
    newDiv.querySelector('.produto-qtd').addEventListener('input', () => atualizarPreviewTotal());
    newDiv.querySelector('.produto-preco').addEventListener('input', () => atualizarPreviewTotal());
    newDiv.querySelector('.btn-remover-produto').addEventListener('click', () => newDiv.remove());
}

function atualizarPreviewTotal() {
    const produtos = coletarProdutosDoForm();
    const total = calcularTotalProdutos(produtos);
    document.getElementById('totalPedidoPreview').textContent = total.toFixed(2).replace('.', ',');
}

function coletarProdutosDoForm() {
    const produtos = [];
    const linhas = document.querySelectorAll('#produtosList .produto-item');
    
    linhas.forEach(linha => {
        const nomeSelect = linha.querySelector('.produto-nome');
        const qtdInput = linha.querySelector('.produto-qtd');
        const precoInput = linha.querySelector('.produto-preco');
        
        let nome = nomeSelect.value;
        let quantidade = parseInt(qtdInput.value) || 0;
        let preco = null;
        
        if (nome === 'Personalizado') {
            nome = precoInput.placeholder = 'Digite o nome do produto';
            preco = parseFloat(precoInput.value) || 0;
        } else if (nome) {
            preco = parseFloat(precoInput.value);
            if (isNaN(preco) || preco === 0) {
                preco = produtosPrecos[nome] || 0;
            }
        }
        
        if (nome && quantidade > 0 && preco > 0) {
            produtos.push({ nome, quantidade, preco });
        }
    });
    
    return produtos;
}

// BACKUP E EXPORTAÇÃO 
function fazerBackup() {
    const backup = { orders, gastos, dataBackup: new Date().toISOString() };
    const dataStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    const dataAtual = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    link.href = URL.createObjectURL(blob);
    link.download = `chen_backup_${dataAtual}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    showNotification('Backup realizado!', 'success');
}

function restaurarBackup() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const backup = JSON.parse(event.target.result);
                if (backup.orders && backup.gastos) {
                    const ordersSnapshot = await db.collection('orders').get();
                    const gastosSnapshot = await db.collection('gastos').get();
                    const batch = db.batch();
                    ordersSnapshot.forEach(doc => batch.delete(doc.ref));
                    gastosSnapshot.forEach(doc => batch.delete(doc.ref));
                    await batch.commit();
                    
                    for (const order of backup.orders) {
                        const { firebaseId, ...orderData } = order;
                        await db.collection('orders').add(orderData);
                    }
                    for (const gasto of backup.gastos) {
                        const { firebaseId, ...gastoData } = gasto;
                        await db.collection('gastos').add(gastoData);
                    }
                    showNotification('Backup restaurado!', 'success');
                } else {
                    showNotification('Arquivo inválido!', 'warning');
                }
            } catch (erro) {
                showNotification('Erro ao restaurar!', 'warning');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function exportarRelatorioFinanceiro() {
    let relatorio = 'RELATÓRIO FINANCEIRO C&H\n' + '='.repeat(60) + '\n\n';
    relatorio += `Data: ${new Date().toLocaleString()}\n\n`;
    relatorio += '📊 GANHOS POR MÊS:\n';
    const ganhosPorMes = getGanhosPorMes();
    for (const [mes, valor] of Object.entries(ganhosPorMes)) {
        relatorio += `   ${mes}: R$ ${valor.toFixed(2)}\n`;
    }
    relatorio += '\n📤 GASTOS POR MÊS:\n';
    const gastosPorMes = getGastosPorMes();
    for (const [mes, valor] of Object.entries(gastosPorMes)) {
        relatorio += `   ${mes}: R$ ${valor.toFixed(2)}\n`;
    }
    const blob = new Blob([relatorio], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_financeiro_${new Date().toISOString().slice(0,10)}.txt`;
    link.click();
    showNotification('Relatório exportado!', 'success');
}

function exportRelatorio() {
    let relatorio = 'RELATÓRIO C&H ENCOMENDAS\n' + '='.repeat(60) + '\n\n';
    relatorio += `Data: ${new Date().toLocaleString()}\nTotal: ${orders.length} pedidos\n\n`;
    orders.forEach((order, i) => {
        relatorio += `${i+1}. ${order.cliente} - ${order.data}\n`;
        order.produtos.forEach(p => {
            relatorio += `   ${p.quantidade}x ${p.nome} - R$ ${(p.preco * p.quantidade).toFixed(2)}\n`;
        });
        relatorio += `   Total: R$ ${order.total.toFixed(2)}\n   Status: ${order.statusPagamento}\n\n`;
    });
    const blob = new Blob([relatorio], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_chen_${new Date().toISOString().slice(0,10)}.txt`;
    link.click();
    showNotification('Relatório exportado!', 'success');
}

// INICIALIZAÇÃO 
document.addEventListener('DOMContentLoaded', () => {
    carregarPrecosFirebase();
    carregarPedidosRealtime();
    carregarGastosRealtime();
    
    document.getElementById('shareLink').value = window.location.href;
    
    // Abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
            if (btn.dataset.tab === 'financeiro') setTimeout(() => atualizarGrafico(), 100);
        });
    });
    
    // Formulário de pedido
    document.getElementById('orderForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const cliente = document.getElementById('cliente').value;
        const data = document.getElementById('data').value;
        const statusPagamento = document.getElementById('statusPagamento').value;
        const observacoes = document.getElementById('observacoes').value;
        const produtos = coletarProdutosDoForm();
        
        if (!cliente || !data || produtos.length === 0) {
            showNotification('Preencha cliente, data e pelo menos um produto!', 'warning');
            return;
        }
        
        addOrder(cliente, data, produtos, statusPagamento, observacoes);
        e.target.reset();
        document.getElementById('data').valueAsDate = new Date();
        document.getElementById('produtosList').innerHTML = '';
        adicionarLinhaProduto();
    });
    
    // Adicionar produto
    document.getElementById('addProdutoBtn').addEventListener('click', adicionarLinhaProduto);
    
    // Formulário de gasto
    document.getElementById('gastoForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addGasto(
            document.getElementById('gastoData').value,
            document.getElementById('gastoValor').value,
            document.getElementById('gastoCategoria').value,
            document.getElementById('gastoLocal').value,
            document.getElementById('gastoDescricao').value
        );
        e.target.reset();
        document.getElementById('gastoData').valueAsDate = new Date();
    });
    
    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderOrders();
        });
    });
    
    document.querySelectorAll('.filter-gasto-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-gasto-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentGastoFilter = btn.dataset.gastoFilter;
            renderGastos();
        });
    });
    
    // Botões
    document.getElementById('clearAllBtn').addEventListener('click', deleteAllOrders);
    document.getElementById('exportBtn').addEventListener('click', exportRelatorio);
    document.getElementById('marcarTodosPagosBtn').addEventListener('click', marcarTodosPagos);
    document.getElementById('exportFinanceiroBtn').addEventListener('click', exportarRelatorioFinanceiro);
    document.getElementById('backupBtn').addEventListener('click', fazerBackup);
    document.getElementById('restoreBtn').addEventListener('click', restaurarBackup);
    document.getElementById('copyLinkBtn').addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href);
        showNotification('Link copiado!', 'success');
    });
    
    // Salvar preços
    document.querySelectorAll('.btn-salvar-preco').forEach(btn => {
        btn.addEventListener('click', () => {
            const produto = btn.dataset.produto;
            let precoInput;
            if (produto === 'Maracujá Trufado') precoInput = document.getElementById('preco_maracuja');
            else if (produto === 'Pavê') precoInput = document.getElementById('preco_pave');
            else if (produto === 'Torta de Limão') precoInput = document.getElementById('preco_torta');
            else precoInput = document.getElementById('preco_marido');
            salvarPrecoProduto(produto, precoInput.value);
        });
    });
    
    // Datas padrão
    document.getElementById('data').valueAsDate = new Date();
    document.getElementById('gastoData').valueAsDate = new Date();
    
    // Linha inicial
    adicionarLinhaProduto();
});

const style = document.createElement('style');
style.textContent = `@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`;
document.head.appendChild(style);
