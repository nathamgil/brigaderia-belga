/* Brigaderia Belga — site (demo Zync). Lê/grava em BELGA (assets/dados.js). */
(function () {
  const B = window.BELGA;
  let db = B.carregar();
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => [...(el || document).querySelectorAll(s)];
  const brl = B.brl;
  const on = (sel, ev, fn) => { const el = document.querySelector(sel); if (el) el.addEventListener(ev, fn); };
  const esc = (t) => String(t == null ? '' : t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
               set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };

  // origem do visitante: ?utm_source=meta&utm_campaign=... vira "anuncio" no painel
  const params = new URLSearchParams(location.search);
  let origem = { canal: 'site', campanha: '' };
  try { origem = JSON.parse(sessionStorage.getItem('belga-origem')) || origem; } catch (e) {}
  if (params.get('utm_source')) {
    const src = params.get('utm_source').toLowerCase();
    origem = { canal: /meta|facebook|instagram|ig|fb|google/.test(src) ? 'anuncio' : src, campanha: params.get('utm_campaign') || '' };
    try { sessionStorage.setItem('belga-origem', JSON.stringify(origem)); } catch (e) {}
  }

  let unidade = ls.get('belga-unidade', 'barra');
  let tamanho = 12;
  let escolha = {}; // saborId -> qtd
  let sacola = ls.get('belga-sacola', []);
  let abaEnc = 'tortas';

  const uni = (id) => db.unidades.find(u => u.id === id) || db.unidades[0];
  const zapDe = (id) => { const u = uni(id); return u.whatsapp || uni('barra').whatsapp; };
  const zapLink = (id, msg) => 'https://wa.me/' + zapDe(id) + '?text=' + encodeURIComponent(msg);

  function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), 2200); }

  /* ---------------- monte sua caixa ---------------- */
  const somaCaixa = () => Object.values(escolha).reduce((a, b) => a + b, 0);
  function renderTamanhos() {
    $('#tamanhos').innerHTML = db.caixas.map(n => `<button class="${n === tamanho ? 'on' : ''}" data-n="${n}">${n} un.<small>caixa</small></button>`).join('');
  }
  function renderSabores() {
    const cheia = somaCaixa() >= tamanho;
    $('#sabores').innerHTML = db.sabores.map(s => {
      const q = escolha[s.id] || 0;
      return `<div class="sabor ${q ? 'tem' : ''} ${s.ativo ? '' : 'esgotado'}">
        ${s.ativo ? '' : '<span class="pausado">Indisponível hoje</span>'}
        <img src="${s.foto}" alt="Brigadeiro ${esc(s.nome)}" loading="lazy">
        <h4>${esc(s.nome)}</h4><div class="pr">${brl(s.preco)} a unidade</div>
        <div class="qtd"><button class="menos" data-s="${s.id}" ${q ? '' : 'disabled'} aria-label="Tirar ${esc(s.nome)}">−</button><b>${q}</b>
        <button class="mais" data-s="${s.id}" ${!s.ativo || cheia ? 'disabled' : ''} aria-label="Pôr ${esc(s.nome)}">+</button></div>
      </div>`;
    }).join('');
  }
  function renderResumo() {
    const n = somaCaixa(), falta = tamanho - n;
    const linhas = Object.entries(escolha).filter(([, q]) => q).map(([id, q]) => { const s = db.sabores.find(x => x.id === id); return s ? `<li><span>${q}× ${esc(s.nome)}</span><span>${brl(q * s.preco)}</span></li>` : ''; }).join('');
    const total = valorCaixa();
    $('#resumoCaixa').innerHTML = `<span class="kicker" style="color:var(--limao)">Sua caixa</span>
      <h3>Caixa com ${tamanho}</h3>
      <div class="barra-prog"><i style="width:${Math.min(100, n / tamanho * 100)}%"></i></div>
      <div style="font-weight:700">${n} de ${tamanho} ${falta > 0 ? `· faltam ${falta}` : '· caixa completa ✓'}</div>
      <ul>${linhas || '<li style="opacity:.7;border:0">Toque no + dos sabores ao lado</li>'}</ul>
      <div class="total"><span>Total</span><b>${brl(total)}</b></div>
      <button class="btn b-limao" id="addCaixa" ${falta > 0 ? 'disabled style="opacity:.55;cursor:not-allowed"' : ''}>${falta > 0 ? `Escolha mais ${falta}` : 'Colocar caixa na sacola'}</button>
      ${falta > 0 && n > 0 ? '<button class="link-sortir" id="sortir">Completar com sortidos da casa</button>' : ''}
      ${n === 0 ? '<button class="link-sortir" id="sortir">Quero uma caixa sortida</button>' : ''}
      <p class="obs">Embalagem de presente e caixas fechadas: valores sob consulta na loja.</p>`;
  }
  function valorCaixa() { return Object.entries(escolha).reduce((a, [id, q]) => { const s = db.sabores.find(x => x.id === id); return a + (s ? s.preco * q : 0); }, 0); }
  function renderCaixa() { renderTamanhos(); renderSabores(); renderResumo(); }

  on('#tamanhos', 'click', e => {
    const b = e.target.closest('button'); if (!b) return;
    tamanho = +b.dataset.n;
    // se passou do novo tamanho, tira do fim
    let n = somaCaixa();
    for (const id of Object.keys(escolha).reverse()) { while (n > tamanho && escolha[id] > 0) { escolha[id]--; n--; } }
    renderCaixa();
  });
  on('#sabores', 'click', e => {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    const id = b.dataset.s;
    if (b.classList.contains('mais') && somaCaixa() < tamanho) escolha[id] = (escolha[id] || 0) + 1;
    if (b.classList.contains('menos') && escolha[id]) escolha[id]--;
    renderSabores(); renderResumo();
  });
  on('#resumoCaixa', 'click', e => {
    if (e.target.id === 'sortir') {
      const ativos = db.sabores.filter(s => s.ativo);
      let i = 0;
      while (somaCaixa() < tamanho && ativos.length) { const s = ativos[i % Math.min(ativos.length, 8)]; escolha[s.id] = (escolha[s.id] || 0) + 1; i++; }
      renderSabores(); renderResumo();
    }
    if (e.target.id === 'addCaixa' && somaCaixa() === tamanho) {
      const det = Object.entries(escolha).filter(([, q]) => q).map(([id, q]) => q + ' ' + db.sabores.find(x => x.id === id).nome).join(', ');
      const primeiro = db.sabores.find(s => escolha[s.id]);
      addSacola({ chave: 'caixa-' + Date.now(), tipo: 'caixa', nome: 'Caixa com ' + tamanho + ' brigadeiros', detalhe: det, preco: valorCaixa(), qtd: 1, foto: primeiro ? primeiro.foto : '' });
      escolha = {}; renderCaixa();
    }
  });

  /* ---------------- natal ---------------- */
  function renderNatal() {
    const ativos = db.natal.filter(p => p.ativo);
    const d = ativos.find(p => p.destaque) || ativos[0];
    $('#natalDestaque').innerHTML = d ? `<img src="${d.foto}" alt="${esc(d.nome)}">
      <div class="t"><span class="tag" style="background:#f8dfc9;color:var(--bordo)">Peça de centro</span><h3>${esc(d.nome)}</h3><p style="color:var(--cinza)">${esc(d.desc)}. Feita para ser o centro da mesa da ceia.</p>
      <div class="preco" style="font-size:30px;margin-top:auto">${brl(d.preco)}</div>
      <button class="btn b-bordo" data-add="natal:${d.id}">Encomendar a árvore</button></div>` : '';
    $('#gradeNatal').innerHTML = ativos.filter(p => p !== d).map(p => cardProduto(p, 'natal', 'Encomendar')).join('');
  }
  function cardProduto(p, grupo, rotulo) {
    return `<article class="card"><img class="foto" src="${p.foto}" alt="${esc(p.nome)}" loading="lazy">
      <div class="corpo"><h3>${esc(p.nome)}</h3><p>${esc(p.desc)}</p>
      <div class="rodape"><span class="preco">${brl(p.preco)}</span><button class="add" data-add="${grupo}:${p.id}">${rotulo || 'Adicionar'}</button></div></div></article>`;
  }

  /* ---------------- encomendas ---------------- */
  function renderEnc() {
    $$('#abasEnc button').forEach(b => b.classList.toggle('on', b.dataset.aba === abaEnc));
    if (abaEnc === 'tortas') {
      $('#gradeEnc').innerHTML = db.tortas.filter(t => t.ativo).map(t => {
        const tams = B.TAM.filter(k => t.precos[k]);
        const ini = t.precos.M ? 'M' : tams[0];
        return `<article class="card"><img class="foto" src="${t.foto}" alt="Torta ${esc(t.nome)}" loading="lazy">
          <div class="corpo"><h3>${esc(t.nome)}</h3><p>${esc(t.desc)}</p>
          <select class="sel-tam" data-torta="${t.id}" aria-label="Tamanho da torta ${esc(t.nome)}">${tams.map(k => `<option value="${k}" ${k === ini ? 'selected' : ''}>${k} · ${brl(t.precos[k])}</option>`).join('')}</select>
          <div class="rodape"><span class="preco" data-preco="${t.id}"><small>Tamanho ${ini}</small>${brl(t.precos[ini])}</span><button class="add" data-add="torta:${t.id}">Encomendar</button></div></div></article>`;
      }).join('');
    } else {
      $('#gradeEnc').innerHTML = db.doces.filter(p => p.ativo).map(p => cardProduto(p, 'doce')).join('');
    }
  }
  on('#abasEnc', 'click', e => { const b = e.target.closest('button'); if (b) { abaEnc = b.dataset.aba; renderEnc(); } });
  on('#gradeEnc', 'change', e => {
    const s = e.target.closest('select[data-torta]'); if (!s) return;
    const t = db.tortas.find(x => x.id === s.dataset.torta);
    $(`[data-preco="${t.id}"]`).innerHTML = `<small>Tamanho ${s.value}</small>${brl(t.precos[s.value])}`;
  });

  // botões "adicionar" de qualquer grade
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-add]'); if (!b) return;
    const [grupo, id] = b.dataset.add.split(':');
    if (grupo === 'natal') { const p = db.natal.find(x => x.id === id); addSacola({ chave: 'natal-' + id, tipo: 'natal', nome: p.nome, detalhe: p.desc, preco: p.preco, qtd: 1, foto: p.foto }); }
    if (grupo === 'doce') { const p = db.doces.find(x => x.id === id); addSacola({ chave: 'doce-' + id, tipo: 'encomenda', nome: p.nome, detalhe: p.desc, preco: p.preco, qtd: 1, foto: p.foto }); }
    if (grupo === 'torta') {
      const t = db.tortas.find(x => x.id === id); const tam = $(`select[data-torta="${id}"]`).value;
      addSacola({ chave: 'torta-' + id + '-' + tam, tipo: 'encomenda', nome: 'Torta ' + t.nome + ' · ' + tam, detalhe: t.desc, preco: t.precos[tam], qtd: 1, foto: t.foto });
    }
  });

  /* ---------------- vitrine da loja ---------------- */
  function renderVitrine() {
    $('#vitrine').innerHTML = db.loja.map(p => `<figure class="vit"><img src="${p.foto}" alt="${esc(p.nome)}" loading="lazy"><figcaption class="lg"><i>${brl(p.preco)}</i><b>${esc(p.nome)}</b><span>${esc(p.desc)}</span></figcaption></figure>`).join('');
  }

  /* ---------------- unidades ---------------- */
  function renderLojas() {
    const z = $('#zapFlut'); if (z) z.href = zapLink(unidade, 'Olá! Vim pelo site da Belga e quero fazer um pedido.');
    const sel = $('#evUnid'); if (sel) sel.innerHTML = db.unidades.filter(x => x.retirada).map(x => `<option value="${x.id}" ${x.id === unidade ? 'selected' : ''}>${esc(x.nome)}</option>`).join('');
    if (!$('#listaLojas')) return;
    $('#listaLojas').innerHTML = db.unidades.map(u => `<button class="loja-item ${u.id === unidade ? 'on' : ''}" data-u="${u.id}">
      <b>${esc(u.nome)}</b><span>${esc(u.cidade)}</span><span>${esc(u.endereco)}</span><span>${esc(u.horario)}</span>
      <span class="acoes">${u.whatsapp ? `<a class="btn b-verde" href="${zapLink(u.id, 'Olá! Vim pelo site da Belga.')}" target="_blank" rel="noopener">WhatsApp ${esc(u.fone)}</a>` : ''}${u.ifood ? `<a class="btn b-borda" href="${u.ifood}" target="_blank" rel="noopener">Pedir no iFood</a>` : ''}</span></button>`).join('');
    const u = uni(unidade);
    $('#mapa').innerHTML = u.mapa ? `<iframe title="Mapa da unidade ${esc(u.nome)}" loading="lazy" src="https://www.google.com/maps?q=${encodeURIComponent(u.mapa)}&output=embed"></iframe>`
      : `<div style="padding:30px">📍 Endereço da unidade ${esc(u.nome)} a confirmar.<br><span style="font-weight:600">Por enquanto, os pedidos dessa unidade são pelo iFood.</span></div>`;
  }
  on('#listaLojas', 'click', e => {
    if (e.target.closest('a')) return;
    const b = e.target.closest('[data-u]'); if (!b) return;
    unidade = b.dataset.u; ls.set('belga-unidade', unidade); renderLojas();
  });

  /* ---------------- sacola ---------------- */
  function salvarSacola() { ls.set('belga-sacola', sacola); $('#nSacola').textContent = sacola.reduce((a, i) => a + i.qtd, 0); }
  function addSacola(item) {
    const ex = sacola.find(i => i.chave === item.chave && item.tipo !== 'caixa');
    if (ex) ex.qtd++; else sacola.push(item);
    salvarSacola(); toast('✓ ' + item.nome + ' na sacola');
  }
  const totalSacola = () => sacola.reduce((a, i) => a + i.preco * i.qtd, 0);
  function abrirGaveta() { $('#veu').hidden = false; $('#gaveta').hidden = false; document.body.style.overflow = 'hidden'; }
  function fecharGaveta() { $('#veu').hidden = true; $('#gaveta').hidden = true; document.body.style.overflow = ''; }
  function renderSacola() {
    $('#gavTitulo').textContent = 'Sua sacola';
    if (!sacola.length) {
      $('#gavMiolo').innerHTML = `<div class="vazio"><b>Sacola vazia</b>Monte uma caixa de brigadeiros ou escolha algo do Natal à Mesa.</div>`;
      $('#gavPe').innerHTML = `<a class="btn b-verde" style="width:100%" href="#caixa" id="irCaixa">Montar minha caixa</a>`;
      return;
    }
    $('#gavMiolo').innerHTML = sacola.map((i, n) => `<div class="it-sac">${i.foto ? `<img src="${i.foto}" alt="">` : ''}
      <div class="n"><b>${esc(i.nome)}</b>${i.detalhe ? `<small>${esc(i.detalhe)}</small>` : ''}
      <div class="q"><button data-q="-1" data-i="${n}" aria-label="Menos">−</button><span>${i.qtd}</span><button data-q="1" data-i="${n}" aria-label="Mais">+</button></div></div>
      <div class="v">${brl(i.preco * i.qtd)}</div></div>`).join('');
    $('#gavPe').innerHTML = `<div class="tot"><span>Total</span><span>${brl(totalSacola())}</span></div><button class="btn b-verde" style="width:100%" id="irCheckout">Escolher retirada e data</button>`;
  }
  function minData() { return B.dia(db.prazoEncomenda || 2); }
  function renderCheckout() {
    $('#gavTitulo').textContent = 'Retirada e contato';
    const uns = db.unidades.filter(u => u.retirada);
    $('#gavMiolo').innerHTML = `<form id="formPedido" class="campos" style="grid-template-columns:1fr">
      <div class="campo"><label>Como você quer receber?</label><div class="modo">
        <label><input type="radio" name="modo" value="retirada" checked>Retirar na loja</label>
        <label><input type="radio" name="modo" value="entrega">Entrega combinada</label></div></div>
      <div class="campo"><label for="pUni">Unidade</label><select id="pUni">${uns.map(u => `<option value="${u.id}" ${u.id === unidade ? 'selected' : ''}>${esc(u.nome)} · ${esc(u.cidade)}</option>`).join('')}</select></div>
      <div class="campos"><div class="campo"><label for="pData">Dia</label><input id="pData" type="date" min="${minData()}" value="${minData()}" required></div>
      <div class="campo"><label for="pHora">Horário</label><select id="pHora">${['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map(h => `<option>${h}</option>`).join('')}</select></div></div>
      <div class="campo"><label for="pNome">Seu nome</label><input id="pNome" required autocomplete="name"></div>
      <div class="campo"><label for="pTel">WhatsApp</label><input id="pTel" type="tel" inputmode="tel" required placeholder="(71) 9 0000-0000" autocomplete="tel"></div>
      <div class="campo" id="pEndCampo" hidden><label for="pEnd">Endereço de entrega</label><input id="pEnd" placeholder="Rua, número, bairro"></div>
      <div class="campo"><label for="pAniv">Seu aniversário (opcional)</label><input id="pAniv" placeholder="dd/mm" maxlength="5" inputmode="numeric"><small style="color:var(--cinza)">Para receber um mimo da Belga no seu dia.</small></div>
      <div class="campo"><label for="pObs">Observação</label><textarea id="pObs" rows="2" placeholder="Ex.: escrever 'Feliz Natal' no cartão"></textarea></div>
      <p style="font-size:13px;color:var(--cinza)">Encomendas com ${db.prazoEncomenda || 2} dias de antecedência. O pagamento é combinado no WhatsApp.</p>
    </form>`;
    $('#gavPe').innerHTML = `<div class="tot"><span>Total</span><span>${brl(totalSacola())}</span></div>
      <div style="display:flex;gap:8px"><button class="btn b-borda" id="voltarSacola">Voltar</button><button class="btn b-verde" style="flex:1" form="formPedido">Enviar pedido</button></div>`;
  }
  function upCliente(nome, tel, uni, aniv, valor) {
    const limpa = (t) => t.replace(/\D/g, '');
    let c = db.clientes.find(x => limpa(x.tel) === limpa(tel));
    if (!c) { c = { id: 'c' + (db.clientes.length + 1) + '-' + Date.now().toString(36), nome, tel, aniversario: '', unidade: uni, origem: origem.canal, pedidos: 0, total: 0, ultimo: B.hoje() }; db.clientes.unshift(c); }
    if (aniv && /^\d{2}\/\d{2}$/.test(aniv)) { const [d, m] = aniv.split('/'); c.aniversario = m + '-' + d; }
    c.pedidos++; c.total += valor; c.ultimo = B.hoje();
  }
  function registraLead(nome, tel, interesse, valor) {
    if (origem.canal !== 'anuncio') return;
    db.leads.unshift({ quando: B.hoje() + ' ' + new Date().toTimeString().slice(0, 5), nome, tel, campanha: origem.campanha || 'Campanha (UTM)', anuncio: '—', interesse, status: valor ? 'virou pedido' : 'novo', valor: valor || 0 });
  }
  function enviarPedido(e) {
    e.preventDefault();
    const modo = $('input[name=modo]:checked').value, uid = $('#pUni').value, data = $('#pData').value, hora = $('#pHora').value;
    const nome = $('#pNome').value.trim(), tel = $('#pTel').value.trim(), obs = $('#pObs').value.trim(), end = $('#pEnd').value.trim();
    const tipo = sacola.some(i => i.tipo === 'natal') ? 'natal' : sacola.some(i => i.tipo === 'encomenda') ? 'encomenda' : 'caixa';
    const total = totalSacola();
    const ped = { id: B.proxId(db.pedidos, 'P'), tipo, cliente: nome, tel, unidade: uid, modo, data, hora, status: 'novo', origem: origem.canal, campanha: origem.campanha,
      itens: sacola.map(i => ({ nome: i.nome, qtd: i.qtd, preco: i.preco, detalhe: i.detalhe })), obs: [obs, end && 'Entrega: ' + end].filter(Boolean).join(' · '), criado: B.hoje() };
    db.pedidos.unshift(ped);
    upCliente(nome, tel, uid, $('#pAniv').value.trim(), total);
    registraLead(nome, tel, sacola.map(i => i.nome).join(', '), total);
    B.salvar(db);
    const u = uni(uid);
    const msg = `Olá, Belga! Pedido ${ped.id} pelo site 🍫\n\n` + sacola.map(i => `• ${i.qtd}× ${i.nome}${i.tipo === 'caixa' ? ' (' + i.detalhe + ')' : ''} · ${brl(i.preco * i.qtd)}`).join('\n') +
      `\n\nTotal: ${brl(total)}\n${modo === 'retirada' ? 'Retirada na loja ' + u.nome : 'Entrega: ' + (end || 'a combinar')}\nDia ${B.dataBR(data)} às ${hora}\nNome: ${nome}${obs ? '\nObs.: ' + obs : ''}`;
    sacola = []; salvarSacola();
    $('#gavTitulo').textContent = 'Pedido registrado';
    $('#gavMiolo').innerHTML = `<div class="ok-pedido"><div class="sel">✓</div><h3>Pedido ${ped.id} anotado</h3>
      <p style="color:var(--cinza)">Ele já aparece no painel da loja. Para confirmar e combinar o pagamento, envie a mensagem abaixo no WhatsApp${u.whatsapp ? '' : ' (na demo, vai para o WhatsApp do Barra)'}.</p><pre>${esc(msg)}</pre></div>`;
    $('#gavPe').innerHTML = `<a class="btn b-verde" style="width:100%" href="${zapLink(uid, msg)}" target="_blank" rel="noopener">Enviar no WhatsApp</a>`;
  }

  on('#abrirSacola', 'click', () => { renderSacola(); abrirGaveta(); });
  on('#fecharSacola', 'click', fecharGaveta);
  on('#veu', 'click', fecharGaveta);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharGaveta(); });
  on('#gaveta', 'click', e => {
    const q = e.target.closest('[data-q]');
    if (q) { const i = sacola[+q.dataset.i]; i.qtd += +q.dataset.q; if (i.qtd <= 0) sacola.splice(+q.dataset.i, 1); salvarSacola(); renderSacola(); }
    if (e.target.id === 'irCheckout') renderCheckout();
    if (e.target.id === 'voltarSacola') renderSacola();
    if (e.target.id === 'irCaixa') fecharGaveta();
  });
  on('#gaveta', 'change', e => { if (e.target.name === 'modo') $('#pEndCampo').hidden = e.target.value !== 'entrega'; });
  on('#gaveta', 'submit', e => { if (e.target.id === 'formPedido') enviarPedido(e); });

  /* ---------------- orçamento de evento ---------------- */
  const evTipo = $('#evTipo') || { value: '', addEventListener() {} };
  function ajustaEvento() {
    if (!$('#evEmpresaCampo')) return;
    const corp = /empresa|fim de ano/i.test(evTipo.value);
    $('#evEmpresaCampo').hidden = !corp;
    $('#evQtdLabel').textContent = corp ? 'Quantidade (pessoas ou caixas)' : 'Convidados (aprox.)';
  }
  evTipo.addEventListener('change', ajustaEvento);
  if ($('#evData')) $('#evData').min = B.dia(3);
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-tipo]'); if (!a) return;
    if (!$('#formEvento')) return;
    evTipo.value = a.dataset.tipo; ajustaEvento();
    const cx = $('#evItens input[value="Caixas de presente"]'); if (cx) cx.checked = true;
  });
  on('#formEvento', 'submit', e => {
    e.preventDefault();
    const itens = $$('#evItens input:checked').map(i => i.value);
    const o = { id: B.proxId(db.orcamentos, 'O'), tipo: evTipo.value, data: $('#evData').value, qtd: +$('#evQtd').value, nome: $('#evNome').value.trim(), empresa: $('#evEmpresa').value.trim(),
      tel: $('#evTel').value.trim(), unidade: $('#evUnid').value, itens, obs: $('#evObs').value.trim(), status: 'novo', valor: 0, origem: origem.canal, campanha: origem.campanha, criado: B.hoje() };
    db.orcamentos.unshift(o);
    registraLead(o.nome, o.tel, o.tipo + ' · ' + o.qtd, 0);
    B.salvar(db);
    const msg = `Olá, Belga! Quero um orçamento (${o.id}) 🍫\n\nEvento: ${o.tipo}${o.empresa ? ' · ' + o.empresa : ''}\nData: ${B.dataBR(o.data)}\nQuantidade: ${o.qtd}\nInteresse: ${itens.join(', ') || 'a definir'}\nNome: ${o.nome}${o.obs ? '\nDetalhes: ' + o.obs : ''}`;
    $('#gavTitulo').textContent = 'Orçamento enviado';
    $('#gavMiolo').innerHTML = `<div class="ok-pedido"><div class="sel">✓</div><h3>Pedido de orçamento ${o.id}</h3><p style="color:var(--cinza)">A equipe já vê o seu pedido no painel. Para agilizar, mande a mensagem no WhatsApp:</p><pre>${esc(msg)}</pre></div>`;
    $('#gavPe').innerHTML = `<a class="btn b-verde" style="width:100%" href="${zapLink(o.unidade, msg)}" target="_blank" rel="noopener">Enviar no WhatsApp</a>`;
    abrirGaveta(); e.target.reset(); ajustaEvento();
  });

  /* ---------------- menu mobile ---------------- */
  on('#hamb', 'click', () => $('#menu').classList.toggle('aberto'));
  on('#menu', 'click', e => { if (e.target.closest('a')) $('#menu').classList.remove('aberto'); });

  function tudo() {
    if ($('#sabores')) renderCaixa();
    if ($('#gradeNatal')) renderNatal();
    if ($('#gradeEnc')) renderEnc();
    if ($('#vitrine')) renderVitrine();
    renderLojas(); salvarSacola();
    // página de empresas: já abre com o formulário no modo corporativo
    if (document.body.dataset.pagina === 'empresas' && $('#evTipo') && !evTipo.value) { evTipo.value = 'Presente de fim de ano'; ajustaEvento(); }
  }
  tudo();
  // o painel mudou algo em outra aba (sabor pausado, preço): atualiza
  window.addEventListener('storage', e => { if (e.key === 'belga-v1') { db = B.carregar(); tudo(); } });
})();
