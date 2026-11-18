/* Brigaderia Belga — dados da demo (localStorage).
   Site e painel leem e gravam aqui: o que o gerente muda no painel aparece no
   site na hora (mesmo navegador).
   Preços, sabores e fotos: site oficial brigaderiabelga.com.br (18/11/2026).
   Pedidos, clientes, orçamentos e tráfego: EXEMPLOS da demo. */
(function () {
  const CHAVE = 'belga-v1';
  const IMG = (n) => 'assets/img/' + n + '.webp';

  const UNIDADES = [
    { id: 'barra', nome: 'Shopping Barra', cidade: 'Salvador', curta: 'Barra',
      endereco: 'Av. Centenário, 2992 · Shopping Barra, piso L3 Leste · Chame-Chame',
      horario: 'Seg a sáb, 9h às 22h · Dom, 13h às 21h',
      whatsapp: '5571996255021', fone: '(71) 99625-5021',
      ifood: 'https://www.ifood.com.br/delivery/salvador-ba/brigaderia-belga-barra/15ecb1f0-8a13-412c-9aeb-0851356e3ae4',
      mapa: 'Belga Brigaderia, Shopping Barra, Av. Centenário 2992, Salvador', retirada: true },
    { id: 'feira', nome: 'Feira de Santana', cidade: 'Feira de Santana', curta: 'Feira',
      endereco: 'Rua São João Batista, 200 · Santa Mônica',
      horario: 'Horário sob consulta',
      whatsapp: '', fone: 'WhatsApp a confirmar',
      ifood: '', mapa: 'Rua São João Batista, 200, Santa Mônica, Feira de Santana, BA', retirada: true },
    { id: 'pituba', nome: 'Pituba', cidade: 'Salvador', curta: 'Pituba',
      endereco: 'Endereço a confirmar · pedidos pelo iFood',
      horario: 'Horário do iFood',
      whatsapp: '', fone: '',
      ifood: 'https://www.ifood.com.br/delivery/salvador-ba/brigaderia-belga-pituba/2ce7372c-0874-4fb3-a2d1-ea082e6f2a47',
      mapa: '', retirada: false }
  ];

  // brigadeiros com foto no site oficial (página de encomendas de Salvador)
  const S = (id, nome, preco, desc) => ({ id, nome, preco, desc: desc || '', foto: IMG('b-' + id), ativo: true });
  const SABORES = [
    S('capim-santo', 'Capim Santo', 5.5),
    S('pistache', 'Pistache', 5.5, 'Pistache importado e toque de limão siciliano'),
    S('meio-amargo', 'Meio Amargo', 4.5, 'Chocolate meio amargo'),
    S('camafeu', 'Camafeu', 5.5),
    S('ferrero', 'Ferrero Rocher', 5.5),
    S('red-velvet', 'Red Velvet', 5.5, 'Com cream cheese'),
    S('beijinho', 'Beijinho', 4.5, 'Brigadeiro de coco'),
    S('prestigio', 'Prestígio', 4.5),
    S('lolo', 'Loló', 5.5),
    S('olho-sogra', 'Olho de Sogra', 5.5),
    S('melao', 'Melão', 5.5),
    S('floresta', 'Floresta Negra', 5.5),
    S('tiramisu', 'Tiramisù', 5.5),
    S('brulee', 'Brûlée', 5.5),
    S('casadinho', 'Casadinho', 4.5),
    S('maracuja', 'Maracujá', 5.5),
    S('limao', 'Limão', 4.5),
    S('morango', 'Morango', 5.5),
    S('cupuacu', 'Cupuaçu', 5.5),
    S('nozes', 'Nozes', 5.5),
    S('mirtilo', 'Mirtilo', 5.5),
    S('chocomenta', 'Chocomenta', 5.5),
    S('capim-limao', 'Capim Limão', 5.5),
    S('tangerina', 'Tangerina com Pimenta', 5.5),
    S('abacaxi-vinho', 'Abacaxi ao Vinho', 5.5),
    S('banana', 'Banana', 5.5),
    S('acai-ninho', 'Açaí com Ninho', 5.5),
    S('napolitano', 'Napolitano', 5.5),
    S('ninho-confete', 'Ninho com Confete', 5.5)
  ];

  const P = (id, nome, preco, foto, desc, extra) => Object.assign({ id, nome, preco, foto: IMG(foto), desc: desc || '', ativo: true }, extra || {});

  // Natal à Mesa — categoria real do site de encomendas
  const NATAL = [
    P('arvore-bombom', 'Árvore Bombom Cravejado Premium', 600, 'n-arvore-bombom', '25 cm de altura', { destaque: true }),
    P('arvore-crock', 'Árvore Crock Belga com especiarias', 300, 'n-arvore-crock', '25 cm de altura'),
    P('arvore-cupuacu', 'Árvore de Lascas de Cupuaçu', 300, 'n-arvore-cupuacu', '25 cm, lascas banhadas'),
    P('panetone-nutella', 'Panetone Trufado de Nutella', 110, 'n-panetone-nutella', '900 g'),
    P('panetone-morango', 'Panetone Trufado de Morango Cravejado', 120, 'n-panetone-morango', '900 g'),
    P('panetone-frutas', 'Panetone Trufado de Frutas', 100, 'n-panetone-frutas', '900 g'),
    P('vulcao-red', 'Bolo Vulcão Red Velvet', 120, 'n-vulcao-red', '23 cm · serve 12 fatias'),
    P('piscina-nozes', 'Bolo Piscina de Nozes', 140, 'n-piscina-nozes', '23 cm · serve 12 fatias'),
    P('cakebox-pistache', 'Cakebox Pistache', 180, 'n-cakebox-pistache', 'Aprox. 1,25 kg'),
    P('cakebox-red', 'Cakebox Red Velvet', 160, 'n-cakebox-red', 'Aprox. 1,25 kg'),
    P('cakebox-francesinha', 'Cakebox Francesinha de Morango', 160, 'n-cakebox-francesinha', 'Aprox. 1,25 kg'),
    P('tartelete', 'Tartelete de Morango', 130, 'n-tartelete', '20 cm'),
    P('pudim', 'Pudim', 80, 'n-pudim', 'Aprox. 1,25 kg · pipoca caramelizada opcional'),
    P('bem-casado-reino', 'Bem Casado coberto com Queijo Reino', 300, 'n-bem-casado-reino', '26 cm · frango, camarão ou peito de peru'),
    P('quiche-natal', 'Quiche de Natal (M)', 300, 'n-quiche-frango', 'Frango, camarão, bacalhau, alho-poró… · P R$ 280 · G R$ 330')
  ];

  // tortas inteiras — preços por tamanho do site oficial
  const TAM = ['PP', 'Intermediária', 'P', 'M', 'G'];
  const T = (id, nome, foto, desc, precos) => ({ id, nome, foto: IMG(foto), desc, precos, ativo: true });
  const TORTAS = [
    T('ninho-morango', 'Ninho com Morango', 't-ninho-morango', 'Massa branca, creme de ninho e morangos', { PP: 180, 'Intermediária': 210, P: 290, M: 320, G: 430 }),
    T('ninho-nutella', 'Ninho com Nutella', 't-ninho-nutella', 'Massa branca, creme de ninho e Nutella', { PP: 180, 'Intermediária': 210, P: 290, M: 320, G: 430 }),
    T('toda-brigadeiro', 'Toda Brigadeiro', 't-toda-brigadeiro', 'Massa de chocolate recheada de brigadeiro', { PP: 170, 'Intermediária': 190, P: 270, M: 290, G: 420 }),
    T('ninho-limao-frutas', 'Ninho, Limão e Frutas Vermelhas', 't-ninho-limao-frutas', 'Creme de ninho, geleia de limão e frutas vermelhas', { PP: 160, 'Intermediária': 170, P: 260, M: 290, G: 400 }),
    T('sonho-valsa', 'Chocolate com Sonho de Valsa', 't-sonho-valsa', 'Massa de chocolate e bombom Sonho de Valsa', { PP: 170, 'Intermediária': 190, P: 270, M: 300, G: 420 }),
    T('choc-morango', 'Chocolate com Morango', 't-choc-morango', 'Brigadeiro e pedaços de morango', { PP: 180, 'Intermediária': 210, P: 290, M: 320, G: 430 }),
    T('ninho-brigadeiro', 'Ninho com Brigadeiro', 't-ninho-brigadeiro', 'Creme de ninho e brigadeiro', { PP: 160, 'Intermediária': 180, P: 260, M: 290, G: 410 }),
    T('ninho-limao', 'Ninho com Limão', 't-ninho-limao', 'Creme de ninho e limão', { PP: 160, 'Intermediária': 180, P: 260, M: 290, G: 410 }),
    T('oreo', 'Chocolate com Oreo', 't-oreo', 'Massa de chocolate com Oreo', { PP: 170, 'Intermediária': 160, P: 270, M: 280, G: 420 }),
    T('crocante', 'Chocolate Crocante', 't-crocante', 'Brigadeiro e pé de moleque', { PP: 170, 'Intermediária': 190, P: 270, M: 300, G: 410 }),
    T('casadinha', 'Casadinha', 't-casadinha', 'Brigadeiro preto e branco', { PP: 170, 'Intermediária': 190, P: 270, M: 300, G: 420 }),
    T('ninho-trad', 'Ninho Tradicional', 't-ninho-trad', 'Massa branca e creme de ninho', { PP: 160, 'Intermediária': 180, P: 260, M: 290, G: 410 })
  ];

  const DOCES = [
    P('biscoito-tailandes', 'Biscoito Tailandês', 27, 'k-tailandes', 'Pote · caramelo de amêndoas'),
    P('biscoito-black', 'Tailandês Black', 27, 'k-tailandes-black', 'Pote · massa 70% chocolate'),
    P('biscoito-goiabinha', 'Biscoito Goiabinha', 27, 'k-goiabinha', 'Pote · mucilon de milho e goiabada'),
    P('biscoito-ninho', 'Biscoito Ninho', 27, 'k-ninho', 'Pote · amanteigado de leite ninho'),
    P('bolo-coco', 'Bolo Coco Queimado (P)', 46, 'bo-coco-queimado', 'Serve 10 fatias · G R$ 52'),
    P('bolo-fazenda', 'Bolo Fazenda (P)', 50, 'bo-fazenda', 'Mucilon de milho e goiabada · G R$ 60'),
    P('crock-belga', 'Crock Belga', 26, 'v-crock', 'Caramelo de amêndoas banhado no chocolate'),
    P('favo-mel', 'Favo de Mel', 29, 'v-favo', 'Aerado, crocante, banhado no chocolate')
  ];

  // vitrine da loja do Barra (cardápio oficial)
  const LOJA = [
    { nome: 'Torta Folhada de Morango', preco: 40, foto: IMG('v-folhada-morango'), desc: 'Massa folhada, brigadeiro branco, morangos, chantilly e Crock Belga' },
    { nome: 'Cream de La Cream', preco: 41, foto: IMG('v-cream'), desc: 'Creme de ninho, brigadeiro, brownie, sorvete e morango' },
    { nome: 'Brownie Supremo com Sorvete', preco: 35, foto: IMG('v-brownie'), desc: 'Brownie, sorvete, calda de chocolate e morango' },
    { nome: 'Cappuccino com Pistache', preco: 27, foto: IMG('v-capp-pistache'), desc: 'Cappuccino grande com creme de pistache' },
    { nome: 'Crock Monsieur de Camarão', preco: 49, foto: IMG('v-crock-monsieur'), desc: 'Creme de queijo, camarão e gratinado' },
    { nome: 'Salada Tropical de Camarão', preco: 69, foto: IMG('v-salada-camarao'), desc: 'Almoço executivo: folhas, frutas, burrata e camarão' }
  ];

  const CAIXAS = [6, 12, 20, 30];

  // ---------- exemplos (pedidos, clientes, orçamentos, tráfego) ----------
  function dia(off) { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + off); return d.toISOString().slice(0, 10); }
  function exemplo() {
    const CLI = [
      ['Mariana Teixeira', '71 98811-2034', '03-12', 'barra', 'anuncio'],
      ['Rafael Couto', '71 99102-4471', '11-27', 'barra', 'instagram'],
      ['Juliana Prado', '75 99231-0098', '01-15', 'feira', 'whatsapp'],
      ['Beatriz Andrade', '71 98740-5512', '11-21', 'barra', 'anuncio'],
      ['Carlos Menezes', '71 99677-3320', '07-08', 'barra', 'balcao'],
      ['Fernanda Lima', '75 98112-7765', '12-02', 'feira', 'instagram'],
      ['Patrícia Rocha', '71 99355-8810', '09-30', 'pituba', 'ifood'],
      ['Thiago Barreto', '71 98822-1093', '11-29', 'barra', 'anuncio'],
      ['Luana Sampaio', '71 99901-4456', '05-19', 'barra', 'site'],
      ['Renata Queiroz', '75 99140-2287', '12-10', 'feira', 'balcao'],
      ['Gustavo Pires', '71 98455-6670', '02-14', 'barra', 'site'],
      ['Camila Duarte', '71 99288-3341', '11-24', 'barra', 'instagram']
    ];
    const clientes = CLI.map((c, i) => ({ id: 'c' + (i + 1), nome: c[0], tel: c[1], aniversario: c[2], unidade: c[3], origem: c[4],
      pedidos: [5, 2, 7, 1, 3, 4, 2, 1, 6, 3, 2, 1][i], total: [612, 238, 1480, 129, 356, 702, 190, 600, 945, 410, 175, 88][i],
      ultimo: dia([-12, -40, -6, -2, -75, -20, -33, -1, -9, -58, -95, -3][i]) }));

    const pedidos = [
      { id: 'P-1041', tipo: 'caixa', cliente: 'Beatriz Andrade', tel: '71 98740-5512', unidade: 'barra', modo: 'retirada', data: dia(0), hora: '16:00', status: 'pronto', origem: 'anuncio',
        itens: [{ nome: 'Caixa com 12 brigadeiros', qtd: 1, preco: 66, detalhe: '4 Capim Santo, 4 Pistache, 4 Camafeu' }] },
      { id: 'P-1042', tipo: 'encomenda', cliente: 'Thiago Barreto', tel: '71 98822-1093', unidade: 'barra', modo: 'retirada', data: dia(0), hora: '18:30', status: 'producao', origem: 'anuncio',
        itens: [{ nome: 'Torta Ninho com Morango · M', qtd: 1, preco: 320 }, { nome: 'Caixa com 20 brigadeiros', qtd: 1, preco: 106, detalhe: 'sortidos' }] },
      { id: 'P-1043', tipo: 'natal', cliente: 'Camila Duarte', tel: '71 99288-3341', unidade: 'barra', modo: 'retirada', data: dia(1), hora: '11:00', status: 'confirmado', origem: 'instagram',
        itens: [{ nome: 'Panetone Trufado de Nutella', qtd: 2, preco: 110 }] },
      { id: 'P-1044', tipo: 'encomenda', cliente: 'Juliana Prado', tel: '75 99231-0098', unidade: 'feira', modo: 'retirada', data: dia(1), hora: '15:00', status: 'confirmado', origem: 'whatsapp',
        itens: [{ nome: 'Torta Toda Brigadeiro · G', qtd: 1, preco: 420 }] },
      { id: 'P-1045', tipo: 'caixa', cliente: 'Luana Sampaio', tel: '71 99901-4456', unidade: 'barra', modo: 'entrega', data: dia(2), hora: '10:00', status: 'novo', origem: 'site',
        itens: [{ nome: 'Caixa com 30 brigadeiros', qtd: 1, preco: 155, detalhe: '10 Ferrero, 10 Ninho com Confete, 10 Meio Amargo' }] },
      { id: 'P-1046', tipo: 'natal', cliente: 'Mariana Teixeira', tel: '71 98811-2034', unidade: 'barra', modo: 'retirada', data: dia(5), hora: '17:00', status: 'novo', origem: 'anuncio',
        itens: [{ nome: 'Árvore Bombom Cravejado Premium', qtd: 1, preco: 600 }] },
      { id: 'P-1047', tipo: 'natal', cliente: 'Fernanda Lima', tel: '75 98112-7765', unidade: 'feira', modo: 'retirada', data: dia(8), hora: '09:30', status: 'confirmado', origem: 'instagram',
        itens: [{ nome: 'Cakebox Pistache', qtd: 1, preco: 180 }, { nome: 'Bolo Vulcão Red Velvet', qtd: 1, preco: 120 }] },
      { id: 'P-1048', tipo: 'natal', cliente: 'Rafael Couto', tel: '71 99102-4471', unidade: 'barra', modo: 'retirada', data: dia(36), hora: '10:00', status: 'confirmado', origem: 'instagram',
        itens: [{ nome: 'Bem Casado coberto com Queijo Reino', qtd: 1, preco: 300 }, { nome: 'Panetone Trufado de Morango Cravejado', qtd: 1, preco: 120 }] },
      { id: 'P-1049', tipo: 'natal', cliente: 'Renata Queiroz', tel: '75 99140-2287', unidade: 'feira', modo: 'retirada', data: dia(35), hora: '16:00', status: 'novo', origem: 'balcao',
        itens: [{ nome: 'Árvore Crock Belga com especiarias', qtd: 1, preco: 300 }] },
      { id: 'P-1050', tipo: 'corporativo', cliente: 'Construtora (exemplo) · Ana', tel: '71 3333-0000', unidade: 'barra', modo: 'entrega', data: dia(22), hora: '14:00', status: 'confirmado', origem: 'anuncio',
        itens: [{ nome: 'Caixa com 6 brigadeiros (presente)', qtd: 80, preco: 33 }] },
      { id: 'P-1038', tipo: 'caixa', cliente: 'Carlos Menezes', tel: '71 99677-3320', unidade: 'barra', modo: 'retirada', data: dia(-1), hora: '19:00', status: 'entregue', origem: 'balcao',
        itens: [{ nome: 'Caixa com 12 brigadeiros', qtd: 1, preco: 60, detalhe: 'sortidos' }] },
      { id: 'P-1039', tipo: 'encomenda', cliente: 'Patrícia Rocha', tel: '71 99355-8810', unidade: 'pituba', modo: 'entrega', data: dia(-1), hora: '15:00', status: 'entregue', origem: 'ifood',
        itens: [{ nome: 'Torta Ninho com Nutella · P', qtd: 1, preco: 290 }] }
    ];

    const orcamentos = [
      { id: 'O-210', tipo: 'Confraternização de empresa', data: dia(24), qtd: 120, nome: 'Ana (RH)', empresa: 'Construtora · exemplo', tel: '71 3333-0000', unidade: 'barra',
        itens: ['Caixas de presente', 'Brigadeiros'], obs: 'Caixa de 6 com tag da empresa', status: 'fechado', valor: 2640, origem: 'anuncio', campanha: 'Presente corporativo · fim de ano', criado: dia(-6) },
      { id: 'O-211', tipo: 'Casamento', data: dia(140), qtd: 250, nome: 'Larissa e Pedro', empresa: '', tel: '71 99812-0077', unidade: 'barra',
        itens: ['Mesa de doces', 'Bem-casado', 'Lembrancinhas'], obs: 'Paleta verde e dourado', status: 'proposta', valor: 6800, origem: 'instagram', campanha: '', criado: dia(-3) },
      { id: 'O-212', tipo: 'Presente de fim de ano', data: dia(26), qtd: 40, nome: 'Marcos', empresa: 'Clínica · exemplo', tel: '71 98100-2299', unidade: 'barra',
        itens: ['Panetones', 'Biscoitos em pote'], obs: 'Entregar no Itaigara', status: 'novo', valor: 0, origem: 'anuncio', campanha: 'Presente corporativo · fim de ano', criado: dia(-1) },
      { id: 'O-213', tipo: 'Aniversário', data: dia(17), qtd: 60, nome: 'Daniela', empresa: '', tel: '75 99876-1010', unidade: 'feira',
        itens: ['Torta', 'Brigadeiros'], obs: '15 anos', status: 'novo', valor: 0, origem: 'site', campanha: '', criado: dia(0) },
      { id: 'O-209', tipo: 'Chá de bebê', data: dia(-4), qtd: 40, nome: 'Paula', empresa: '', tel: '71 99000-3131', unidade: 'barra',
        itens: ['Brigadeiros', 'Morango do amor'], obs: '', status: 'perdido', valor: 0, origem: 'anuncio', campanha: 'Natal à Mesa · Salvador', criado: dia(-15) }
    ];

    const campanhas = [
      { nome: 'Natal à Mesa · Salvador', objetivo: 'Mensagens no WhatsApp', verba: 900, impressoes: 84200, cliques: 1910, leads: 96, pedidos: 23, receita: 4180 },
      { nome: 'Presente corporativo · fim de ano', objetivo: 'Cadastro (orçamento)', verba: 600, impressoes: 31800, cliques: 702, leads: 31, pedidos: 2, receita: 3200 },
      { nome: 'Monte sua caixa · raio de 5 km do Barra', objetivo: 'Mensagens no WhatsApp', verba: 450, impressoes: 52700, cliques: 1388, leads: 58, pedidos: 19, receita: 1330 }
    ];
    const leads = [
      { quando: dia(0) + ' 10:12', nome: 'Isabela M.', tel: '71 9••••-1820', campanha: 'Natal à Mesa · Salvador', anuncio: 'Vídeo · árvore de bombom', interesse: 'Árvore Bombom Cravejado', status: 'conversando', valor: 0 },
      { quando: dia(0) + ' 09:40', nome: 'Henrique S.', tel: '71 9••••-4410', campanha: 'Presente corporativo · fim de ano', anuncio: 'Carrossel · caixas de presente', interesse: '50 caixas para equipe', status: 'novo', valor: 0 },
      { quando: dia(-1) + ' 21:05', nome: 'Beatriz A.', tel: '71 9••••-5512', campanha: 'Monte sua caixa · raio de 5 km do Barra', anuncio: 'Foto · brigadeiros na mesa', interesse: 'Caixa com 12', status: 'virou pedido', valor: 66 },
      { quando: dia(-1) + ' 18:22', nome: 'Thiago B.', tel: '71 9••••-1093', campanha: 'Natal à Mesa · Salvador', anuncio: 'Vídeo · torta ninho com morango', interesse: 'Torta M + caixa', status: 'virou pedido', valor: 426 },
      { quando: dia(-2) + ' 13:50', nome: 'Kátia R.', tel: '71 9••••-7702', campanha: 'Natal à Mesa · Salvador', anuncio: 'Vídeo · árvore de bombom', interesse: 'Panetone', status: 'perdido', valor: 0 },
      { quando: dia(-2) + ' 11:15', nome: 'Ana (RH)', tel: '71 3•••-0000', campanha: 'Presente corporativo · fim de ano', anuncio: 'Carrossel · caixas de presente', interesse: '120 caixas', status: 'virou pedido', valor: 2640 },
      { quando: dia(-3) + ' 16:31', nome: 'Mariana T.', tel: '71 9••••-2034', campanha: 'Natal à Mesa · Salvador', anuncio: 'Vídeo · árvore de bombom', interesse: 'Árvore Bombom', status: 'virou pedido', valor: 600 }
    ];
    return { pedidos, clientes, orcamentos, campanhas, leads };
  }

  function padrao() {
    return Object.assign({
      versao: 1,
      unidades: UNIDADES, sabores: SABORES, natal: NATAL, tortas: TORTAS, doces: DOCES, loja: LOJA, caixas: CAIXAS,
      prazoEncomenda: 2 // dias de antecedência (a confirmar com a loja)
    }, exemplo());
  }

  function carregar() {
    try {
      const raw = localStorage.getItem(CHAVE);
      if (raw) { const d = JSON.parse(raw); if (d && d.versao === 1) return d; }
    } catch (e) { /* sem storage: segue com o padrão */ }
    const d = padrao(); salvar(d); return d;
  }
  function salvar(d) { try { localStorage.setItem(CHAVE, JSON.stringify(d)); } catch (e) {} }
  function resetar() { try { localStorage.removeItem(CHAVE); } catch (e) {} return carregar(); }

  const brl = (v) => 'R$ ' + Number(v || 0).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const dataBR = (iso) => { if (!iso) return ''; const [a, m, d] = iso.split('-'); return d + '/' + m; };
  const hoje = () => dia(0);
  const proxId = (lista, pre) => pre + '-' + (Math.max(0, ...lista.map(x => parseInt(String(x.id).split('-')[1]) || 0)) + 1);

  window.BELGA = { carregar, salvar, resetar, brl, dataBR, hoje, dia, proxId, TAM, IMG };
})();
