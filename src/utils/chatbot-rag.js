/**
 * ChatFab RAG — Client-side knowledge base for LouvorJ.AI
 * v2.2 — Added Help Center content (HymnalRelation, TemplatesCSS), community insights (Telegram dev group),
 *         liturgy generation, known issues, and official contacts (5 new chunks)
 *
 * Provides real LouvorJA data to the LLM so it stops hallucinating.
 * Zero backend dependency — all search happens in the browser.
 *
 * Usage:
 *   import { searchRAG } from '@/utils/chatbot-rag';
 *   const context = searchRAG(userQuestion); // returns string to inject into system prompt
 */

const CHUNKS = [
  // ═══════════════════════════════════════════════════════════════
  // SEÇÃO A: FUNCIONALIDADES DO APP (v1.0 — mantido)
  // ═══════════════════════════════════════════════════════════════

  // ─── ATALHOS DE TECLADO ───
  {
    id: 'shortcuts',
    keywords: ['atalho', 'tecla', 'ctrl', 'f1', 'f5', 'f9', 'esc', 'shortcut', 'teclado', 'bindbindbindkey'],
    title: 'Teclas de Atalho do LouvorJA',
    text: `ATALHOS GERAIS: ESC fecha tela/janela; CTRL+F busca rapida; CTRL+W fecha aba; F1 ajuda; F5/F9 projetar.
PROJECAO DE MUSICA: Setas Cima/Baixo/PgUp/PgDn navega slides; Home primeiro slide; End ultimo slide; Pause/Play/CTRL+P/Espaco pausa musica.
EDITOR DE SLIDES: CTRL+Seta Direita grava tempo e avanca slide; CTRL+Seta Esquerda grava retroativo.
BUSCA BIBLICA: Setas navega versiculos; PgUp/PgDn versiculo anterior/proximo.
BUSCA COM ASTERISCO: Use * para qualquer trecho entre palavras (ex: "Jesus*Melhor").`,
  },

  // ─── STREAMING / TRANSMISSAO ───
  {
    id: 'streaming',
    keywords: ['transmit', 'obs', 'vmix', 'stream', 'streaming', 'projetar', 'navegador', 'porta', 'ip'],
    title: 'Transmissao para OBS/VMIX',
    text: `TRANSMISSAO LOUVORJA: Menu > Transmitir > configurar IP e Porta > "Iniciar Servidor". Copie a URL gerada e insira como objeto "Navegador" no OBS ou VMIX. Se der erro, tente mudar a porta. O conteudo (letras de musicas, passagens biblicas) e transmitido via navegador HTTP.
CSS PARA STREAMING: E possivel customizar a aparencia da letra transmitida com CSS — fonte, cor, tamanho, posicao (topo/rodape), fundo. Insira os codigos CSS na tela de formatacao.`,
  },

  // ─── BUSCA DE MUSICAS ───
  {
    id: 'music-search',
    keywords: ['busc', 'procur', 'achar', 'encontr', 'localiz', 'musica', 'hino', 'som'],
    title: 'Busca de Musicas e Hinos',
    text: `BUSCA DE MUSICAS: Use CTRL+F ou o campo de busca. Busca por nome ou parte do nome. Para buscar por trecho de letra, use "Localizar Musicas" no menu Coletaneas.
BUSCA COM ASTERISCO: O * representa qualquer trecho entre palavras. Ex: "Jesus*Melhor" encontra "Jesus e Melhor" e "Jesus meu Melhor Amigo".
HINARIO: Na aba Hinario, digite o NUMERO do hino e pressione ENTER para executar, ou digite o NOME para listar hinos que contenham essa palavra. O LouvorJA possui Hinario Adventista 1996 e Hinario Adventista 2022.
OPCOES DE ABERTURA DO HINO: Slide Cantado (com audio cantado), Slide Playback (com playback), Slide Sem Audio (manual), Em Sequencia (auto-avanca), Arquivo MP3 (cantado ou playback), Letra.`,
  },

  // ─── HINARIO ───
  {
    id: 'hymnal',
    keywords: ['hinari', 'hino', '1996', '2022', 'hinologia', 'correlacao', 'relacao',
      'numero', 'secao', 'seção', 'doutrinaria', 'categoria',
      'volta', 'vinda', 'batismo', 'ceia', 'sabado', 'sábado', 'mordomia', 'santuario', 'santuario',
      'adoração', 'adoracao', 'salvação', 'salvacao', 'graça', 'graca', 'missao', 'missão',
      'natal', 'cruz', 'espirito santo', 'novo mundo', 'nova terra', 'infantil', 'liturgico', 'litúrgico'],
    title: 'Hinarios — 1996 e 2022',
    text: `O LouvorJA suporta dois hinarios oficiais da IASD: Hinario Adventista 1996 (610 hinos) e Hinario Adventista 2022 (601 hinos). Ambos estao disponiveis no programa e na API.
O Hinario 2022 tem 600 hinos organizados por 8 secoes doutrinarias: Adoracao/Trindade (1-14), Deus Pai (15-22), Jesus Cristo (23-114 incluindo Natal 79-91 e Cruz 92-114), Espirito Santo (40-48), Biblia (49-58), Salvacao/Graca (115-172), Fe (173-216), Missao (223-241), Batismo (249-255), Santa Ceia (256-260), Sabado (290-299), Mordomia (300-314), Oração (357-367), Santuario (429-439), 2a Vinda (440-469), Nova Terra (491-507), Infantis (508-557), Liturgicos (558-600).
A correlacao entre os hinarios pode ser consultada no menu > Relacao de Hinos.`,
  },

  // ─── HINOS INDIVIDUAIS POPULARES (NHA 2022) ───
  {
    id: 'popular-hymns',
    keywords: ['hino', 'numero', 'qual', 'nome', 'titulo', 'cantar', 'tocar', 'hinos', 'hinario',
      'volta', 'vinda', 'batismo', 'ceia', 'sabado', 'natal', 'cruz', 'salvacao', 'adoracao',
      'aventureiro', 'desbravador', 'infantil', 'funeral', 'saida', 'encerramento', 'abertura'],
    title: 'Hinos Populares do Hinario 2022 (numeros e nomes reais)',
    text: `HINOS MAIS USADOS DO HINARIO ADVENTISTA 2022 (NHA):

ADORACAO/TRINDADE: 1-Santo Santo Santo!, 5-Jubilosos Te Adoramos, 11-Maior Que Tudo, 12-Vinde Povo Do Senhor
DEUS PAI: 15-Tu Es Fiel Senhor, 20-Grande E O Senhor
JESUS CRISTO: 26-Saudai O Nome De Jesus, 32-Brilha Jesus, 34-Precioso Nome
ESPIRITO SANTO: 40-Concede-nos O Espirito, 43-Vem Santo Espirito Agora
BIBLIA: 49-Que Firme Alicerce!, 51-Da-me A Biblia
SALVACAO: 115-Preciosa Graca, 118-Imenso Amor, 121-Por Um Pecador Qual Eu, 125-A Terna Voz Do Salvador, 131-Manso E Suave, 140-Ao Pe Da Cruz De Cristo, 154-Alvo Mais Que A Neve
FE/CRESIMENTO: 173-Que Prazer E Ser De Cristo, 179-Eu Sei Em Quem Eu Creio, 195-Minha Fe Bem Segura Esta, 208-Confia Em Deus
MISSAO: 229-Trabalho Cristao, 232-Jesus Precisa De Ti, 233-Brilha Por Cristo Em Teu Viver
BATISMO: 249-Oh Que Belos Hinos!, 250-A Jesus Seguir Eu Quero, 253-Importa Renascer, 255-As Aguas Batismais
SANTA CEIA: 256-A Ceia Do Senhor, 259-Em Memoria De Ti
DONS/MINISTERIO: 269-Sal Da Terra, 273-A Escola Sabatina, 275-Hino Dos Aventureiros, 276-Hino Dos Desbravadores
SABADO: 290-Do Santo Sabado Es Senhor, 291-Sabado Do Meu Senhor, 296-Bem-vindo O Sabado
MORDOMIA: 302-Tudo Entregarei, 307-Conta As Bencaos, 313-Tudo Para Deus
ORACAO: 357-Bendita Hora De Oracao, 360-Deus Ouve Deus Responde, 362-O Melhor Lugar Do Mundo, 363-O Jardim De Oracao, 367-Falar Com Deus
CONSAGRACAO: 378-Mais Perto Quero Estar, 388-Se Minha Vida, 397-Eu So Quero Estar Onde Estas, 403-Renova-me
FAMILIA: 408-Abencoa Este Lar, 411-Bem De Manha, 420-Hora Feliz Do Por Do Sol
SANTUARIO: 429-Quando O Livro Aberto For, 430-O Juizo
2A VINDA: 440-Breve Jesus Voltara, 441-Vencendo Vem Jesus, 444-Oh Que Esperanca!, 451-Grande Alegria, 455-Verei Jesus, 456-Bela Manha, 468-Quase No Lar
MORTE/RESSURREICAO: 470-Rocha Eterna, 471-Porque Ele Vive
NOVA TERRA/CEU: 491-Ha Um Rio Cristalino, 492-Lar Feliz, 493-Almejo O Lar, 494-Doce Lar
INFANTIS: 509-Criacao, 511-Eu Sou Uma Obra De Arte, 523-Sim Cristo Me Ama, 524-Jesus Me Quer Bem, 537-Sabado O Dia Mais Feliz, 544-Entrega Teu Caminho Ao Senhor
LITURGICOS: 558-O Senhor Esta Em Seu Templo, 572-Ofertorio, 600-Em Paz Eu Vou

REGRA: Use APENAS estes numeros e nomes. Se o usuario perguntar sobre um hino que nao esta nesta lista, diga que voce nao tem o nome completo e sugira consultar o Hinario 2022 ou o app LouvorJA.`,
  },

  // ─── LETRAS E CIFRAS ───
  {
    id: 'lyrics',
    keywords: ['letra', 'cifra', 'acorde', 'estrofe', 'verso'],
    title: 'Letras e Cifras',
    text: `O LouvorJA exibe letras e cifras em tempo real. Pressione o botao "Letra" para abrir a janela de letras. Nela e possivel ver: informacoes do album, a letra completa, e busca rapida dentro da letra (palavras sao destacadas em vermelho). As cifras sao transpostas automaticamente ao mudar o tom (CTRL+T). A formatacao da fonte pode ser ajustada nas configuracoes.`,
  },

  // ─── COLETANEAS ───
  {
    id: 'collections',
    keywords: ['coleca', 'coletanea', 'playlist', 'ja', 'min. musica', 'youtube'],
    title: 'Coletaneas e Playlists',
    text: `COLETANEAS NO LOUVORJA: On-line (reproduz direto do YouTube, requer internet), Personalizadas (suas playlists com arquivos locais), JA/Min. Musica (louvores oficiais dos Jovens Adventistas), Diversas.
Para criar playlist personalizada: copie o diretorio do album (CTRL+C) e cole na tela Coletaneas Personalizadas (CTRL+V), ou clique "Adicionar".
EXECUCAO: Ao clicar numa coletanea, abre a lista de musicas. Clique para abrir o slide. Botoes de acao: slides cantado, playback, sem audio, MP3 cantado, MP3 playback, letra. "Reproduzir Todas" executa em sequencia. "Projetar Menu" projeta a lista.
Para excluir: clique direito > Excluir (remove apenas o atalho, nao o arquivo).`,
  },

  // ─── BIBLIA ───
  {
    id: 'bible',
    keywords: ['bibl', 'versic', 'versiculo', 'passage', 'testamento', 'deus', 'salmo', 'joao'],
    title: 'Busca Biblica',
    text: `BUSCA BIBLICA: Aba "Busca Biblica" com filtros para livro, capitulo e versiculo. Suporta multiplas versoes biblicas (selecionar na barra de ferramentas superior).
BUSCA POR PALAVRAS: Use * para qualquer trecho entre termos. Ex: "Deus*terra" encontra "No principio criou Deus os ceus e a terra."
MULTIPLAS PASSAGENS: Coloque varios versos no campo: "1-3" (versos 1 a 3), "1,3" (versos 1 e 3), "1-3,5" (1 a 3 e 5). Pressione ENTER.
CTRL+G: atalho para abrir a busca biblica rapidamente.`,
  },

  // ─── LITURGIA ───
  {
    id: 'liturgy',
    keywords: ['liturg', 'culto', 'programac', 'agenda', 'escala', 'itens agendados'],
    title: 'Liturgia e Programacao de Culto',
    text: `LITURGIA: Tela para organizar a sequencia da programacao do culto com musicas, leituras e anotacoes.
TIPOS DE ITEM: Anotacao (ex: "Oração" — sem acao), Arquivo/Diretorio (abre video ou PPT), Categoria (separador de grupo), Itens Agendados (conteudo dinamico vinculado a data), Musica (da coletanea — pode escolher na hora), Site (abre URL).
ITENS AGENDADOS: Itens que mudam cada sabado (Provai e Vede, Informativo, Momentos de Saude etc). Clique "Adicionar Categoria" para criar. Duplo-clique na data do calendario para vincular um arquivo. Depois adicione na Liturgia via "Adicionar Item" > "Itens Agendados".
Para adicionar musicas/arquivos: CTRL+C (copiar) > CTRL+V (colar na tela de Liturgia), ou use "Adicionar Item".`,
  },

  // ─── PROJECAO ───
  {
    id: 'projection',
    keywords: ['projet', 'monitor', 'tela', 'segundo monitor', 'expandid'],
    title: 'Projecao em Segundo Monitor',
    text: `PROJECAO: Clique no botao "Area Expandida" para projetar conteudo no segundo monitor. Se nao detectar o segundo monitor, abre no monitor principal. Pressione ESC ou o botao novamente para recolher.
Para alterar o monitor: clique na seta do botao "Area Expandida" e escolha. A escolha fica salva no programa.
MENU OPCOES: Tambem e possivel definir o monitor de projecao no menu geral > Opcoes.`,
  },

  // ─── EDITOR DE SLIDES ───
  {
    id: 'slide-editor',
    keywords: ['editor', 'slide', 'apresentac', 'gravar', 'tempo', 'interval'],
    title: 'Editor de Slides',
    text: `EDITOR DE SLIDES: Permite criar slides personalizados com texto principal, texto auxiliar, imagens e formatacao.
ACOES: Novo Slide, Duplicar Slide, Excluir Slide, Dividir Slide (cada linha vira slide; "|" faz quebra dentro do slide), Mesclar Prox. Slide.
GRAVACAO DE TEMPOS: Na aba "Audio/Gravacao" — Reproduzir para iniciar, depois "Gravar e Avancar" grava no momento atual do audio e avanca. "Gravar Inicio" marca inicio do slide. "Gravar Retroativo" volta 1 segundo. "Remover Gravacoes" zera todos os tempos.
Exportar: salve no formato .slja para editar depois. F5/F9 projeta os slides.`,
  },

  // ─── FORMATAÇÃO ───
  {
    id: 'formatting',
    keywords: ['format', 'css', 'estilo', 'fonte', 'cor', 'aparencia', 'tamanho'],
    title: 'Formatacao e CSS',
    text: `FORMATAÇÃO DE CONTEUDO: Botao "Formatar" abre painel lateral para modificar fonte, cor, tamanho, imagem de fundo e disposicao. Botao "Restaurar" volta ao padrao.
CSS PARA STREAMING: E possivel customizar a aparencia da letra transmitida para OBS/VMIX com CSS. Manipule: posicao (top/bottom), tamanho da fonte (px), cor da fonte (nome em ingles ou hex #FFFFFF), tipo de fonte. O CSS e aplicado em tempo real durante a transmissao.`,
  },

  // ─── PROVAI E VEDE ───
  {
    id: 'provai-e-vede',
    keywords: ['provai', 'vede', 'video', 'informativo', 'missao'],
    title: 'Provai e Vede',
    text: `PROVAI E VEDE: O programa NAO possui os videos nativamente. O usuario deve baixar os videos da internet manualmente e cadastrar no programa.
Para adicionar: 1) Baixe o video da internet; 2) Vá em "Itens Agendados"; 3) Crie uma categoria; 4) Duplo-clique na data do calendario e selecione o arquivo; 5) Na tela de Liturgia, adicione via "Adicionar Item" > "Itens Agendados".
Itens Agendados tambem servem para Informativo Mundial das Missoes, Momentos de Saude, e outros conteudos dinamicos.`,
  },

  // ─── EXPORTACAO ───
  {
    id: 'export',
    keywords: ['export', 'salvar', 'arquivo', 'slja', 'mp3', 'download'],
    title: 'Exportacao e Download',
    text: `FORMATOS DE EXPORTAÇÃO: .slja (formato nativo do LouvorJA — pode ser editado depois no Editor de Slides), PDF (para impressao), MP3 (audio cantado e playback).
Para exportar: pressione "Exportar Musica" para salvar a musica atual em .slja.
COLETANEAS PERSONALIZADAS: Excluir coletanea remove APENAS o atalho do menu, NAO exclui o arquivo original. Para excluir todas: seta ao lado de "Excluir" > "Excluir Todas".
O LouvorJA esta disponivel para Android (Play Store, gratuito), Windows (download no site), e Web (navegador). Acesse louvorja.com/download.`,
  },

  // ─── CONFIGURACOES ───
  {
    id: 'settings',
    keywords: ['configur', 'ajuste', 'prefer', 'opcao', 'tema', 'escuro', 'claro', 'idioma'],
    title: 'Configuracoes do LouvorJA',
    text: `CONFIGURACOES DISPONIVEIS: Tema (claro ou escuro), Fonte (tamanho e estilo), Transposicao padrao (tom padrao para musicas), Ordem das musicas (como sao listadas), Idioma (portugues e espanhol), Monitor de projecao.
O programa suporta i18n — portugues e espanhol. A troca de idioma e feita nas configuracoes.
Para acesso rapido: F1 abre a tela de ajuda dentro do programa.`,
  },

  // ─── APLICACOES ───
  {
    id: 'platforms',
    keywords: ['download', 'baixar', 'instalar', 'mobile', 'celular', 'android', 'windows', 'web', 'app'],
    title: 'Plataformas e Download',
    text: `O LouvorJA esta disponivel em: Android (gratuito na Play Store), Windows (download no site oficial louvorja.com), Web (acesso pelo navegador).
Site oficial: https://louvorja.com.br
Central de ajuda: https://louvorja.com.br/ajuda
O app e open source — repositorio no GitHub: github.com/louvorja`,
  },

  // ─── API DATA ───
  {
    id: 'api-data',
    keywords: ['api', 'endpoint', 'quantas musicas', 'quantos hinos', 'total', 'acervo', 'catalogo'],
    title: 'Dados do Acervo LouvorJA',
    text: `ACERVO LOUVORJA: O acervo possui aproximadamente 1889 musicas, 601 hinos do Hinario Adventista 2022, 613 hinos do Hinario Adventista 1996, e 13 categorias com albuns tematicos.
CATEGORIAS: Incluem Hinario Adventista, Hinario Adventista 2022, JA (Jovens Adventistas), Ministerio de Musica, Diversas, entre outras.
ALBUNS TEMATICOS MAIS USADOS: Adoradores (1-5), Celebra SP, Diferente, Até que Ele Venha, Na Presença de Deus, 2002-2024 (por ano), Salmos, Desbravadores e Aventureiros, entre outros.
API publica: https://api.louvorja.com.br — documentacao Swagger disponivel em /documentation.
NAO INVENTE NUMEROS. Use apenas os dados acima. Se o usuario perguntar sobre um hino especifico por numero, sugira buscar no app ou no site.`,
  },

  // ─── HINARIO 2022 — SECOES TEMATICAS ───
  {
    id: 'hymnal-2022-sections',
    keywords: ['hinario 2022', 'nha', 'novo hinario', 'hinario novo', 'secao', 'doutrina', 'tema'],
    title: 'Hinario Adventista 2022 — Secoes por Doutrina',
    text: `HINARIO ADVENTISTA 2022 — 600 hinos organizados por secoes doutrinarias:
ADORACAO/TRINDADE (1-14): Abertura de culto.
DEUS PAI (15-22): Louvor geral.
JESUS CRISTO (23-114): Inclui Natal (79-91), Cruz (92-114).
ESPIRITO SANTO (40-48): Consagracao.
BIBLIA (49-58): Escola Sabatina.
SALVACAO/GRAÇA (115-172): Apelo, conversao.
CRESCIMENTO/FE (173-216): Encorajamento.
MISSAO/EVANGELISMO (223-241): Testemunho.
BATISMO (249-255): Culto batismal.
SANTA CEIA (256-260): Culto de comunhao.
DONS/MINISTERIO (261-276): Ordenacao, Aventureiros (275), Desbravadores (276).
SABADO (290-299): Por do sol, abertura.
MORDOMIA/OFERTAS (300-314): Dizimos e ofertas.
ORACAO (357-367): Momento de oracao.
SANTUARIO (429-439): Juizo, investigacao.
2A VINDA (440-469): Esperanca, encerramento.
NOVA TERRA/CEU (491-507): Consolacao, funeral.
INFANTIS (508-557): Adoracao infantil.
LITURGICOS INTROITO (558-571), OFERTORIO (572-577), DESPEDIDA (592-600).
NAO INVENTE NUMEROS DE HINOS. Se o usuario pedir um hino por tema, sugira a faixa da secao correspondente.`,
  },

  // ─── ALBUNS TEMATICOS ───
  {
    id: 'thematic-albums',
    keywords: ['album', 'suger', 'recomend', 'tema', 'amor', 'graca', 'oracão', 'missao', 'esperanca', 'fe', 'louvor', 'adoracão', 'natal', 'juventude', 'consagracão'],
    title: 'Albuns Tematicos do LouvorJA',
    text: `ALBUNS POR TEMA (guia de sugestao):
AMOR/GRAÇA: Adoradores, Adoradores 2, Celebra SP, 2002-Voce me Pertence.
ORACAO/COMUNHAO: Adoradores 3, Na Presença de Deus, Magnifico Deus.
MISSAO/TESTEMUNHO: 1998-Missao, 2004-Somos Tua Voz, 2019-Somos Tuas Maos.
ESPERANÇA/VOLTA DE JESUS: Até que Ele Venha, 2014-A Unica Esperanca, 2024-Maranata.
FE/CONFIANÇA: 2005-Fiel a Toda Prova, 2008-Vivo por Jesus, Salmos.
LOUVOR/ADORACAO: Adoradores 4, Adoradores 5, Celebra SP 2 e 3.
JOVENS/ENERGIA: Diferente, 2010-Geração Esperanca, 2011-Amigos da Esperanca.
NATAL/PASCOA: Semana Santa 2023, Diversas.
BIBLIA/PALAVRA: Está Escrito Vol.1, 2015-Eu Sou a Mensagem.
CONSAGRACAO: Adoradores 3, 2020-Tudo por Ele, 2017-Eu Creio.
INFANTIL: Desbravadores e Aventureiros (album oficial).
NAO INVENTE NOMES DE MUSICAS OU ALBUNS. Apenas sugira albuns desta lista.`,
  },

  // ─── REPRODUCAO EM SEQUENCIA ───
  {
    id: 'sequential-playback',
    keywords: ['sequencia', 'reproduz', 'seguida', 'proximo', 'automat'],
    title: 'Reproducao de Hinos em Sequencia',
    text: `REPRODUCAO EM SEQUENCIA: Na aba Hinario, selecione um hino e pressione "Em Sequencia". O hino atual sera executado e, ao termino, o proximo hino sera executado automaticamente (ex: hino 51 > 52 > 53...).
Na tela de Playlist (coletanea), o botao "Reproduzir Todas" executa todas as musicas da coletanea em sequencia automaticamente.
FORMAS DE ABERTURA DE HINO: Letra, Slide Cantado, Slide Playback, Slide Sem Audio (manual), Em Sequencia, Arquivo MP3 Cantado, Arquivo MP3 Playback.`,
  },

  // ═══════════════════════════════════════════════════════════════
  // SEÇÃO B: CONHECIMENTO LITÚRGICO IASD (v2.0 — NOVO)
  // Portado da skill sugestor-hinos-louvor-ja v1.9.0
  // ═══════════════════════════════════════════════════════════════

  // ─── ESTRUTURA DE CULTO IASD ───
  {
    id: 'culto-structure',
    keywords: ['culto', 'sabado', 'domingo', 'escola sabatina', 'culto divino', 'programa',
      'programacao', 'liturgia', 'ordem', 'estrutura', 'invertido', 'horario', 'manha', 'noite',
      'adoracao', 'pregacao', 'sermao', 'orador', 'pregador'],
    title: 'Estrutura de Culto IASD — Sábado e Domingo',
    text: `ESTRUTURA DOS CULTOS DA IASD:

SÁBADO (dia principal):
1. ESCOLA SABATINA (ES) — estudo da lição em classes. Estrutura: Momentos de Louvor (2 hinos), Hino Inicial, abertura/informativo, divisão de classes, estudo, Hino Final.
2. CULTO DIVINO (CD) — pregação. Estrutura: Momentos de Louvor (2 hinos), Hino Inicial, Oração, Leitura bíblica, Dízimos e Ofertas (Ofertório), Coral/Especial, Sermão, Oração final, Hino Final, Saída.

ORDEM: Normal = ES primeiro, CD depois. Invertido = CD primeiro, ES depois (quando necessário).
No culto invertido: o CD abre com mais louvor/adoração, a ES encerra de forma reflexiva. A Saída (NHA 600) vem APÓS o Hino Final da ES (não do CD).

DOMINGO:
Culto simples. UM bloco só, sem Escola Sabatina. Estrutura: Momentos de Louvor (1-2 hinos, máx 3), Hino Inicial, [Ofertório opcional], Hino Final, [Saída opcional].

CONVENÇÕES DA IGREJA:
- Hino Inicial e Hino Final do Culto Divino = definidos pelo PREGADOR/ORADOR (não pelo diretor de música).
- Ofertório: "Quero Ofertar" é o hino padrão da congregação — NUNCA alterar.
- Saída: NHA 600 "Em Paz Eu Vou" é o hino de despedida mais usado.
- Momentos de Louvor (ML) = SEMPRE selecionados pelo diretor de música/bot, NUNCA pelo pregador.`,
  },

  // ─── GRADUAÇÃO EMOCIONAL ───
  {
    id: 'emotional-graduation',
    keywords: ['momento de louvor', 'momentos de louvor', 'ml', 'selecionar', 'escolher',
      'sugest', 'hino inicial', 'hino final', 'qual hino', 'que hino', 'recomend',
      'acolhedor', 'solene', 'animado', 'reflexivo', 'emocao', 'sentimento', 'tom',
      'crescente', 'progressao', 'intensidade', 'adorar', 'louvar'],
    title: 'Graduação Emocional — Seleção de Momentos de Louvor',
    text: `REGRA DE GRADUAÇÃO EMOCIONAL (para selecionar Momentos de Louvor):

Os Momentos de Louvor (ML) seguem uma PROGRESSÃO EMOCIONAL — ficam progressivamente mais solenes à medida que se aproxima o Culto Divino e a pregação.

ES — ML1 e ML2: ACOLHEDOR / ANIMADO
Critérios: Graça, família, comunhão, pertencimento, alegria, bem-vindo, vida, paz.
Letras leves e congregacionais. Hinos que ACOLHEM quem chega.
Exemplos: "Só Pela Graça", "Tua Graça Cantarei", "Em Família", "Brilha Jesus", "Vamos Juntos Cantar", "Comunhão Preciosa", "Graça, Amor e Comunhão".

CD — ML1 e ML2: SOLENE / REFLEXIVO
Critérios: Cruz, entrega, adoração profunda, consagração, coração, sacrifício, sangue.
Hinos que PREPARAM o coração para a pregação.
Exemplos: "Ao Olhar pra Cruz", "Mensagem da Cruz", "Tudo Entregarei", "Consagração", "Sobre o Altar", "Te Adoramos", "Santo És Senhor".

REGRAS PRÁTICAS:
1. SEMPRE cruzar com o TEMA DA LIÇÃO. Se a lição fala de cruz, os ML do CD refletem cruz/entrega. Se fala de esperança, usar MLs de esperança (mais leves na ES, mais profundos no CD).
2. Hinos do LouvorJA (álbuns) são PREFERIDOS para ML — são mais congregacionais que os do Hinário.
3. Prioridade: cruzar tema da lição > graduação emocional > evitar repetir álbuns entre HI/HF e MLs.
4. NUNCA usar "definido pelo diretor" nos ML — o bot define os ML.
5. EVITAR REPETIR hinos: se o ML1 já usou certo álbum, o ML2 deve vir de álbum diferente.
6. Duração ideal: 1:30 a 4:30 (congregacional, nem muito curto nem muito longo).`,
  },

  // ─── HINÁRIO 2022 — ÍNDICE REMISSIVO COMPLETO ───
  {
    id: 'hinario-2022-remissivo',
    keywords: ['hinario 2022', 'indice', 'remissivo', 'doutrina', 'secao', 'subsecao',
      'trindade', 'deus pai', 'jesus', 'espirito santo', 'escrituras', 'criacao',
      'natureza humana', 'grande conflito', 'salvacao', 'crescimento', 'igreja',
      'missao', 'unidade', 'batismo', 'santa ceia', 'dons', 'profecia', 'lei',
      'sabado', 'mordomia', 'conduta', 'familia', 'santuario', 'vinda', 'morte',
      'milenio', 'nova terra', 'infantis', 'liturgicos',
      // Hinos populares citados pelo nome (para busca direta)
      'quero ofertar', 'tudo entregarei', 'toma meu coração', 'tudo por ti',
      'preciosa graça', 'em paz eu vou', 'tudo por deus'],
    title: 'Hinário 2022 — Índice Remissivo Completo por Doutrina',
    text: `HINÁRIO ADVENTISTA 2022 — 600 HINOS POR SEÇÕES DOUTRINÁRIAS:

TRINDADE (1-14): Santo Santo Santo (1), Jubilosos Te Adoramos (5), Maior Que Tudo (11), Vinde Povo (12).
DEUS PAI (15-22): Tu És Fiel (15), Grande É O Senhor (20).
JESUS CRISTO (23-39): Saudai O Nome (26), Brilha Jesus (32), Precioso Nome (34), Lindo És Mestre (28).
ESPÍRITO SANTO (40-48): Concede-nos O Espírito (40), Vem Santo Espirito (43), O Poder do Espirito (48).
ESCRITURAS (49-58): Que Firme Alicerce (49), Da-me A Biblia (51), Tua Palavra (55).
CRIAÇÃO (59-63): Criacao (59), Os Céus Proclamam (60).
NATUREZA HUMANA (64-69).
GRANDE CONFLITO (70-78).
NATAL (79-91): Nasceu Jesus (79), Segue-me (90).
PAIXÃO/CRUZ (92-114): Rude Cruz (103), Cristo Já Ressuscitou (114), O Amor de Jesus (29 — adjacente), Ao Olhar pra Cruz.
SALVAÇÃO/GRAÇA (115-172): Preciosa Graça (115), Imenso Amor (118), Manso E Suave (131), Ao Pé Da Cruz (140), Alvo Mais Que A Neve (154), Tudo por Ti, Desperta e Brilha.
CRESCIMENTO/FÉ (173-216): Que Prazer (173), Eu Sei Em Quem Creio (179), Confia Em Deus (208).
IGREJA (217-222): Somos Um Pequeno Povo (222).
MISSÃO (223-241): Trabalho Cristao (229), Jesus Precisa De Ti (232), Brilha Por Cristo (233).
UNIDADE (242-248): Em Família (246).
BATISMO (249-255): A Jesus Seguir (250), Importa Renascer (253).
SANTA CEIA (256-260): A Ceia Do Senhor (256), Em Memoria De Ti (259).
DONS/MINISTÉRIO (261-276): Sal Da Terra (269), A Escola Sabatina (273), Hino dos Aventureiros (275), Hino dos Desbravadores (276), Mãos (263).
PROFE CIA (277-281).
LEI (282-289).
SÁBADO (290-299): Do Santo Sabado (290), Bem-vindo O Sabado (296).
MORDOMIA (300-314): Toma Meu Coração (301), Tudo Entregarei (302), Tudo Para Deus (313), Conta As Bencaos (307), Quero Ofertar, É Prazer Servir (353).
CONDUTA CRISTÃ (315-407): Consagração, Mais Perto (378), Se Minha Vida (388), Renova-me (403), Vem Brilhar (395), Canção da Vida (375), Sempre Alegre (355), Jesus é Melhor (321), Sua Glória (563).
ORAÇÃO (357-367): Bendita Hora (357), Deus Ouve (360), O Melhor Lugar (362), O Jardim (363), Falar Com Deus (367).
FAMÍLIA (408-428): Abencoa Este Lar (408), Bem De Manha (411), Hora Feliz Do Por Do Sol (420).
SANTUÁRIO (429-439): Quando O Livro (429), O Juizo (430).
2ª VINDA (440-469): Breve Jesus Voltara (440), Vencendo Vem Jesus (441), Oh Que Esperanca (444), Grande Alegria (451), Verei Jesus (455), Bela Manha (456), Quase No Lar (468), Deixa Entrar o Rei (129), Cada Dia Mais Perto (459).
MORTE (470-476): Rocha Eterna (470), Porque Ele Vive (471).
MILÊNIO/JUÍZO (477-490).
NOVA TERRA (491-507): Ha Um Rio (491), Lar Feliz (492), Almejo O Lar (493), Doce Lar (494).
INFANTIS (508-557): Criacao (509), Eu Sou Uma Obra De Arte (511), Sim Cristo Me Ama (523), Sabado O Dia Mais Feliz (537), Entrega Teu Caminho (544).
LITÚRGICOS (558-600): Introito O Senhor Esta (558), Ofertorio (572), Em Paz Eu Vou (600), Sua Glória (563), Grande Alegria (451).

REGRA ANTI-ALUCINAÇÃO: Use APENAS estes números e nomes. Hinos que NÃO EXISTEM no acervo e causam falsos positivos: "Desponta e Brilha", "Tudo por Ti" (existe em alguns álbuns mas não no Hinário 2022 por este nome).`,
  },

  // ─── TEMPLATES DE PROGRAMAÇÃO ───
  {
    id: 'templates',
    keywords: ['template', 'modelo', 'formato', 'programacao', 'sonoplastia', 'membros',
      'whatsapp', 'grupo', 'enviar', 'texto', 'mensagem', 'estrutura programa',
      'copiar', 'colar', 'saida', 'formato oficial'],
    title: 'Templates de Programação de Culto — Formato Oficial',
    text: `TEMPLATES DE PROGRAMAÇÃO — FORMATO OFICIAL:

TEMPLATE SONOPLASTIA (técnico, SEM links YouTube):
📅 [DATA] — Lição [Nº]: [Nome da Lição]
🕊️ESCOLA SABATINA
    ▪️Momentos de Louvor: [Hino 1] ([Álbum])/[Hino 2] ([Álbum])
    ▪️Hino Inicial: [Nº]-[Nome]
    ▪️Hino Final: [Nº]-[Nome]

⛪CULTO DIVINO
    ▪️Momentos de Louvor: [Hino 1] ([Álbum])/[Hino 2] ([Álbum])
    ▪️Hino Inicial: *definido pelo orador*
    ▪️Ofertório: Quero Ofertar
    ▪️Hino Final: *definido pelo orador*
    ▪️Saída: 600-Em Paz Eu Vou

TEMPLATE MEMBROS (devocional, COM links YouTube):
🕊️ Queridos irmãos e irmãs,
"[Versículo de introdução]" — [Referência]
[Devocional curto, 2-3 frases]
"Versículo sobre louvor" — [Referência]

🕊️ ESCOLA SABATINA
Momentos de Louvor
▪️ [Nome do hino] ([Álbum])
[link YouTube]
🎵 Hino Inicial – [Nº] – [Nome]
[link YouTube]

━━━━━━━━━━━━━━━
⛪ CULTO DIVINO
[mesma estrutura com links]

REGRAS DE FORMATAÇÃO:
- Hinos do Hinário (NHA): "Nº-Nome" (ex: "362-O Melhor Lugar do Mundo")
- Hinos do Louvor JA: "Nome (Álbum)" (ex: "Falar com Deus (Na Presença de Deus)")
- Hinos externos: "Nome (Fonte)" (ex: "Caminhando com Jesus (YouTube)")
- Momentos de Louvor: SEMPRE 2 hinos separados por "/" (sábado). Domingo: 1-2 (máx 3).
- Separador de seções: ━━━━━━━━━━━━━━━
- NÃO usar markdown bold nem emojis excessivos.

CULTO INVERTIDO (CD antes da ES):
- Ordem: Culto Divino primeiro → ES depois
- Saída (NHA 600) vem APÓS o Hino Final da ES (último item de todo o culto)
- CD não tem hino de saída no formato invertido.

CULTO DE DOMINGO:
- UM bloco só, sem ES, sem separador
- Momentos de Louvor: 1-2 hinos (máximo 3). Padrão = 2.
- Sem saída obrigatória
- Ofertório opcional`,
  },

  // ─── VALIDAÇÃO DE HINOS E ANTI-ALUCINAÇÃO ───
  {
    id: 'validation-rules',
    keywords: ['validar', 'validacao', 'existe', 'nao existe', 'encontrar', 'alucina',
      'inventar', 'confirmar', 'verificar', 'falso positivo', 'match', 'parcial',
      'campo track', 'albums_names', 'api louvorja', 'endpoint',
      // Hinos inventados que causam alucinação — adicionar como keywords
      // para que busca direta pelo nome traga o warning
      'desponta e brilha', 'tudo por ti', 'consagração', 'segue-me a mim',
      'desponta', 'brilha', 'consagracao'],
    title: 'Validação de Hinos e Regras Anti-Alucinação',
    text: `VALIDAÇÃO DE HINOS — REGRAS OBRIGATÓRIAS:

ANTES de sugerir QUALQUER hino, verificar se ele existe no acervo. NUNCA sugerir hinos sem confirmar.

ERROS COMUNS DE ALUCINAÇÃO (hinos que NÃO EXISTEM):
- "Desponta e Brilha" — NÃO EXISTE no acervo LouvorJA
- "Tudo por Ti" — NÃO EXISTE no Hinário 2022 por este nome

CAMPOS DA API LOUVORJA (não confundir):
- Número do hinário = campo "track" (NÃO "number")
- Álbuns da música = campo "albums" (array de objetos, NÃO "albums_names" string)
- Sempre buscar pelo campo correto para evitar falso negativo

MATCH PARCIAL = FALSO POSITIVO POTENCIAL:
- "Tudo por Ti" pode matchu "Tudo por Cristo", "Tudo por Ele" (palavras "tudo" + "por" aparecem)
- SEMPRE verificar manualmente se o match parcial é realmente o hino desejado
- Match exato = nome idêntico → seguro
- Match por hinário (track) = número encontrado → seguro
- Match parcial = palavras-chave → VERIFICAR MANUALMENTE

ROTAS DA API (NÃO têm prefixo /api):
- /json_db/pt_musics — índice completo (1889 músicas, ~2MB)
- /json_db/pt_hymnal — Hinário 2022 (campo "track" = número)
- /json_db/pt_hymnal_1996 — Hinário 1996
- /json_db/pt_categories — categorias com álbuns
- /json_db/music_{id} — detalhes de uma música

WAF/ModSecurity: A API pode retornar HTTP 406 para requisições sem headers browser-like. Headers necessários: User-Agent (não-default) e Referer.

QUANDO HINO NÃO ENCONTRADO:
1. Buscar alternativas por tema no acervo
2. Priorizar alternativas do mesmo álbum
3. Apresentar 2-3 opções com nome, ID, álbum e duração
4. NÃO substituir silenciamente — informar e pedir confirmação`,
  },

  // ─── DOUTRINAS IASD E CORRELAÇÃO HINÁRIO ───
  {
    id: 'iasd-doutrina',
    keywords: ['doutrina', 'crenca', '28 crenças', 'iasd', 'adventista', 'historia',
      'hinologia', '1933', '1963', '1996', '2022', 'santa ceia', '13 sabado',
      'decimo terceiro', 'trimestre', 'oferta especial'],
    title: 'Doutrinas IASD e Correlação com Hinário',
    text: `DOCTRINAS FUNDAMENTAIS IASD (28 crenças) E CORRELAÇÃO COM HINÁRIO:

As 28 doutrinas fundamentais mapeiam diretamente para as seções do Hinário 2022:
1. Doutrina de Deus (Trindade) → Hinos 1-14
2. Deus Pai → 15-22
3. Jesus Cristo (vida, morte, ressurreição) → 23-114
4. Espírito Santo → 40-48
5. Escrituras/Sagradas → 49-58
6. Criação → 59-63
20. Sábado → 290-299
21. Mordomia Cristã → 300-314
23. Casamento e Família → 408-428
24. Ministério de Cristo no Santuário Celestial → 429-439
25. Segunda Vinda de Cristo → 440-469
26. Morte e Ressurreição → 470-476
27. O Milênio e o Fim do Pecado → 477-490
28. A Nova Terra → 491-507

SANTA CEIA: 4x ao ano na maioria das congregações. Hinos 256-260. HA 520 também usado.

13º SÁBADO (oferta especial para missões mundiais):
- Último sábado de cada trimestre
- 2026: 28/mar, 27/jun, 26/set, 26/dez
- Ofertório sugerido: NHA 313
- Hinos alinhados com missão/eternidade

HINOLOGIA ADVENTISTA (linha do tempo):
1933 → Primeiro hinário adventista brasileiro
1963 → Hinário Adventista (edição revisada)
1996 → Hinário Adventista 7º Dia (610 hinos, HASD)
2022 → Novo Hinário Adventista (600 hinos, NHA) — atual

A partir de 2022, o auxiliar da Escola Sabatina usa o NOVO hinário (2022).
A correspondência entre 1996 e 2022: alguns números mudaram. Consultar tabela no app ou em musicaeadoracao.com.br.`,
  },

  // ─── API ADVENTECH (Escola Sabatina) ───
  {
    id: 'adventech-api',
    keywords: ['adventech', 'escola sabatina', 'licao', 'lição', 'verso aureo',
      'leitura', 'trimestre', 'quarterly', 'conteudo', 'estudo', 'dia',
      'sabbath school', 'api adventech'],
    title: 'API Adventech — Conteúdo da Escola Sabatina',
    text: `API ADVENTECH — FONTE DE DADOS DA ESCOLA SABATINA:

Base URL: https://sabbath-school.adventech.io/api/v2

ENDPOINTS:
1. Listar trimestres PT: /pt/quarterlies/index.json
2. Lições de um trimestre: /pt/quarterlies/{QUARTERLY_ID}/lessons/index.json
3. Conteúdo do dia: /pt/quarterlies/{QUARTERLY_ID}/lessons/{LESSON_ID}/days/{DAY_ID}/read/index.json

QUARTERLY ID: Formato YYYY-NN-pt (ex: 2026-03-pt = 3º trimestre 2026).
ADULTOS PT tem sufixo -pt. Sem o sufixo retorna versão EN.

CAMPOS DO JSON DE LEITURA:
- "content" (HTML) — texto completo da lição do dia (NÃO usar campo "text" que pode estar vazio)
- "bible[]" — versículos bíblicos formatados com referências ARC
- "title" — título do dia
- "date" — data

EXTRAIR VERSO ÁUREO: Está dentro do "content" (HTML). Procurar por "vers", "memor", ou "áureo" no texto extraído.

TABELA TRIMESTRES:
1º (Jan-Mar): quarterly ID = YYYY-01-pt
2º (Abr-Jun): YYYY-02-pt
3º (Jul-Set): YYYY-03-pt
4º (Out-Dez): YYYY-04-pt

MAPEAMENTO LIÇÃO ↔ SÁBADO: A lição apresentada no sábado X foi estudada na semana ANTERIOR. A lição é apresentada no sábado, não confundir com a lição que começa a ser estudada nesse mesmo dia.`,
  },

  // ─── YOUTUBE CPB — HINÁRIO 2022 ───
  {
    id: 'youtube-cpb',
    keywords: ['youtube', 'link', 'video', 'cpb', 'casa publicadora', 'playlist',
      'canal', 'youtube id', 'youtube url', 'hinario 2022 youtube',
      'letra sincronizada', 'lyrics', 'enviar link', 'membros'],
    title: 'YouTube CPB — Links Oficiais do Hinário 2022',
    text: `HINÁRIO 2022 NO YOUTUBE — CANAL OFICIAL CPB:

Todos os 600 hinos do Novo Hinário Adventista 2022 estão disponíveis no canal oficial da Casa Publicadora Brasileira (CPB) no YouTube, com vídeo de letra sincronizada (Lyrics).

Canal: @casapublicadora e @novohinario

PLAYLISTS OFICIAIS DA CPB:
Hinos 1-100: PLAPpcKnpMfeO9Fydpl1tTKC9CRRnIMMSK
Hinos 101-200: PLAPpcKnpMfeOsWzlaY0bXm1Q5pnQQxn_y
Hinos 201-300: PLAPpcKnpMfeMnCMuGcdWKVkgpi2P_sRkE
Hinos 301-400: PLAPpcKnpMfeNIrE1nk3w2OkcUdxuY6y1l
Hinos 401-500: PLAPpcKnpMfePvD6DLI-Y5TR-RVVo62s6Z
Hinos 501-600: PLAPpcKnpMfePWEOuIu4B4F3PVljyD8DoO

EXEMPLOS DE LINKS POR NÚMERO (tabela parcial — para referência rápida):
Hino 11 (Maior que Tudo): youtube.com/watch?v=hER6dGJKpqY... 
Hino 44 (Oh Vinde Contemplar): watch?v=59TTuEpZ9Po
Hino 189 (Eu Sou o Pão da Vida): watch?v=Ff6UK5aSIoI
Hino 1300 não existe — hinos vão até 600.

GERAR LINK DE HINO: O mapeamento completo (número → video_id) está em hinario-2022-youtube.json no repositório da skill. O bot não tem acesso a este arquivo em runtime — se o usuário precisar de links, orientar a consultar as playlists da CPB.

HINÁRIO 1996: NÃO tem fonte oficial completa no YouTube. Cobertura parcial. Estratégia: usar tabela de correspondência 1996→2022.

ACERVO LOUVOR JA (álbuns): Não está oficialmente no YouTube. Disponível no Spotify/Apple Music (artista: "Igreja Adventista do Sétimo Dia"). Para links de YouTube, buscar o nome da música (covers, letras animadas) — se achar, incluir; se não, omitir.`,
  },

  // ─── DIRETRIZES DE MÚSICA IASD ───
  {
    id: 'music-guidelines',
    keywords: ['diretriz', 'orientacao', 'recomendacao', 'manual da igreja',
      'regra musical', 'filosofia', 'estilo', 'ritmo', 'jazz', 'rock',
      'proibido', 'permitido', 'padrao', 'dsa', 'comissao'],
    title: 'Diretrizes Oficiais de Música nos Cultos IASD',
    text: `DIRETRIZES OFICIAIS DE MÚSICA NOS CULTOS IASD:
Fontes: Manual da Igreja 2025, Manual do Ministério da Música (DSA), Filosofia Adventista da Música (AG), Orientações DSA (voto 2005-116).

PRINCÍPIOS QUE DEVEM GUIAR TODA SUGESTÃO:
1. Hinos alinhados ao tema do sermão/lição — nunca "só porque é bonito"
2. Louvor congregacional = prioridade sobre especiais
3. Equilíbrio ritmo/melodia/harmonia — ritmo NÃO pode dominar (I Crô. 25:1,6,7)
4. Letra e melodia dizem a mesma coisa — não combinar sagrado com profano
5. Beleza, emoção e poder (Testemunhos Seletos v.1, p.457)
6. Não rebaixar para atrair pessoas — elevar o pecador a Deus
7. Variedade de estilos dentro dos padrões

O QUE EVITAR:
- Música secular ou questionável nos cultos
- Jazz, rock ou formas híbridas relacionadas
- Letras fúteis, triviais, vagas ou excessivamente sentimentais
- Amplificação exagerada — vocal ou instrumental
- Tonalidades estridentes, distorções, estilo de cantores populares
- Predominância de ritmo sobre melodia/harmonia
- Playbacks como padrão — instrumental ao vivo é estimulado

O QUE BUSCAR:
- Letra com valor literário e teológico consistente
- Música que glorifica a Deus (I Cor. 10:31)
- Progressão lógica: abertura animada → adoração → tema → encerramento reflexivo
- Equilíbrio entre hinos a Deus e cânticos de apelo/testemunho`,
  },

  // ─── ÁLBUNS JA — CATÁLOGO HISTÓRICO ───
  {
    id: 'ja-albuns-catalog',
    keywords: ['album ja', 'albuns ja', 'jovens adventistas', 'catalogo',
      '1992', '1995', '1998', '2002', '2004', '2005', '2008', '2010',
      '2014', '2017', '2019', '2020', '2024', 'adoradores', 'celebra',
      'maranata', 'diferente', 'salmos', 'desbravador', 'acustico'],
    title: 'Catálogo de Álbuns JA — Anuais e Especiais',
    text: `CATÁLOGO DE ÁLBUNS JA (Jovens Adventistas):

ÁLBUNS ANUAIS JA (série histórica):
1992, 1993, 1994, 1995, 1996, 1997, 1998-Missão, 1999, 2000, 2001,
2002-Você me Pertence, 2003, 2004-Somos Tua Voz, 2005-Fiel a Toda Prova,
2006, 2007, 2008-Vivo por Jesus, 2009-Brilha em Mim, 2010-Geração Esperança,
2011-Amigos da Esperança, 2012, 2013, 2014-A Única Esperança, 2015-Eu Sou a Mensagem,
2016, 2017-Eu Creio, 2018, 2019-Somos Tuas Mãos, 2020-Tudo por Ele,
2021, 2022, 2023, 2024-Maranata.

SÉRIE ADORADORES:
Adoradores (1), Adoradores 2, Adoradores 3, Adoradores 4, Adoradores 5.

ÁLBUNS ESPECIAIS:
Até que Ele Venha, Celebra SP, Celebra SP 2, Celebra SP 3, Diferente,
Na Presença de Deus, Magnífico Deus, Salmos, Está Escrito Vol.1,
Desbravadores e Aventureiros, Semana Santa 2023.

CORRELAÇÃO TEMA → ÁLBUM:
Amor/Graça: Adoradores, Adoradores 2, Celebra SP, 2002
Oração/Comunhão: Adoradores 3, Na Presença de Deus, Magnífico Deus
Missão/Testemunho: 1998-Missão, 2004-Somos Tua Voz, 2019-Somos Tuas Mãos
Esperança/Volta de Jesus: Até que Ele Venha, 2014-A Única Esperança, 2024-Maranata
Fé/Confiança: 2005-Fiel a Toda Prova, 2008-Vivo por Jesus, Salmos
Louvor/Adoração: Adoradores 4, Adoradores 5, Celebra SP 2 e 3
Jovens/Energia: Diferente, 2010-Geração Esperança, 2011-Amigos da Esperança
Bíblia/Palavra: Está Escrito Vol.1, 2015-Eu Sou a Mensagem
Consagração/Entrega: Adoradores 3, 2020-Tudo por Ele, 2017-Eu Creio`,
  },

  // ─── DATAS ESPECIAIS E SÁBADOS ESPECIAIS ───
  {
    id: 'special-dates',
    keywords: ['sabado especial', 'dia da crianca', 'aventureiro', 'desbravador',
      '13 sabado', 'decimo terceiro', 'semana de oracao', 'dia da biblia',
      'dia do anciao', 'ebd', 'encerramento', 'natal', 'pascoa',
      'programacao oficial', 'dsa', 'downloads adventistas'],
    title: 'Datas Especiais e Sábados Especiais IASD',
    text: `DATAS ESPECIAIS RECORRENTES NA IASD:

DIA MUNDIAL DOS AVENTUREIROS + SÁBADO DA CRIANÇA:
- Maio (3º sábado). 2026: 16/mai. Tema 2026: "Caminhando com Jesus"
- Quando crianças lideram: NÃO usar apenas hinário adulto. Cruzar com manual infantil, corinhos, materiais de Aventureiros/Desbravadores.
- Hinos alinhados: Oração (NHA 357-367), Infantil (NHA 508-557), Aventureiros (NHA 275), Desbravadores (NHA 276).

13º SÁBADO (Oferta Especial para Missões Mundiais):
- Último sábado de cada trimestre. 2026: 28/mar, 27/jun, 26/set, 26/dez
- Ofertório sugerido: NHA 313
- Hinos alinhados com missão/eternidade

SEMANA DE ORAÇÃO (Jovens): Julho
DIA DA BÍBLIA: Dezembro
DIA DO ANCIÃO: Fevereiro
DIA DA ESCOLA SABATINA: Variável

RECURSOS DSA (Divisão Sul-Americana):
Site base: https://downloads.adventistas.org/pt/
- Aventureiros: /aventureiros/logomarcas/
- Desbravadores: /desbravadores/logomarcas/
- Escola Sabatina: /escola-sabatina/
- Auxiliar ES Adultos: /escola-sabatina/manuais-e-guias/auxiliares-da-escola-sabatina-{ANO}-adultos/

INTEGRAÇÃO COM A LIÇÃO: Para sábados especiais, a ES segue a lição normal. A programação especial é para o Culto Divino. Sempre cruzar: tema do sermão especial > hinos da lição > hinos do Louvor JA.`,
  },

  // ─── AUXILIAR DA ESCOLA SABATINA ───
  {
    id: 'auxiliar-es',
    keywords: ['auxiliar', 'escola sabatina auxiliar', 'hino inicial licao',
      'hino final licao', 'manual', 'pdf auxiliar', 'licao', 'programa sugestivo',
      'diretores', 'backblaze', 'ocr'],
    title: 'Auxiliar da Escola Sabatina — Hinos por Lição',
    text: `AUXILIAR DA ESCOLA SABATINA — COMO ENCONTRAR HINOS DA LIÇÃO:

Cada lição do auxiliar contém DOIS hinos sugeridos:
- HINO INICIAL (abertura da classe)
- HINO FINAL (encerramento da classe)
Numerados conforme o Hinário Adventista 2022 (NHA).

ESTRUTURA DO AUXILIAR:
- Cada lição ocupa ~3 páginas: abertura, estudo, encerramento
- Hinos aparecem como "HINO INICIAL: Nº XXX (NHA) - Nome" e "HINO FINAL: ..."
- Localizados na seção "PROGRAMAS SUGESTIVOS PARA DIRETORES"
- Buscar pela data "N DE MÊS DE ANO" para localizar a lição correta

FONTE DO PDF (Divisão Sul-Americana):
Backblaze (direto): https://f000.backblazeb2.com/file/deptos/escolasabatina/auxiliar/{ANO}/DIVISÃO - AUXILIAR {N} TRIMESTRE {ANO}.pdf
Portal Downloads DSA: https://downloads.adventistas.org/pt/escola-sabatina/manuais-e-guias/

TABELA TRIMESTRES:
1º (Jan-Mar) = N=1, 2º (Abr-Jun) = N=2, 3º (Jul-Set) = N=3, 4º (Out-Dez) = N=4

PITFALL: Existem DOIS PDFs diferentes:
1. "Auxiliar da ES 2026 Adultos" (portal) — TEMPLATE com campos de hinos VAZIOS
2. "Auxiliar da ES Geral" (backblaze) — CONTÉM hinos preenchidos por lição

O auxiliar 2026 usa o HINÁRIO ADVENTISTA 2022 (novo hinário). Não confundir números com o 1996.

MAPEAMENTO LIÇÃO ↔ SÁBADO: A lição apresentada no sábado X foi estudada na semana ANTERIOR. Ex: Lição 7 (09-15 maio) é apresentada no sábado 16/05.`,
  },

  // ─── ARQUIVO .ja (LITURGIA EXPORTADA) ───
  {
    id: 'ja-file-format',
    keywords: ['.ja', 'arquivo ja', 'liturgia ja', 'exportar liturgia', 'importar liturgia',
      'ini', 'encoding', 'windows-1252', 'tipo musica', 'subtipo', 'hasd', 'escolha'],
    title: 'Arquivo .ja — Formato de Liturgia do LouvorJA',
    text: `ARQUIVO .JA — FORMATO DE LITURGIA EXPORTADA:

O LouvorJA exporta programações com extensão .ja via menu Arquivo > Exportar Liturgia.
Formato: INI com encoding Windows-1252.

SEÇÃO [Geral]: Lista as programações salvas com números.
Ex: 7=item_ABC;item_DEF;item_GHI (programa 7 = lista de IDs dos itens em ordem)

TIPOS DE ITEM (campo "tipo"):
- musica: Música do Louvor JA ou Hinário
- arquivo: Vídeo/arquivo externo
- anotacao: Nota/marcador (Oração, Sermão etc)

SUBTIPOS DE MÚSICA (campo "subtipo"):
- ja: Música de álbum do Louvor JA
- hasd: Hinário Adventista (clássico)
- div: Diversas / álbuns especiais
- escolha: Slot vazio — a ser escolhido

EXEMPLO DE ITEM:
[item_20231221230954865]
tipo=musica
item=Hino de abertura Escola Sabatina
musica=2081 (ID interno)
subtipo=hasd
subitem=Hino nº 344 - Confiarei (Hinário Adventista)
checked= (vazio = não usado / data = já usado)

ESTRUTURA TÍPICA DE PROGRAMAÇÃO DE SÁBADO:
Escola Sabatina: Momentos de Louvor 1 e 2 → Hino de abertura ES → [vídeos] → Hino de encerramento ES
Culto Divino: Momentos de Louvor 1 e 2 → Hino inicial → [Oração, Sermão] → Dízimos e Ofertas → Hino de saída`,
  },

  // ═══════════════════════════════════════════════════════════════
  // SEÇÃO C: CONTEÚDO DETALHADO DA CENTRAL DE AJUDA (v2.1 — de louvorja/site)
  // ═══════════════════════════════════════════════════════════════

  // ─── TECLAS DE ATALHO COMPLETAS ───
  {
    id: 'help-shortcuts-full',
    keywords: ['atalho', 'tecla', 'teclas de atalho', 'shortcut', 'esc', 'ctrl', 'f1', 'f5', 'f9',
      'seta', 'pgup', 'pgdn', 'home', 'end', 'barra de espaço', 'espaço', 'pause', 'play', 'ctrl+p',
      'ctrl+w', 'ctrl+f', 'teclado', 'atalhos do teclado'],
    title: 'Teclas de Atalho — Guia Completo',
    text: `TECLAS DE ATALHO DO LOUVORJA:

GERAL:
- ESC: Fecha a tela do segundo monitor / Fecha a música / Fecha a janela ativa
- CTRL+W: Fecha a aba atual
- CTRL+F: Abre a busca de músicas
- F1: Abre a tela de ajuda
- F5 / F9: Projeta a janela atual (quando disponível) / Projeta a música do Editor de Slides

BÍBLIA / BUSCA BÍBLICA:
- Seta Esquerda / Seta Cima / PgUp: Vai para o verso anterior
- Seta Direita / Seta Baixo / PgDn: Vai para o próximo verso

PROJEÇÃO DE MÚSICA:
- Seta Esquerda / Seta Cima / PgUp: Vai para o slide anterior
- Seta Direita / Seta Baixo / PgDn: Vai para o próximo slide
- Home: Vai para o primeiro slide
- End: Vai para o último slide
- Pause / Play / CTRL+P / Barra de Espaço: Pausa a música, ou continua se já estiver pausada

EDITOR DE SLIDES:
- Seta Esquerda / Seta Cima / PgUp: Vai para o slide anterior
- Seta Direita / Seta Baixo / PgDn: Vai para o próximo slide
- Home: Vai para o primeiro slide
- End: Vai para o último slide
- Pause / Play / CTRL+P / Barra de Espaço: Pausa a música, ou continua
- CTRL+Seta Direita / CTRL+Seta Baixo: Grava o tempo e avança o slide
- CTRL+Seta Esquerda / CTRL+Seta Cima: Grava retroativo
- F5 / F9: Projeta a música`,
  },

  // ─── TRANSMISSÃO PARA STREAMING (DETALHADO) ───
  {
    id: 'help-streaming-full',
    keywords: ['transmitir', 'transmissão', 'streaming', 'obs', 'vmix', 'ip', 'porta', 'servidor',
      'navegador', 'transmitir conteúdo', 'como transmitir', 'iniciar servidor', 'usar ip da rede',
      'objeto navegador', 'endereço de transmissão'],
    title: 'Transmissão para Streaming (OBS/VMIX) — Passo a Passo',
    text: `TRANSMITIR CONTEÚDO PARA STREAMING (OBS / VMIX):

O LouvorJA permite transmitir conteúdos para serviços de streaming como OBS e VMIX via navegador.

COMO ATIVAR:
1. Acesse o botão de Menu (canto superior esquerdo)
2. Vá até a opção "Transmitir"
3. Defina o IP e Porta (ou clique em "Usar IP da rede" para usar o IP de rede local)
4. Clique em "Iniciar Servidor"
5. Em caso de erro, tente mudar a porta

COMO USAR NO OBS/VMIX:
- Após iniciado, as letras serão transmitidas via navegador através do endereço mostrado na tela
- Copie este endereço
- Cole no programa de streaming (OBS/VMIX), inserindo um objeto Navegador (Browser Source)
- O conteúdo projetado aparecerá no streaming

OBSERVAÇÃO: O conteúdo transmitido pode ser formatado via CSS personalizado diretamente no programa de streaming.`,
  },

  // ─── BUSCA DE HINOS (DETALHADO) ───
  {
    id: 'help-hymnal-search-full',
    keywords: ['buscar hino', 'busca de hinos', 'busca hinário', 'número do hino', 'palavra hino',
      'localizar música', 'buscar por palavra', 'enter', 'duplo clique', 'slide cantado',
      'slide playback', 'slide sem áudio', 'campo de busca', 'buscar música hinário'],
    title: 'Busca de Hinos no Hinário — Guia Detalhado',
    text: `BUSCA DE HINOS NA ABA "HINÁRIO":

O campo de busca pode ser usado de duas maneiras:

1. NÚMERO DO HINO:
   - Digite o número para exibir o hino correspondente
   - Pressione ENTER para executar o hino
   - Ou dê um duplo-clique sobre ele

2. PALAVRA (NOME):
   - Digite o nome ou parte do nome do hino
   - Todos os hinos que contêm essa palavra serão listados
   - Ex: Ao digitar "Jesus", são mostrados "Nasce Jesus", "Saudai o Nome de Jesus", "Jesus é Melhor", "O Amor de Jesus", etc.

BUSCA POR LETRA DA MÚSICA:
- Use a opção "Localizar Músicas" dentro do menu "Coletâneas"

OPÇÕES DE ABERTURA DO HINO (abaixo do campo de busca):
- Slide Cantado: Abre os slides do hino com áudio cantado
- Slide Playback: Abre os slides do hino com áudio playback
- Slide Sem Áudio: Abre os slides do hino sem áudio (tempos desativados, mudança manual)`,
  },

  // ─── REPRODUÇÃO DE HINOS — TODOS OS MODOS ───
  {
    id: 'help-hymnal-playback-full',
    keywords: ['reproduzir hino', 'reprodução hinos', 'abrir hino', 'modo de abertura',
      'letra hino', 'slide cantado', 'slide playback', 'slide sem áudio', 'em sequência',
      'arquivo de áudio', 'mp3 cantado', 'mp3 playback', 'menu hino', 'tipos de reprodução'],
    title: 'Reprodução de Hinos — Todos os Modos de Abertura',
    text: `REPRODUÇÃO DE HINOS — MODOS DISPONÍVEIS NO MENU:

No menu de cada hino, é possível abrir de diversas formas:

1. LETRA: Abre uma janela apenas com a letra da música
2. SLIDE - CANTADO: Abre os slides do hino com áudio cantado (com voz)
3. SLIDE - PLAYBACK: Abre os slides do hino com áudio playback (só instrumento)
4. SLIDE - SEM ÁUDIO: Abre os slides sem áudio. Os tempos ficam desativados — o operador deve mudar de slide manualmente
5. SLIDE - EM SEQUÊNCIA: Abre o hino atual e, ao término, executa automaticamente os próximos hinos em sequência numérica
6. ARQUIVO DE ÁUDIO - CANTADO: Abre o arquivo mp3 da música cantada (sem slides)
7. ARQUIVO DE ÁUDIO - PLAYBACK: Abre o arquivo mp3 do playback da música (sem slides)

REPRODUÇÃO EM SEQUÊNCIA:
- Na aba "Hinário", selecione um hino e pressione o botão "Em Sequência"
- O hino atual será executado e, ao término, o próximo hino (n+1) será executado automaticamente
- Ex: Hino 51 executado → ao terminar, executa 52, depois 53, e assim sucessivamente`,
  },

  // ─── LOCALIZAR MÚSICAS (BUSCA AVANÇADA) ───
  {
    id: 'help-find-music-full',
    keywords: ['localizar música', 'localizar musicas', 'buscar música coletânea', 'asterisco busca',
      'curinga busca', 'busca avançada', 'wildcard', 'filtro busca', 'ícone youtube',
      'ícone pb', 'música playback ícone', 'busca por letra inicial', 'aba letra'],
    title: 'Localizar Músicas — Busca Avançada com Curingas',
    text: `LOCALIZAR MÚSICAS — BUSCA AVANÇADA:

Na tela "Localizar Músicas", digite o nome da música a ser buscada. A busca respeita os filtros escolhidos.

BUSCA COM ASTERISCO (*):
- Use asterisco para representar qualquer letra ou palavra entre os termos
- Ex: Ao buscar "Jesus * Melhor", o programa traz:
  - "Jesus é Melhor"
  - "Jesus meu Melhor Amigo"

BUSCA POR LETRA INICIAL:
- Clique na aba correspondente à letra inicial da música
- Lista todas as músicas que começam com aquela letra

ÍCONES DE IDENTIFICAÇÃO NA LISTA:
- Ícone do YouTube: Indica que é uma coletânea do YouTube (requer internet para executar)
- Ícone azul com letras "PB": Indica que a música possui playback disponível`,
  },

  // ─── LETRAS DE HINOS/MÚSICAS ───
  {
    id: 'help-lyrics-full',
    keywords: ['letra hino', 'letra música', 'obter letra', 'janela de letra', 'buscar na letra',
      'destaque vermelho', 'informações álbum', 'botão letra', 'ver letra'],
    title: 'Obtendo a Letra dos Hinos e Músicas',
    text: `OBTENDO A LETRA DOS HINOS / MÚSICAS:

- Pressione o botão "Letra" para abrir a janela de letras das músicas

NA JANELA DE LETRA:
- É possível ver as informações do(s) álbum(ns) onde a música está localizada dentro do programa
- A letra completa da música é exibida
- Há um campo de busca rápida dentro da letra
- Ao usar a busca rápida, a palavra digitada é destacada automaticamente em vermelho na letra

Isso é útil para encontrar versos específicos ou conferir a letra durante a programação.`,
  },

  // ─── COLETÂNEAS ONLINE ───
  {
    id: 'help-online-collections-full',
    keywords: ['coletânea online', 'coletâneas on-line', 'vídeos online', 'youtube coletânea',
      'canais youtube', 'atualizar canais', 'playlists online', 'vídeos personalizados',
      'executar vídeo youtube', 'internet coletânea'],
    title: 'Coletâneas On-line — YouTube e Vídeos Personalizados',
    text: `COLETÂNEAS ON-LINE:

A aba "Coletâneas On-line" permite a execução de vídeos direto do YouTube.
REQUER CONEXÃO COM A INTERNET.

RECURSOS:
- Seleção de canais pré-cadastrados para execução de vídeos on-line
- Botões de "Atualizar" permitem atualizar canais, playlists ou vídeos quando há novos conteúdos
- É possível cadastrar vídeos on-line personalizados através do botão "Vídeos Personalizados"

COMO USAR:
1. Acesse a aba "Coletâneas On-line"
2. Selecione um canal ou playlist
3. Clique sobre o vídeo desejado para executar
4. Para adicionar vídeos próprios, use "Vídeos Personalizados"`,
  },

  // ─── COLETÂNEAS PERSONALIZADAS ───
  {
    id: 'help-custom-collections-full',
    keywords: ['coletânea personalizada', 'coletâneas personalizadas', 'adicionar arquivo',
      'adicionar álbum', 'excluir coletânea', 'excluir álbum', 'colar arquivo', 'ctrl+c ctrl+v',
      'capa coletânea', 'criar playlist', 'playlist personalizada', 'excluir todas'],
    title: 'Coletâneas Personalizadas — Adicionar e Gerenciar Arquivos',
    text: `COLETÂNEAS PERSONALIZADAS:

O LouvorJA permite inserir atalhos para arquivos personalizados (músicas, vídeos, álbuns).

ADICIONANDO ARQUIVO / ÁLBUM:
1. Acesse a aba "Coletâneas Personalizadas"
2. Copie o arquivo ou diretório (CTRL+C) e cole na tela (CTRL+V)
   — OU —
   Clique no botão "Adicionar" para uma nova coletânea/arquivo
3. Um painel de adição abrirá no lado esquerdo da tela
4. Opcionalmente, escolha uma imagem como capa da coletânea
5. Para criar uma playlist, coloque o diretório do álbum (em vez do caminho de um arquivo único)

EXCLUINDO ÁLBUM/COLETÂNEA:
- Clique com o botão direito sobre a coletânea → opção "Excluir"
- IMPORTANTE: Isso exclui apenas o LINK da coletânea do Menu, NÃO exclui o arquivo físico

EXCLUIR TODAS AS COLETÂNEAS:
- Clique na seta ao lado do botão "Excluir"
- Selecione "Excluir Todas"
- Todas as coletâneas serão removidas (apenas os links, não os arquivos)`,
  },

  // ─── PLAYLIST DAS COLETÂNEAS ───
  {
    id: 'help-playlist-full',
    keywords: ['playlist coletânea', 'lista de músicas coletânea', 'projetar menu',
      'reproduzir todas', 'botões de ação música', 'ação playlist', 'abrir coletânea',
      'lista de reprodução coletânea'],
    title: 'Playlist das Coletâneas — Ações e Projeção',
    text: `PLAYLIST DAS COLETÂNEAS:

Ao clicar sobre uma coletânea nas abas "JA/Min. Música" ou "Coletâneas Diversas", abre-se uma lista com as músicas que compõem a coletânea. Clique sobre uma música para abrir o slide.

RECURSOS DA TELA:
- "Projetar Menu": Projeta a lista de músicas para o público
- "Reproduzir Todas": Reproduz todas as músicas da coletânea em sequência

BOTÕES DE AÇÃO (na frente de cada música, em ordem):
1. Abre os slides com áudio cantado
2. Abre os slides com áudio playback
3. Abre os slides sem áudio (tempos desativados, mudança manual)
4. Abre o arquivo mp3 da música cantada
5. Abre o arquivo mp3 da música playback
6. Abre uma janela com a letra da música`,
  },

  // ─── BUSCA BÍBLICA AVANÇADA ───
  {
    id: 'help-bible-search-full',
    keywords: ['busca bíblica', 'buscar passagem', 'buscar verso', 'busca bíblia',
      'asterisco bíblia', 'deus terra', 'filtros bíblia', 'passagem bíblica busca',
      'busca passagens', 'palavra na bíblia'],
    title: 'Busca Bíblica — Busca de Passagens com Curingas',
    text: `BUSCA BÍBLICA — BUSCANDO PASSAGENS:

Acesse a aba "Busca Bíblica" para buscar passagens bíblicas. Use os filtros de busca para definir os parâmetros.

BUSCA COM ASTERISCO (*):
- Use asterisco para representar qualquer letra ou palavra entre os termos
- Ex: Ao buscar "Deus*terra", o programa traz todas as passagens que tenham ambas as palavras
- Resultado exemplo: "No princípio criou Deus os céus e a terra."

EXIBINDO MÚLTIPLOS VERSOS:
Para exibir mais de um verso bíblico, coloque os versos no campo de busca:
- "1-3" → Versos de 1 a 3
- "1,3" → Versos 1 e 3
- "1-3,5" → Versos de 1 a 3, e também o 5

Após colocar os versos desejados, pressione ENTER.`,
  },

  // ─── PASSAGEM BÍBLICA ───
  {
    id: 'help-bible-passage-full',
    keywords: ['passagem bíblica', 'exibir bíblia', 'versão bíblica', 'mudar versão bíblia',
      'livro capítulo versículo', 'selecionar livro', 'barra de ferramentas bíblia',
      'verso intercalado', 'múltiplos versos tela'],
    title: 'Exibindo Passagens Bíblicas',
    text: `EXIBINDO PASSAGENS BÍBLICAS:

- Selecione o livro, capítulo e versículo para abrir a passagem bíblica
- Use a lista de versões na barra de ferramentas superior para mudar a versão bíblica

MÚLTIPLOS VERSOS:
- É possível mostrar mais de um verso bíblico ao mesmo tempo
- Também é possível exibir versos intercalados (ex: versos 1, 3 e 5)
- Use formatos como "1-3" (faixa), "1,3" (lista), ou "1-3,5" (misto)`,
  },

  // ─── FORMATAÇÃO DE CONTEÚDO ───
  {
    id: 'help-formatting-full',
    keywords: ['formatar conteúdo', 'formatação', 'mudar fonte', 'mudar cor',
      'tamanho fonte', 'imagem de fundo', 'disposição', 'painel formatar', 'restaurar formatação',
      'botão formatar', 'personalizar tela'],
    title: 'Formatação de Conteúdo — Fonte, Cor, Fundo',
    text: `FORMATAÇÃO DE CONTEÚDO:

- Clique no botão "Formatar" para formatar o conteúdo da tela
- Abre um painel lateral que permite modificar:
  - Fonte (tipo de letra)
  - Cor do texto
  - Tamanho da fonte
  - Imagem de fundo
  - Disposição/layout

RESTAURAR:
- Para restaurar a formatação original, clique no botão "Restaurar"`,
  },

  // ─── PROJEÇÃO EM OUTRO MONITOR ───
  {
    id: 'help-projection-full',
    keywords: ['projetar tela', 'outro monitor', 'monitor secundário', 'área expandida',
      'segundo monitor', 'projeção monitor', 'escolher monitor', 'menu opções monitor',
      'recolher projeção', 'tela expandida'],
    title: 'Projetando em Outro Monitor',
    text: `PROJETANDO EM OUTRO MONITOR:

- Clique no botão "Área Expandida" para projetar o conteúdo para outro monitor
- O monitor secundário pode ser definido em: Menu geral > Opções
- Se não for detectado o segundo monitor, o conteúdo é aberto no monitor principal

APÓS PROJETAR:
- O ícone será alterado, indicando que o conteúdo já está projetado
- Pressione novamente o botão para recolher o conteúdo expandido
- Ou pressione a tecla "ESC"

ESCOLHER MONITOR:
- Clique sobre a seta localizada no botão de "Área Expandida"
- Será aberto um menu para escolha do monitor
- A escolha fica registrada — ao clicar posteriormente, abre o último monitor selecionado
- Também pode ser definida no menu Opções`,
  },

  // ─── ITENS AGENDADOS ───
  {
    id: 'help-scheduled-items-full',
    keywords: ['item agendado', 'itens agendados', 'provai e vede', 'informativo missões',
      'momento saúde', 'agendar item', 'calendário item', 'categoria agendada',
      'adicionar categoria agendada', 'vincular liturgia agendado', 'programação recorrente'],
    title: 'Itens Agendados — Provai e Vede, Missões, Saúde',
    text: `ITENS AGENDADOS:

Itens agendados são aqueles que fazem parte da programação mas o conteúdo muda a cada sábado.
Exemplos: Provai e Vede, Informativo Mundial das Missões, Momentos de Saúde, entre outros.

CRIAR CATEGORIA:
- Clique em "Adicionar Categoria"
- Uma categoria será criada automaticamente
- Uma janela abrirá para alterar o nome

ADICIONAR ITENS:
1. Selecione uma categoria criada anteriormente
2. Uma tela com calendário se abrirá
3. Clique duas vezes sobre uma data do calendário
4. Escolha o arquivo que deverá ser aberto
5. O arquivo será armazenado para o dia escolhido

VINCULAR NA LITURGIA:
1. Vá na tela de Liturgia
2. Clique em "Adicionar Item"
3. Escolha o tipo "Itens Agendados"
4. Serão mostrados todos os itens cadastrados
5. Escolha o item e pressione "Adicionar"
6. Ao clicar sobre o item na liturgia, abre o item cadastrado para o DIA ATUAL

OBS: O programa NÃO possui vídeos do Provai e Vede nativamente. O usuário deve baixá-los da internet e cadastrá-los manualmente.`,
  },

  // ─── LITURGIA (DETALHADO) ───
  {
    id: 'help-liturgy-full',
    keywords: ['liturgia detalhada', 'organizar programação', 'adicionar item liturgia',
      'tipo de item liturgia', 'anotação liturgia', 'arquivo diretório liturgia',
      'categoria liturgia', 'site liturgia', 'música liturgia', 'sequência culto',
      'colar liturgia', 'cronograma culto'],
    title: 'Liturgia — Organização da Programação do Culto',
    text: `LITURGIA — ORGANIZAÇÃO DA PROGRAMAÇÃO:

A tela de Liturgia serve para organizar a sequência da programação, detalhando as respectivas músicas e arquivos que serão executados no culto.

ADICIONANDO ITENS:
- Copie o arquivo/diretório (CTRL+C) e cole na tela (CTRL+V)
- Ou clique em "Adicionar Item" para mais opções

TIPOS DE ITEM DISPONÍVEIS:
1. ANOTAÇÃO: Não possui ação ao clicar. É apenas um marcador na liturgia (ex: "Oração")
2. ARQUIVO/DIRETÓRIO: Abre um arquivo ou diretório ao clicar (vídeo, PowerPoint, etc)
3. CATEGORIA: Não possui ação. Serve apenas para separar grupos de itens visualmente
4. ITENS AGENDADOS: Mostra itens cadastrados na tela "Itens Agendados". Ao clicar, abre o item do dia atual
5. MÚSICA: Lista todas as músicas da coletânea. Pode executar uma música específica ou deixar para escolher na hora. Mostra opções de execução do slide (cantado/playback/sem áudio)
6. SITE: Permite executar um site ao clicar sobre o item`,
  },

  // ─── EDITOR DE SLIDES (DETALHADO) ───
  {
    id: 'help-slide-editor-full',
    keywords: ['editor de slides detalhado', 'criar slide', 'novo slide', 'duplicar slide',
      'excluir slide', 'dividir slide', 'mesclar slide', 'texto principal', 'texto auxiliar',
      'quebra de linha slide', 'caractere pipe', 'editar slide'],
    title: 'Editor de Slides — Criação e Edição Detalhada',
    text: `EDITOR DE SLIDES:

Permite a criação de slides para rodar dentro do próprio LouvorJA.

CAMPOS DE TEXTO:
- Texto Principal: O texto principal do slide
- Texto Auxiliar: Texto menor, de auxílio, que aparece na parte superior do texto principal

GERENCIAR SLIDES (aba "Slides"):
- NOVO SLIDE: Cria um slide em branco após o slide atual
- DUPLICAR SLIDE: Duplica o slide atual e todo seu conteúdo (texto, formatação, fundo)
- EXCLUIR SLIDE: Exclui o slide atual
- DIVIDIR SLIDE: Divide o slide atual:
  (1) Cada linha do texto gera um novo slide
  (2) O caractere "|" dentro do texto gera uma quebra de linha dentro do MESMO slide
- MESCLAR PRÓX. SLIDE: Mescla o slide atual com o seguinte, mantendo a formatação do slide atual`,
  },

  // ─── GRAVAÇÃO DE TEMPOS / INTERVALOS ───
  {
    id: 'help-timing-recording-full',
    keywords: ['gravar tempo', 'gravar intervalo', 'tempo do slide', 'sincronizar slide áudio',
      'áudio gravação', 'reproduzir slide', 'gravar e avançar', 'gravar início',
      'gravar retroativo', 'remover gravações', 'aba áudio', 'sincronização música'],
    title: 'Gravando Intervalos e Tempos dos Slides',
    text: `GRAVANDO INTERVALOS (TEMPORIZAÇÃO DE SLIDES):

Use a aba "Áudio/Gravação" do Editor de Slides para gravar os tempos.

NECESSÁRIO: O slide deve possuir áudio associado.

BOTÕES DE GRAVAÇÃO:
- REPRODUZIR: Reproduz os slides com áudio. Necessário áudio. Ao reproduzir, os botões de gravação são habilitados
- GRAVAR E AVANÇAR: Avança para o próximo slide e grava o momento atual do áudio como ponto de transição
- GRAVAR INÍCIO: Grava o início do slide atual no momento atual do áudio
- GRAVAR RETROATIVO: Retrocede um segundo e grava o início do slide (corrige imprecisões)
- REMOVER GRAVAÇÕES: Remove todos os tempos gravados de TODOS os slides

ATALHOS DE GRAVAÇÃO:
- CTRL+Seta Direita / CTRL+Seta Baixo: Grava o tempo e avança o slide
- CTRL+Seta Esquerda / CTRL+Seta Cima: Grava retroativo`,
  },

  // ─── CSS PARA STREAMING (CÓDIGOS) ───
  {
    id: 'help-css-streaming-full',
    keywords: ['css streaming', 'formatar letra obs', 'formatar letra vmix', 'css letra transmissão',
      'posicionar letra rodapé', 'tamanho fonte streaming', 'cor fonte streaming',
      'mudar fonte streaming', 'código css', 'vertical-align', 'font-size css', 'color css',
      'font-family css', 'css personalizado'],
    title: 'CSS para Streaming — Códigos Prontos para OBS/VMIX',
    text: `CSS PARA LETRA NA TRANSMISSÃO (OBS / VMIX):

Dicas de como manipular o CSS para alterar fonte, cor ou fundo do conteúdo projetado para streaming.
Se o programa permitir manipulação de CSS (como OBS com Browser Source), basta colar os códigos:

POSICIONAR A LETRA NO RODAPÉ:
  table td{vertical-align:bottom !important;}
(Para alinhar no topo, mude "bottom" para "top")

MUDAR O TAMANHO DA FONTE:
  *{font-size:50px !important;}
(Onde "50px" é o tamanho — mude para outro valor se desejar)

MUDAR A COR DA FONTE:
  *{color:red !important;}
(Onde "red" é a cor — use nome em inglês ou hexadecimal como #FFFFFF)

MUDAR A FONTE (TIPO DE LETRA):
  *{font-family:Arial !important;}
(Troque "Arial" pela fonte desejada)`,
  },

  // ─── RELAÇÃO HINÁRIOS 1996 E 2022 ───
  {
    id: 'help-hymnal-relation-full',
    keywords: ['relação hinário', 'hinário 1996 2022', 'hinos removidos', 'hinos novos',
      'comparação hinário', 'mudança hinário', 'hinário antigo novo', 'equivalência hinos',
      '230 hinos removidos', 'hinos adicionados 2022'],
    title: 'Relação entre Hinários 1996 e 2022',
    text: `RELAÇÃO DE HINOS ENTRE OS HINÁRIOS 1996 E 2022:

O LouvorJA possui tabelas de equivalência entre o Hinário Adventista 1996 e o Hinário Adventista 2022.

DISPONÍVEL NA AJUDA (4 ABAS):
1. Hinário 1996 x 2022: Encontra o número equivalente no hinário novo a partir do antigo
2. Hinário 2022 x 1996: Encontra o número equivalente no hinário antigo a partir do novo
3. Hinos Removidos: 230 hinos do hinário 1996 foram removidos no 2022
4. Hinos Novos: Hinos adicionados exclusivamente no hinário 2022

EXEMPLOS DE HINOS REMOVIDOS (1996 → não estão no 2022):
- Nº 5: Supremo Criador
- Nº 9: Prece ao Trino Deus
- Nº 19: Ao Coro dos Arcanjos
- Nº 25: Bendito Seja Deus
- Nº 51: Clara Noite
- Nº 75: Jesus Conquista
- Nº 99: Noventa e Nove Ovelhas
- Nº 102: Que Grande Amigo!
- Nº 110: Perfeita Paz
- Nº 112: Ele Vive
- Nº 146: Maranata
- Nº 168: A Última Hora
- Nº 198: O Maior Milagre

Para a lista completa de 230 hinos removidos e equivalências, consulte a tela de Ajuda > Relação de Hinos no app.`,
  },

  // ─── EXPORTAR MÚSICAS (DETALHADO) ───
  {
    id: 'help-export-full',
    keywords: ['exportar música', 'formato slja', 'arquivo slja', 'exportar slide',
      'exportar música programa', 'arquivo do programa', 'exportar para editor'],
    title: 'Exportando Músicas (Formato SLJA)',
    text: `EXPORTANDO MÚSICAS:

- Pressione o botão "Exportar Música" para exportar a música atual no formato do programa (SLJA)
- O arquivo .slja pode ser modificado posteriormente na tela "Editor de Slides"
- Este formato preserva todos os dados: texto, formatação, fundo, tempos gravados, etc

USO: Útil para backup de músicas customizadas ou compartilhamento entre instalações do LouvorJA.`,
  },

  // ─── CATEGORIAS DA AJUDA (ÍNDICE) ───
  {
    id: 'help-categories-index',
    keywords: ['central de ajuda', 'categorias ajuda', 'tópicos ajuda', 'menu ajuda',
      'o que o louvorja faz', 'recursos louvorja', 'funcionalidades louvorja',
      'guia geral', 'índice ajuda', 'tela de ajuda'],
    title: 'Central de Ajuda — Índice de Categorias',
    text: `CENTRAL DE AJUDA DO LOUVORJA — CATEGORIAS:

GERAL:
- Teclas de Atalho (ESC, CTRL+W, CTRL+F, F1, F5, F9, setas, Home, End, etc)
- Transmitir conteúdo para streaming (OBS, VMIX)

HINÁRIO:
- Busca de Hinos (por número ou palavra)
- Reprodução em sequência
- Exportar Músicas (SLJA)
- Localizar Músicas (busca avançada com asterisco)
- Letras de hinos/músicas
- Relação Hinários 1996 x 2022
- Reprodução de Hinos (7 modos: letra, cantado, playback, sem áudio, sequência, mp3 cantado, mp3 playback)

COLETÂNEAS:
- Coletâneas On-line (YouTube)
- Coletâneas Personalizadas (arquivos próprios)
- Playlist das Coletâneas (projetar menu, reproduzir todas)

BÍBLIA:
- Busca Bíblica (com asterisco)
- Exibir múltiplos versos
- Exibindo Passagens
- Formatação de conteúdo
- Projeção em outro monitor

UTILITÁRIOS:
- Provai e Vede (cadastro manual)
- Itens Agendados
- Liturgia (programação do culto)
- Formatação
- Projeção

EDITOR DE SLIDES:
- Editor de Slides (criar, duplicar, excluir, dividir, mesclar)
- Gravando intervalos/tempos

TRANSMISSÃO:
- Estilos CSS para letra
- CSS para streaming (códigos prontos)
- Como transmitir no OBS/VMIX

PERGUNTAS FREQUENTES:
- Como colocar Provai e Vede
- Como exibir mais de um verso
- Como formatar letra no OBS/VMIX
- Como reproduzir hinos em sequência
- Como transmitir streaming`,
  },

  // ─── INTERNACIONALIZAÇÃO ES (RESUMO AJUDA) ───
  {
    id: 'help-i18n-es',
    keywords: ['español ayuda', 'ayuda español', 'spanish help', 'atajos español',
      'teclas de atajo', 'transmitir español', 'búsqueda himnos español',
      'diapositivas español', 'liturgia español', 'colecciones español',
      'biblia español', 'editor diapositivas español'],
    title: 'Soporte multilíngue — Español',
    text: `SOPORTE EN ESPAÑOL — LOUVORJA:

El LouvorJA está disponible también en español. La central de ayuda incluye traducciones completas.

TERMINOLOGÍA PT → ES:
- Hinário → Hinario
- Slides → Diapositivas
- Coletâneas → Colecciones
- Busca Bíblica → Búsqueda Bíblica
- Itens Agendados → Elementos Agendados
- Editor de Slides → Editor de Diapositivas
- Gravar tempos → Grabar intervalos
- Área Expandida → Área Expandida
- Letra → Letra
- Playback → Playback
- Sem áudio → Sin audio
- Em sequência → En secuencia
- Adicionar → Agregar
- Excluir → Eliminar
- Projetar → Proyectar
- Localizar Músicas → Localizar Músicas

TECLAS DE ATAJO (ES):
- ESC: Cierra la pantalla del segundo monitor
- CTRL+W: Cierra la pestaña actual
- CTRL+F: Abre la búsqueda de música
- F1: Abre la pantalla de ayuda
- F5/F9: Proyecta la ventana actual / la música del Editor

NOTA: Cuando respondas en español, usa la terminología española consistente.`,
  },

  // ═══════════════════════════════════════════════════════════════
  // SEÇÃO D: CONTEÚDO DA CENTRAL DE AJUDA + INSIGHTS DA COMUNIDADE (v2.2)
  // Extraído de louvorja.com.br/ajuda (componentes Vue) + grupo dev Telegram
  // ═══════════════════════════════════════════════════════════════

  // ─── CORRESPONDÊNCIA HINÁRIO 1996 → 2022 (de HymnalRelation.vue) ───
  {
    id: 'hinario-correspondencia',
    keywords: ['hinário 1996', 'hinário 2022', 'correspondência', 'mudança', 'hino removido',
      'hino novo', 'revisão', 'qual hino', 'tabela', '1996', '2022', 'antigo hinário',
      'novo hinário', 'mudou de número', 'hino mudou', 'hino não existe'],
    title: 'Correspondência Hinário 1996 → 2022 — Mudanças',
    text: `CORRESPONDÊNCIA HINÁRIO ADVENTISTA 1996 → 2022

O hinário foi revisado em 2022. LouvorJA suporta AMBOS.

MUDANÇAS DE POSIÇÃO PRINCIPAIS:
- Hino 1 "O Deus de Amor" (1996) → Hino 8 (2022)
- Hino 18 "Santo! Santo! Santo!" → AGORA É O HINO 1 (2022): "Santo, Santo, Santo!"
- Hino 14 "Jubilosos Te Adoramos" → Hino 5
- Hino 17 "Nós Te Adoramos" → Hino 6
- Hino 31 "Sublime Amor" → Hino 16
- Hino 35 "Tu És Fiel, Senhor" → Hino 15
- Hino 33 "Castelo Forte" → Hino 73
- Hino 34 "Quão Grande És Tu" → Hino 62

HINOS COM NOME ALTERADO:
- Hino 40: "Filhos do Pai Celeste" → "Deus É Nosso Pai Celeste"
- Hino 71: "Saudai o Nome de Jesus (1)" → "Com Glória Coroai" (Hino 27)
- Hino 72: "Saudai o Nome de Jesus (2)" → "Saudai O Nome De Jesus" (Hino 26)
- Hino 73: "Rei dos Reis" → Hino 24

HINOS REMOVIDOS NO 2022 (não existem mais):
5, 9, 19, 25, 29, 37, 38, 39, 51, 55, 56, 57, 67, 68, 75, 78, 79, 80, 81, 82, 84, 87, 89, 99, 102, 107, 108, 110, 112, 114, 116, 118, 121, 125, 128, 129 — e aproximadamente 100 mais do intervalo 131-610 (total ~230 removidos).

220 HINOS NOVOS NO 2022:
Incluem: Hino 11 "Maior Que Tudo", Hino 20 "Grande É O Senhor", Hino 32 "Brilha Jesus", Hino 33 "A Esperança É Jesus", Hino 34 "Precioso Nome", Hino 35 "Ele É Exaltado", Hino 47 "Cheios Do Espírito", Hino 54 "Unidos Pela Palavra", Hino 55 "Tua Palavra", Hino 68 "Restaura", Hino 76 "Vencedor Cada Dia", Hino 112 "Cordeiro De Deus", Hino 275 "Hino Dos Aventureiros", Hino 276 "Hino Dos Desbravadores".

ORIGEM DOS HINOS NOVOS: CD Jovem (1992-2014), Coletânea Adoradores 1 e 2, Coletânea Original.

Quando um usuário não encontra um hino pelo número antigo, explique que ele pode ter mudado de posição ou sido removido na revisão de 2022.`,
  },

  // ─── CSS PARA SLIDES (de TemplatesCSS.vue) ───
  {
    id: 'templates-css-personalizados',
    keywords: ['css', 'template', 'personalizar slide', 'customizar', 'formatação',
      'cor de fundo', 'fonte', 'tamanho da fonte', 'bebas neue', 'gradiente',
      'estilo do slide', 'aparência', 'template css', 'código css'],
    title: 'Templates CSS para Personalização de Slides',
    text: `PERSONALIZAÇÃO DE SLIDES COM CSS NO LOUVORJA

LouvorJA permite personalizar totalmente a aparência dos slides de projeção usando CSS customizado.

TEMPLATE 1 — BEBAS NEUE (FONTE GRANDE):
- Fonte: 'Bebas Neue Regular', sans-serif (75px)
- Letter-spacing: 0.03em
- Text-shadow: black 0.1em 0.1em 0.3em
- Fundo transparente (rgba 0,0,0,0)
- Alinhamento vertical inferior (flex-end)
- A fonte Bebas Neue Regular pode ser baixada em /fonts/BebasNeue-Regular.ttf

TEMPLATE 2 — GRADIENTE COLORIDO:
- Fonte: 'Open Sans' ou Verdana (30px)
- Background: gradiente linear multi-cor
  linear-gradient(to right, #751ab6c2, #247980b6, #899207b7, #69bfb6b9, #7f1e928a)
- Border-radius: 5%
- Padding: 10px 40px
- Cor do texto: #FFFFFF
- Font-weight: bold
- Flexbox centralizado

COMO O CSS FUNCIONA NO LOUVORJA:
- O seletor * afeta TODOS os elementos do slide
- A classe .quadro controla a caixa de letra do hino
- Cada slide recebe um $uuid único que isola os estilos
- O CSS é processado linha por linha e prefixado com o ID único do slide
- table td controla o alinhamento vertical da tabela de letras`,
  },

  // ─── GERAÇÃO DE LITURGIA VIA IA (insight do Diego — grupo dev) ───
  {
    id: 'liturgia-json-ia',
    keywords: ['liturgia', 'json da liturgia', 'gerar liturgia', 'automatizar',
      'configurar culto', 'programação do culto', 'responsável pelo culto',
      'sugestão de hinos', 'selecionar hinos', 'links do youtube', 'mensagem congregação',
      'lição da escola sabatina', 'hinos iniciais', 'hinos finais', 'ocr'],
    title: 'Geração de Liturgia e Sugestão de Hinos via IA',
    text: `GERAÇÃO DE LITURGIA E SUGESTÃO DE HINOS VIA IA

O LouvorJ.AI pode ajudar a planejar toda a liturgia do culto:

COMO FUNCIONA:
1. O responsável pelo culto interage com o bot no chat
2. Informa a data, a lição da Escola Sabatina e temas especiais
3. O bot sugere hinos (iniciais, finais, intermediários, ofertório)
4. O responsável ajusta conforme preferência
5. O bot gera DUAS saídas:

SAÍDA 1 — EQUIPE MULTIMÍDIA (JSON técnico):
- Formato JSON para importar diretamente no LouvorJA
- Inclui: número dos hinos, ordem, links de playbacks

SAÍDA 2 — CONGREGAÇÃO (mensagem para WhatsApp/Telegram):
- Formato legível com data e tema
- Ex: "📅 18/07/2026 — Lição 3: Unidade em Cristo"
- Links dos vídeos do YouTube para os irmãos escutarem
- Aviso de programação invertida quando aplicável

FLUXO DE USO REAL (dos próprios usuários):
- No início da semana: o responsável envia a seleção de músicas
- Os irmãos escutam durante a semana para aprender a letra
- No sábado: chegam com o louvor "na ponta da língua"
- Princípio: "não há hinos de estimação" — rotatividade no repertório

SUGESTÃO DE HINOS BASEADA NA LIÇÃO:
- O bot cruza o tema da lição com o catálogo de hinos
- Extrai hinos iniciais (HI) e finais (HF) do manual da Escola Sabatina
- Aplica graduação emocional: Louvor da ES = acolhedor/animado; Culto Divino = solene/reflexivo
- HI e HF do Culto Divino são definidos pelo PREGADOR (marcar como "definido pelo orador")
- Ofertório padrão: "Quero Ofertar" — Saída padrão: NHA 600 "Em Paz Eu Vou"`,
  },

  // ─── PROBLEMAS CONHECIDOS (do grupo de suporte/dev) ───
  {
    id: 'problemas-conhecidos',
    keywords: ['problema', 'erro', 'bug', 'travou', 'não funciona', 'fecha sozinho',
      'monitores invertidos', 'ordem dos monitores', 'tela de download', 'acento',
      'utf-8', 'sorteio', 'node', 'versão do node', 'nvm'],
    title: 'Problemas Conhecidos e Soluções',
    text: `PROBLEMAS CONHECIDOS DO LOUVORJA E SOLUÇÕES

1. ORDEM DOS MONITORES INVERTIDA (Windows):
- Após atualização, o app pode inverter a ordem dos monitores (o que era 1 vira 2)
- Não é bug — é o comportamento do programa (não segue a ordem do Windows)
- Solução: inverter manualmente nas configurações do LouvorJA

2. MÚSICA FECHA AO TOCAR ATÉ O FIM:
- Comportamento NORMAL do programa (não é erro)
- A música fecha automaticamente quando termina

3. TELA DE DOWNLOAD TRAVA APÓS BAIXAR:
- Após baixar arquivos, a tela pode travar sem botão de sair
- Solução temporária: fechar via Gerenciador de Tarefas
- Reabrindo o app volta ao normal

4. ACENTOS EM SORTEIO (UTF-8):
- Resolvido nas versões recentes (exe atualizado)
- Se persistir, baixe a versão mais recente

5. TRANSFERIR MÚSICAS PARA OUTRO PC:
- Copie a pasta "config" para um pendrive
- Cole no diretório de instalação do LouvorJA no PC de destino
- Permite baixar músicas em casa (internet melhor) e levar para a igreja

6. DESENVOLVIMENTO (para devs):
- Node.js >= 20 recomendado (use nvm para gerenciar versões)
- yarn install pode falhar com dependências; use npm install
- Versão Electron em desenvolvimento ativo (Elias)`,
  },

// ─── CATÁLOGO OFICIAL HINÁRIO ADVENTISTA 2022 (600 hinos da API LouvorJA) ───
  {
    id: 'hinario-2022-1-100',
    title: 'Hinário Adventista 2022 — Hinos 1 a 100',
    keywords: ['hino 1', 'hino 100', 'hinário 2022', 'catálogo', 'número do hino', 'qual hino', 'sugestão de hino'],
    text: `CATÁLOGO OFICIAL HINÁRIO ADVENTISTA 2022 — HINOS 1 A 100:

1: Santo, Santo, Santo!
2: Ó Adorai o Senhor
3: O Deus Eterno Reina
4: Louvor ao Trino Deus
5: Jubilosos Te Adoramos
6: Nós Te Adoramos
7: Sejas Louvado
8: Ó Deus de Amor
9: Santo, Santo, Pai Bondoso
10: O Senhor Está Aqui
11: Maior que Tudo
12: Vinde, Povo do Senhor
13: Louvamos-Te, ó Deus
14: Louvemos o Rei
15: Tu És Fiel, Senhor
16: Sublime Amor
17: Deus é Nosso Pai Amado
18: Deus é Nosso Pai Celeste
19: A Deus demos Glória
20: Grande é o Senhor
21: Eu Te Amo, ó Deus
22: A Ti Toda Glória
23: Louvai a Cristo
24: Rei dos Reis
25: Jesus, Sempre Te Amo
26: Saudai o Nome de Jesus
27: Com Glória Coroai
28: Lindo És, Meu Mestre
29: O Amor de Jesus
30: Sempre Vencendo
31: Jesus, Tu És a Minha Vida
32: Brilha, Jesus
33: A Esperança é Jesus
34: Precioso Nome
35: Ele é Exaltado
36: Por Seu Imenso Amor
37: Cristo
38: A Ti Rendemos Glórias
39: Glórias ao Rei de Amor
40: Concede-nos o Espírito
41: Chuvas de Bênçãos
42: Vive em Mim
43: Vem, Santo Espírito, Agora
44: O Santo Espírito
45: Suave Espírito
46: Dia de Chuva
47: Cheios do Espírito
48: O Poder do Espírito
49: Que Firme Alicerce!
50: Alicerce Seguro
51: Dá-me a Bíblia
52: Novas de Amor e Vida
53: Que Diz a Bíblia?
54: Unidos Pela Palavra
55: Tua Palavra
56: Nossa Inspiração
57: A Palavra do Senhor
58: O Pão da Vida
59: Por Belezas Naturais
60: Ao Deus de Abraão Louvai
61: Vós, Criaturas do Senhor
62: Quão Grande És Tu
63: O Mundo é de Meu Deus
64: Vaso Novo
65: Das Mãos do Criador
66: Não Há Outro Igual a Você
67: Restaura em Mim
68: Restaura
69: Obrigado, Bom Pai
70: A Real Bandeira
71: Vitória em Cristo
72: Firme nas Promessas
73: Castelo Forte
74: Grande Comandante
75: Fé é a Vitória
76: Vencedor Cada Dia
77: Ó Cristãos, Avante!
78: Um Vencedor
79: Noite de Paz
80: Soou em Meio à Noite Azul
81: Surgem Anjos Proclamando
82: Num Berço de Palha
83: Canção da Manjedoura
84: Ó Vinde, Adoremos
85: Estrela de Luz
86: Nasce Jesus
87: Belém, Bendita És
88: Cristo Nasceu
89: Natal, Feliz Natal!
90: Glória ao Rei que Vos Nasceu
91: Ó Noite Santa!
92: Onde Estavam?
93: Nasceu o Salvador
94: Vestido em Linho
95: Amor Que Por Amor Desceste
96: Foi Amor
97: Por Que Me Amou Assim?
98: Conta-me a História de Cristo
99: Conta-me a Velha História
100: A Doce História

REGRA: Use APENAS estes números e nomes exatos. NUNCA invente títulos.`,
  },
  {
    id: 'hinario-2022-101-200',
    title: 'Hinário Adventista 2022 — Hinos 101 a 200',
    keywords: ['hino 101', 'hino 200', 'hinário 2022', 'catálogo', 'número do hino', 'qual hino', 'sugestão de hino'],
    text: `CATÁLOGO OFICIAL HINÁRIO ADVENTISTA 2022 — HINOS 101 A 200:

101: Seu Maravilhoso Olhar
102: Ó Vem, Emanuel!
103: Rude Cruz
104: Na Senda do Calvário
105: Oh, Fronte Ensanguentada!
106: Cristo no Horto
107: Na Cruz Morri Por Ti
108: Foi Por Você Também
109: Houve Alguém
110: Monte do Calvário
111: Ao Ver a Cruz
112: Cordeiro de Deus
113: 'Stavas Lá?
114: Cristo Já Ressuscitou
115: Preciosa Graça
116: Maravilhosa Graça
117: Infinita Graça
118: Imenso Amor
119: Graça de Deus
120: Graça
121: Por Um Pecador Qual Eu
122: Só um Passo
123: Seu Sangue Tem Poder
124: Deixa a Luz do Céu Entrar
125: A Terna voz do Salvador
126: Foge Para o monte
127: Vida em Olhar
128: Se Tu Buscares a Jesus
129: Deixa Entrar o Rei da Glória
130: Jesus Está Esperando
131: Manso e Suave
132: Pra Quem Nada Tem
133: Ó Vem, Aflito Coração
134: Junto à Cruz
135: Vinde às Águas
136: Quero Estar ao Pé da Cruz
137: Pai, Eu me Achego a Ti
138: Tal Qual Estou
139: Sou de Jesus Agora
140: Ao Pé da Cruz de Cristo
141: Cristo Tocou-me
142: Perdão, Poder e Paz
143: Ao Olhar pra Cruz
144: Foi na Cruz
145: É Jesus o Salvador
146: Eu Não Sou Mais Eu
147: Jesus me Transformou
148: Jesus Achou-me
149: Pedras
150: Ó Jesus, Habita em mim
151: Amor Glorioso
152: A Voz de Jesus
153: O Que Penso de Meu Mestre
154: Alvo Mais que a Neve
155: Meu Cálice Transborda
156: Remido
157: Jesus me Remiu
158: Creio em Milagres
159: Um Novo Nome Lá na Glória
160: Crescendo em Graça
161: Salva-me Também
162: Sou de Jesus
163: Para o Céu Por Jesus Irei
164: Meu Nome em Suas Mãos
165: Hoje sou Feliz
166: Caminhando
167: Mui Triste Eu Andava
168: Eu Achei
169: Salvo em Jesus
170: Oh, Que Belo Hino Deus me Deu!
171: Com Cristo no Meu Coração
172: Ando Sempre Alegre
173: Que Prazer é Ser de Cristo
174: Que Consolo e Paz!
175: De Ti Careço, ó Deus
176: Nunca Desanimes
177: Conduze-me, Meu Mestre
178: Deus Cuidará de Ti
179: Eu Sei em Quem Eu Creio
180: Nunca te Deixarei
181: Cuidará de Mim Também
182: Eu Pertenço ao Meu Rei
183: Oh, Não temas, Sou Contigo
184: Quero Ter Jesus Comigo
185: Cada Momento
186: Ó Mestre, o Mar se Revolta
187: Refúgio em Temporal
188: Minha Esperança
189: Deus Sabe, Deus Ouve, Deus Vê
190: Pertenço a Cristo
191: Olha com Fé Para Cima
192: Brilho Celeste
193: Sob Suas Asas
194: Tem Fé em Deus
195: Minha Fé bem Segura Está
196: Ao Jesus me Tomar a Mão
197: Sou Feliz Com Jesus
198: Deus Vos Guarde
199: Ao Passares pelas Águas
200: Nunca Me Deixar

REGRA: Use APENAS estes números e nomes exatos. NUNCA invente títulos.`,
  },
  {
    id: 'hinario-2022-201-300',
    title: 'Hinário Adventista 2022 — Hinos 201 a 300',
    keywords: ['hino 201', 'hino 300', 'hinário 2022', 'catálogo', 'número do hino', 'qual hino', 'sugestão de hino'],
    text: `CATÁLOGO OFICIAL HINÁRIO ADVENTISTA 2022 — HINOS 201 A 300:

201: Dia a Dia
202: Não Ando Só
203: Abrigo na Rocha
204: Meu Divino Protetor
205: Ergo Os Meus Olhos
206: Fixa Teus Olhos No Mestre
207: Confiei No Meu Senhor
208: Confia em Deus
209: Todas As Coisas Contribuem
210: Sempre Confiante
211: Jesus Meu Guia É
212: Bendita Segurança
213: Não Me Esqueci De Ti
214: Não Há O Que Temer
215: A Única Saída
216: Pode Cair o Mundo
217: Fé Dos Nossos Pais
218: Ouve-nos, Pastor Divino
219: Da Igreja o Fundamento
220: Fortalece Tua Igreja
221: Somos Igreja
222: Somos Um Pequeno Povo
223: Há Um Dever
224: Mensagem Ao Mundo
225: Dai-nos Luz
226: Cristo Nos Conclama
227: Se Cristo For Comigo
228: Onde Quer Que Seja
229: Trabalho Cristão
230: Ao Mundo Vou Contar
231: Trabalhar e Orar
232: Jesus Precisa De Ti
233: Brilha Por Cristo Em Teu Viver
234: Hoje Ajuda a Alguém
235: Somos Teus, Senhor
236: Transbordando Em Amor
237: A Colheita
238: Oração Pela Missão
239: Geração Esperança
240: Brilhar Por Ti
241: A Todo Semelhante Meu
242: Benditos Laços
243: Jesus, Pastor Amado
244: Ó Vem à Igreja Comigo
245: Lado a Lado
246: Em Família
247: Unidos Em Cristo
248: Encontros
249: Oh, Que Belos Hinos!
250: A Jesus Seguir Eu Quero
251: Meu Jesus Está Chamando
252: Volto ao Lar
253: Importa Renascer
254: Agora Posso Ver
255: As Águas Batismais
256: A Ceia do Senhor
257: Senhor, Tu nos Convidas
258: A Última Ceia
259: Em Memória De Ti
260: Em Memória De Mim
261: Quem se Dispõe a Ir?
262: Irei Aonde Jesus Mandar
263: Mãos
264: Envio A Ti
265: Faz-me Um Servo
266: No Serviço do Meu Rei
267: As Searas Maduras
268: Compensa Servir a Jesus
269: Sal da Terra
270: Vaso de Benção
271: Vaso De Honra
272: Através De Nós
273: A Escola Sabatina
274: O Encontro
275: Hino Dos Aventureiros
276: Hino Dos Desbravadores
277: Bem-aventurança
278: A Voz de Deus
279: A Verdade Brilhará
280: O Espírito De Profecia
281: Filhos Da Promessa
282: Em Sua Presença
283: Crer e Observar
284: Obedecer É Melhor
285: Eu Amo A Tua Lei
286: Tua Lei
287: A Lei De Deus
288: Fiel a Toda Prova
289: A Tua Lei
290: Do Santo Sábado És Senhor
291: Sábado do Meu Senhor
292: Sábado
293: O Sábado Chegou
294: Lembre-se do Sábado
295: Sábado Bendito
296: Bem-vindo o Sábado
297: Dia de Esperança
298: Deus Fez o Sábado Para Mim
299: Dia Santo
300: Tempo de Ser Santo

REGRA: Use APENAS estes números e nomes exatos. NUNCA invente títulos.`,
  },
  {
    id: 'hinario-2022-301-400',
    title: 'Hinário Adventista 2022 — Hinos 301 a 400',
    keywords: ['hino 301', 'hino 400', 'hinário 2022', 'catálogo', 'número do hino', 'qual hino', 'sugestão de hino',
      // Hinos específicos desse range que usuários buscam pelo nome
      'quero ofertar', 'ofertório', 'mordomia', 'toma meu coração', 'tudo entregarei'],
    text: `CATÁLOGO OFICIAL HINÁRIO ADVENTISTA 2022 — HINOS 301 A 400:

301: Toma, ó Deus, Meu Coração
302: Tudo Entregarei
303: Minha Entrega
304: Que Te Darei, Meu Mestre?
305: Sobre o Altar
306: Eis-nos Prontos
307: Conta as Bênçãos
308: Faze Como Daniel
309: Em Tuas Mãos
310: Entrega
311: Inteiramente Fiel
312: Nas Tuas Mãos
313: Tudo Para Deus
314: Se Ele Não For O Primeiro
315: A Cristo Eu Amo
316: Achei Um Grande Amigo
317: Amigo Mui Precioso
318: Cantarei de Meu Jesus
319: Cristo é Tudo Para Mim
320: Eu Te Amo, Meu Mestre
321: Jesus é Melhor
322: Jesus Me Guia
323: Há um Amigo
324: Jesus, Teu Nome Satisfaz
325: Junto ao Bondoso Deus
326: Manancial de Toda Bênção
327: Não Há Amigo Igual A Cristo
328: Meu Deus e Eu
329: Não Há Nome Mais Amável
330: O Melhor Amigo
331: Nome Precioso
332: Tudo És Pra Mim
333: Oh! Que Amigo em Cristo Temos
334: Oh, Eu Amo A Cristo!
335: Precioso é Jesus Para Mim
336: Salmo Dos Salmos
337: Amor nos Faz Contentes
338: Deus Não se Cansa de Amar
339: Eu Sou Um Pobre Peregrino
340: Sou Forasteiro Aqui
341: Mágoas
342: Eu Não Te Deixarei
343: Meu Refúgio Está no Monte
344: Confiarei
345: Novo Dia Chegará
346: Como Agradecer
347: Obrigado
348: Graças
349: Gratidão
350: Senhor Jesus, Muito Obrigado
351: Jesus, Muito Obrigado
352: Luz Bendita, Luz Gloriosa
353: É Prazer Servir a Cristo
354: Paz
355: Sempre Alegre
356: Tenho um Hino em Meu Coração
357: Bendita Hora de Oração
358: Só, Com Teu Deus
359: Lugar De Paz
360: Deus Ouve, Deus Responde
361: Deus Nos Ouvirá
362: O Melhor Lugar do Mundo
363: O Jardim de Oração
364: Que Tempo Já faz?
365: Santa Hora de Oração
366: No Jardim
367: Falar com Deus
368: Ao Teu Lado Quero Andar
369: Seguindo a Jesus
370: Bem Junto a Cristo
371: Cada Vez Mais Puro
372: Abre, Senhor, Os Olhos Meus
373: Deixa-me Contigo Andar
374: Contigo, Ó Deus, Almejo Andar
375: Canção Da Vida
376: Cristo, Dá-nos Tua Paz
377: Mais de Cristo
378: Mais Perto Quero Estar
379: Fala à Minh'Alma
380: Sonda-me, ó Deus
381: Teu Divinal Amor
382: Minha Oração
383: Em Mim Vem Habitar
384: O Teu Querer
385: Música Celeste
386: Abre Meus Olhos
387: Jesus, Não Eu
388: Sê Minha Vida
389: Minha Cruz
390: Pegadas
391: Queremos Dar Louvor
392: Ser Igual a Cristo
393: Vem Comigo Habitar
394: De Hoje em Diante
395: Vem Brilhar
396: Vem Brilhar em Mim
397: Eu Só Quero Estar Onde Estás
398: Pai, Vive Em Mim
399: O Céu é Jesus
400: Mais Semelhante A Jesus

REGRA: Use APENAS estes números e nomes exatos. NUNCA invente títulos.`,
  },
  {
    id: 'hinario-2022-401-500',
    title: 'Hinário Adventista 2022 — Hinos 401 a 500',
    keywords: ['hino 401', 'hino 500', 'hinário 2022', 'catálogo', 'número do hino', 'qual hino', 'sugestão de hino'],
    text: `CATÁLOGO OFICIAL HINÁRIO ADVENTISTA 2022 — HINOS 401 A 500:

401: Quero Ter Jesus
402: Perto de Jesus
403: Renova-me
404: Sempre de Jesus
405: Vem, Ó Senhor
406: Pés Na Terra, Olhos No Céu
407: O Poder do Amor
408: Abençoa Este Lar
409: Amor no Lar
410: Vem Entre Nós Morar
411: Bem de Manhã
412: Bem Cedinho Sempre Busco
413: Vigiar e Orar
414: Desponta o Sol
415: Luzes da Aurora
416: Surge a Alvorada
417: Perto do Lar
418: Finda o Dia
419: Prece Vespertina
420: Hora Feliz do Pôr-do-Sol
421: Oração Para Uma Criança
422: Presente de Valor
423: Não os Impeçais
424: Canção Para Meu Bebê
425: Ouço o Clamor do Bom Pastor
426: Cristo Ama as Criancinhas
427: Venham, Crianças
428: Joias Preciosas
429: Quando o Livro Aberto For
430: O Juízo
431: Vem o Grande Dia
432: Sangue Precioso De Cristo
433: Sumo Sacerdote
434: Santuário
435: Acima do Céu
436: E Me Fareis Um Santuário
437: Chegou a hora
438: Quando For Chamado
439: Quando Deus Fizer Chamada
440: Breve Jesus Voltará
441: Vencendo Vem Jesus
442: Jesus Voltará
443: Cristo Virá Outra Vez
444: Oh! Que Esperança!
445: O Rei Já Perto Está
446: Cristo Vem
447: Vigiai, Cristãos
448: Nós O Veremos
449: Quando o Rei Vier
450: Guarda, Vê se Muito Falta
451: Grande Alegria
452: Cristo Não Tarda a Voltar
453: Anunciai Pelas Montanhas
454: A Manhã Gloriosa
455: Verei Jesus
456: Bela Manhã
457: Jesus Vem Logo
458: Não Tardará
459: Cada Dia Mais Perto
460: Decidi Olhar Pra O Amanhã
461: Jesus Precisa Voltar
462: Será de Manhã?
463: Espero a Manhã Gloriosa
464: Não Desistir
465: O Dia Não Sei
466: Um Pouco Mais
467: Até Quando?
468: Quase no Lar
469: Enquanto Ele Não Vem
470: Rocha Eterna
471: Porque Ele Vive
472: Ó Alegrai-vos, Filhos De Sião
473: Morte e Ressurreição
474: Eu Espero
475: Se Não Houver Amanhã
476: Hei de Ver
477: Face a Face
478: Sim, Glória Haverá No Final
479: Herdeiro Do Reino
480: O Eterno Lar
481: No Celeste Lar Glorioso
482: Junto ao Rio Jordão
483: Vamos Ver Jesus Ali
484: Além do Céu Azul
485: Estrelas Terei
486: Até Então
487: Primeiro Quero Ver Meu Salvador
488: Eu vou para o Céu
489: Cristo Foi Preparar Um Lugar
490: Tão Grato Me é Lembrar
491: Há um Rio Cristalino
492: Lar Feliz
493: Almejo o Lar
494: Doce Lar
495: Glória Perene
496: Além do Rio
497: Inda é Longe Canaã?
498: Lindo País
499: Mansão Sobre o Monte
500: Oh, Nunca Separar!

REGRA: Use APENAS estes números e nomes exatos. NUNCA invente títulos.`,
  },
  {
    id: 'hinario-2022-501-599',
    title: 'Hinário Adventista 2022 — Hinos 501 a 599',
    keywords: ['hino 501', 'hino 599', 'hinário 2022', 'catálogo', 'número do hino', 'qual hino', 'sugestão de hino'],
    text: `CATÁLOGO OFICIAL HINÁRIO ADVENTISTA 2022 — HINOS 501 A 599:

501: Para Além das Montanhas
502: Saudade
503: Vale Do Éden Formoso
504: Mais Perto Desse Lar
505: Muito Além do Sol
506: Eu Não Preciso Mais Sonhar
507: Jamais se Diz Adeus Ali
508: Cristo Fez Tudo Muito Bom
509: A Criação
510: Aquarela Do Senhor
511: Eu Sou Uma Obra de Arte
512: Cada Dia
513: Ver Jesus Em Você
514: Fruto da Criação
515: Sabe Quantas Estrelinhas?
516: Grande Artista
517: Meu Deus É Tão Grande
518: O Dia Em Que Deus Criou o Mundo
519: O Amigo do Coração
520: Cristo é o Número Um
521: O Espírito Santo
522: Eu Quero Esse Poder
523: Sim, Cristo me Ama
524: Jesus Me Quer Bem
525: Deus Sempre me Ama
526: Quem Orou Três Vezes?
527: Aonde Quer Que Eu Vá
528: Quando Estou Com Medo
529: Se Deus É Por Nós
530: Lâmpada Para os Meus Pés
531: A Bíblia
532: Louvem a Jesus
533: Louvai-O
534: Eu Digo Não
535: Santa Lei De Deus
536: São Dez Os Mandamentos
537: Sábado, O Dia Mais Feliz
538: Dia Especial
539: Deus Mandou O Sol Brilhar
540: Quero Bem Alegre Obedecer
541: Cria Em Mim, Ó Deus
542: Vem, Ó Jesus
543: É Bom Ter Jesus No Coração
544: Entrega Teu Caminho Ao Senhor
545: Sou Feliz
546: Quero Servir a Jesus
547: Eu Sei Por Que Nasci
548: O Milagre Da Vida
549: Eu Sou Importante
550: Deus Tem Um Plano Pra Mim
551: Minha Pequenina Luz
552: Meus Talentos Vou Usar
553: Minha Vida É Uma Viagem
554: Sou Aventureiro
555: Um Lugar Feliz É O Céu
556: Lá No Céu
557: O Céu
558: O Senhor Está Em Seu Templo
559: Sinto A Presença Do Senhor
560: A Glória da Tua Presença
561: Santo Somente É O Senhor
562: Santo És, Senhor
563: Sua Glória
564: Vamos Adorar
565: Adoração
566: Oh, Adorai
567: Introito
568: Invocação
569: Nosso Maravilhoso Deus
570: Maravilhoso Deus
571: Tu És Digno
572: Ofertório
573: Venho Te Adorar
574: Teu É Nosso Coração
575: Entrego A Ti
576: Humildade e Gratidão
577: Quero Me Entregar
578: Humilde Oração
579: Ao Orarmos, Senhor
580: Oração de Súplica
581: Ouve-nos, Senhor
582: Pai, Venho A Ti
583: Entregamos Em Tuas Mãos
584: Prece de Gratidão
585: Vem, Espírito Santo
586: Venham Todos
587: Chegou a Hora de Adorar ao Senhor - A
587: Chegou a Hora de Adorar ao Senhor - B
588: Deixai Vir a Mim os Pequeninos
589: Fala, Senhor
590: Queremos Te Pedir, Senhor
591: Estejas Conosco
592: Graça, Amor e Comunhão
593: Amigo, Não Saia Sem Cristo
594: Bênção Final
595: A Bênção
596: Vem, Senhor
597: Santo Lugar
598: Que Deus Te Abençoe!
599: Que O Senhor Nos Abençoe!

REGRA: Use APENAS estes números e nomes exatos. NUNCA invente títulos.`,
  },
  // ─── TEMPLATES LITÚRGICOS POR TIPO DE CULTO (prioridade máxima) ───
  {
    id: 'templates-liturgia-cultos',
    keywords: ['batismo', 'santa ceia', 'ceia do senhor', 'pés', 'lavapés', 'casamento',
      'dedicação de criança', 'agradecimento', 'funeral', 'sepultamento', 'consagração',
      'evangelismo', 'reavivamento', 'missões', 'mordomia', 'tipo de culto', 'liturgia específica',
      'programação especial', 'culto especial', 'ordem do culto', 'sequência do culto'],
    title: 'Templates Litúrgicos por Tipo de Culto IASD',
    text: `TEMPLATES LITÚRGICOS POR TIPO DE CULTO — USAR SEMPRE QUE O USUÁRIO PEDIR HINOS PARA UM TIPO ESPECÍFICO DE CULTO

IMPORTANTE: Quando o usuário pedir "hinos para culto de batismo", "hinos para santa ceia", etc., NUNCA sugira a liturgia genérica de sábado. Use o template específico abaixo.

═══ CULTO DE BATISMO ═══
ESTRUTURA:
1. Louvor inicial (alegre, acolhedor) — hinos sobre nova vida, transformação
2. Boas-vindas e oração
3. Escola Sabatina (se aplicável)
4. Mensagem musical especial (tema: entrega, decisão)
5. Sermon breve: o batismo e seus significados
6. HINO ANTES DO BATISMO (solenidade): hinos sobre batismo, água, lava-se, purificação
7. Batismo
8. HINO PÓS-BATISMO (alegria, nova vida): hinos sobre renascimento, redenção
9. Boas-vindas aos novos membros
10. Bênção final

HINOS SUGERIDOS PARA BATISMO (Hinário 2022) — USE APENAS ESTES NÚMEROS E NOMES:
- Antes do batismo (solenidade/decisão): 250 - A Jesus Seguir | 253 - Importa Renascer
- Momento do batismo: 173 - Que Prazer | 179 - Eu Sei Em Quem Creio | 208 - Confia Em Deus
- Pós-batismo (nova vida/alegria): 250 - A Jesus Seguir | 253 - Importa Renascer | 222 - Somos Um Pequeno Povo
- NÃO invente títulos. Se não tem o nome aqui, NÃO SUGIRA.

═══ SANTA CEIA / LAVAPÉS ═══
ESTRUTURA:
1. Prelúdio (instrumental ou hino solene sobre a cruz)
2. Louvor inicial
3. Leitura bíblica (João 13 ou 1 Coríntios 11)
4. HINO antes do lavapés: hinos sobre serviço, humildade
5. Lavapés
6. HINO solene antes da ceia: hinos sobre a cruz, sacrifício, sangue
7. Ceia (pão e vinho)
8. HINO reflexivo pós-ceia: gratidão, redenção
9. Bênção

HINOS SUGERIDOS PARA SANTA CEIA (Hinário 2022) — USE APENAS ESTES NÚMEROS E NOMES:
- Seção SANTA CEIA (256-260): 256 - A Ceia Do Senhor | 259 - Em Memória De Ti
- Seção PAIXÃO/CRUZ (92-114): 103 - Rude Cruz | 114 - Cristo Já Ressuscitou
- Seção SALVAÇÃO (115-172): 115 - Preciosa Graça | 118 - Imenso Amor | 131 - Manso E Suave | 140 - Ao Pé Da Cruz | 154 - Alvo Mais Que A Neve
- NÃO invente títulos. Se não tem o nome aqui, NÃO SUGIRA.

═══ CASAMENTO ═══
ESTRUTURA:
1. Entrada da noiva (solene, instrumental ou hino sobre amor/aliança)
2. Boas-vindas
3. Leitura e mensagem
4. Troca de votos
5. Bênção
6. Saída do casal (alegre)

HINOS SUGERIDOS PARA CASAMENTO (Hinário 2022) — USE APENAS ESTES NÚMEROS E NOMES:
- Seção FAMÍLIA (408-428): 408 - Abençoa Este Lar | 411 - Bem De Manhã | 420 - Hora Feliz Do Pôr Do Sol
- Seção UNIDADE (242-248): 246 - Em Família
- NÃO invente títulos. Se não tem o nome aqui, NÃO SUGIRA.

═══ DEDICAÇÃO DE CRIANÇA ═══
HINOS SUGERIDOS (Hinário 2022) — USE APENAS ESTES NÚMEROS E NOMES:
- Seção INFANTIS (508-557): 509 - Criação | 511 - Eu Sou Uma Obra De Arte | 523 - Sim Cristo Me Ama | 537 - Sábado O Dia Mais Feliz | 544 - Entrega Teu Caminho
- Seção DONS (261-276): 275 - Hino dos Aventureiros | 276 - Hino dos Desbravadores
- NÃO invente títulos. Se não tem o nome aqui, NÃO SUGIRA.

═══ CULTO DE AGRADECIMENTO ═══
HINOS SUGERIDOS (Hinário 2022) — USE APENAS ESTES NÚMEROS E NOMES:
- Seção MORDOMIA (300-314): 301 - Toma Meu Coração | 302 - Tudo Entregarei | 307 - Conta As Bênçãos
- Seção CONDUTA (315-407): 355 - Sempre Alegre | 375 - Canção da Vida
- NÃO invente títulos. Se não tem o nome aqui, NÃO SUGIRA.

═══ CULTO DE EVANGELISMO/REAVIVAMENTO ═══
HINOS SUGERIDOS (Hinário 2022) — USE APENAS ESTES NÚMEROS E NOMES:
- Seção MISSÃO (223-241): 229 - Trabalho Cristão | 232 - Jesus Precisa De Ti | 233 - Brilha Por Cristo
- Seção 2ª VINDA (440-469): 440 - Breve Jesus Voltará | 441 - Vencendo Vem Jesus | 444 - Oh Que Esperança
- NÃO invente títulos. Se não tem o nome aqui, NÃO SUGIRA.

REGRA CRÍTICA DE ANTI-ALUCINAÇÃO: QUANDO SUGERIR HINOS, USE EXCLUSIVAMENTE OS NÚMEROS E NOMES LISTADOS ACIMA. NUNCA INVENTE UM NOME DE HINO. Se precisa de mais hinos e não tem na lista, diga "Consulte o Hinário 2022 na seção [X-Y] para mais opções sobre [tema]". SEMPRE informe: número, nome, e seção do hinário. NUNCA invente títulos.`,
  },

  // ─── CONTATOS E CANAIS OFICIAIS ───
  {
    id: 'contatos-oficiais',
    keywords: ['contato', 'suporte', 'ajuda', 'telegram', 'whatsapp', 'doação',
      'doar', 'contato', 'email', 'mayco', 'michael', 'grupo de suporte',
      'grupo de desenvolvedores', 'reportar bug', 'sugestão'],
    title: 'Contatos e Canais Oficiais LouvorJA',
    text: `CONTATOS E CANAIS OFICIAIS LOUVORJA

SUPORTE AO USUÁRIO (NÃO use o grupo de devs para isso):
- Telegram: louvorja.com.br/telegram
- WhatsApp: louvorja.com.br/whatsapp
- Central de Ajuda: louvorja.com.br/ajuda

GRUPO DE DESENVOLVEDORES (apenas programação):
- Separado do grupo de suporte
- Discute bugs de código, features, homologação de versões
- Não é para dúvidas de uso comum

DOAÇÕES:
- louvorja.com.br/doacao
- Ajuda com custos de servidores e manutenção

SITE OFICIAL: https://louvorja.com.br
DOWNLOAD: louvorja.com.br/download

EQUIPE:
- Mayco/Michael (@maycorolbuche): desenvolvedor principal e mantenedor
- Diego: ícones, QR code controle remoto
- Victor: cronômetro e melhorias de interface`,
  },

  // ─── LITURGIA PERSONALIZADA — EXEMPLOS DE INPUT DO USUÁRIO ───
  {
    id: 'liturgia-personalizada-exemplos',
    keywords: ['minha liturgia', 'montar liturgia', 'planejar culto', 'quero montar',
      'momentos do culto', 'quantos hinos', 'ordem do culto', 'programação do culto',
      'assunto do culto', 'tema do culto', 'liturgia personalizada', 'descrever liturgia',
      'entrada', 'louvor inicial', 'louvor final', 'mensagem musical', 'saída'],
    title: 'Liturgia Personalizada — Como Receber a Liturgia do Usuário',
    text: `LITURGIA PERSONALIZADA — RECEBENDO A LITURGIA DO USUÁRIO

O LouvorJA ainda NÃO tem um módulo de liturgia. O usuário deve DESCREVER sua liturgia no chat e o bot sugere os hinos.

EXEMPLOS DE COMO O USUÁRIO PODE DESCREVER:

EXEMPLO 1 (simples):
"Sábado normal, lição sobre missões. Preciso de 4 hinos: entrada, louvor, ofertório e saída."
→ Sugira 4 hinos temáticos (missões) + ofertório padrão + saída NHA 600.

EXEMPLO 2 (detalhado):
"Culto de gratidão. Tenho: entrada, 2 louvores, momento especial (crianças), mensagem, resposta, saída. 6 hinos total. Tema: gratidão pela colheita."
→ Sugira 6 hinos específicos para cada momento, com graduação emocional.

EXEMPLO 3 (tipo específico):
"Culto de batismo, 3 candidatos. Preciso de hinos antes e depois do batismo."
→ Use o template de batismo (hinos 174, 205, 210 antes; 182, 186 pós).

EXEMPLO 4 (com restrições):
"Tenho que usar só hinos do hinário 2022, nada de CDs. Culto de santa ceia, 5 hinos."
→ Use apenas números do Hinário 2022, template de santa ceia.

EXEMPLO 5 (sem informações):
"Me ajuda a escolher hinos pro sábado."
→ INICIE o fluxo interativo: pergunte tipo de culto, tema, quantos hinos, momentos.

FLUXO RECOMENDADO QUANDO FALTAM INFORMAÇÕES:
1. Tipo de culto (normal, batismo, ceia, etc.)
2. Data e tema/lição
3. Quantidade de hinos e momentos
4. Restrições (só hinário, incluir CDs, etc.)
5. Hinos já definidos pelo pregador

REGRAS PARA SUGESTÕES PERSONALIZADAS:
- Respeite a GRADUAÇÃO EMOCIONAL: início animado, meio reflexivo, fim solene/esperançoso
- Cruze sempre o TEMA informado com os títulos dos hinos
- Se o usuário disser "tenho HI e HF definidos", NÃO sugira substitutos — complete os espaços
- Ofereça variações: "Se preferir algo mais animado, troque o 440 pelo 460"
- Ao final, ofereça gerar o JSON para importar no LouvorJA`,
  },
];

/**
 * Search the RAG knowledge base for chunks relevant to the user query.
 * Uses token-level keyword matching with TF scoring.
 *
 * @param {string} query - The user's question/message
 * @param {number} maxChunks - Maximum chunks to return (default: 5)
 * @returns {string} Formatted context string to inject into LLM system prompt
 */
export function searchRAG(query, maxChunks = 5, filterPrefix = null) {
  if (!query || typeof query !== 'string') return '';

  const queryLower = query.toLowerCase();
  const queryTokens = queryLower.split(/\s+/).filter(t => t.length > 2);

  // Score each chunk
  let chunksToSearch = CHUNKS;
  if (filterPrefix) {
    chunksToSearch = CHUNKS.filter(c => c.id && c.id.startsWith(filterPrefix));
  }

  const scored = chunksToSearch.map(chunk => {
    const textLower = chunk.text.toLowerCase();
    let score = 0;

    // 1. Exact keyword match (high weight)
    for (const kw of chunk.keywords) {
      if (queryLower.includes(kw.toLowerCase())) {
        score += 3;
      }
    }

    // 2. Token overlap in chunk text
    for (const token of queryTokens) {
      if (textLower.includes(token)) {
        score += 1;
      }
      // Also check keywords for partial token match
      for (const kw of chunk.keywords) {
        if (kw.toLowerCase().includes(token)) {
          score += 0.5;
        }
      }
    }

    return { ...chunk, score };
  });

  // Sort by score descending, take top N
  const topChunks = scored
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);

  if (topChunks.length === 0) return '';

  // Format context for injection
  const contextBlocks = topChunks.map(c => `[${c.title}]\n${c.text}`).join('\n\n');
  return contextBlocks;
}

/**
 * Build the full system prompt with RAG context injected.
 * v2.2 — Enhanced with liturgical domain rules, anti-hallucination, Help Center content,
 *         community insights, and liturgy generation capabilities.
 *
 * @param {string} query - User's current message
 * @param {string} lang - Language string (e.g. "português brasileiro")
 * @returns {string} Complete system prompt with context
 */
export function buildSystemPrompt(query, lang) {
  // RAG normal: busca templates litúrgicos, help center, etc.
  const ragContext = searchRAG(query, 5);

  // Busca catálogo de hinos RELEVANTE à query (não todo, senão estoura limite de tokens)
  // Cada chunk cobre 100 hinos; retornamos só os relevantes ao tema
  const catalogoRelevante = searchRAG(query + ' hinário hino número sugestão', 2, 'hinario-2022-');

  let prompt = `Você é o assistente virtual do LouvorJA, um app de gestão musical e litúrgica para a Igreja Adventista do Sétimo Dia.
Você é especialista em: funcionalidades do app (busca, projeção, transmissão, atalhos, editor de slides, liturgia), hinário adventista (1996 e 2022 — incluindo correspondências e mudanças), sugestão de hinos para culto, estrutura litúrgica IASD, diretrizes musicais adventistas, personalização CSS de slides, problemas conhecidos e soluções, e geração de liturgia via IA.

REGRAS FUNDAMENTAIS:
- Responda em ${lang}
- Seja conciso e útil
- Conhece o LouvorJA: busca de músicas, hinário adventista (1996 e 2022), projeção, transmissão OBS/VMIX, atalhos de teclado, liturgia, slides, CSS personalizado, exportação (SLJA/PDF/MP3)
- Pode ajudar a PLANEJAR A LITURGIA COMPLETA do culto, sugerir hinos baseados na lição, e gerar JSON para importar no programa

ANTI-ALUCINAÇÃO (CRÍTICO — ESTA É A REGRA MAIS IMPORTANTE):
- NUNCA INVENTE números de hinos ou nomes de músicas. Esta é a regra nº 1.
- Você SÓ PODE sugerir hinos cujo número E nome aparecem LITERALMENTE no CONTEXTO fornecido abaixo.
- Se o contexto diz "BATISMO (249-255): A Jesus Seguir (250), Importa Renascer (253)", você SÓ pode sugerir 250 e 253 com esses nomes exatos.
- Se o contexto não tem o nome de um hino, NÃO SUGIRA. Diga: "Consulte o Hinário 2022 seção [X-Y] para mais opções."
- É MELHOR dizer "não tenho essa informação" do que inventar um nome.
- Hinos que NÃO EXISTEM e causam alucinação frequente: "Desponta e Brilha", "Tudo por Ti", "Consagração" (não é título de hino do 2022), "Segue-Me a Mim" (o correto é 90 - Segue-me, na seção NATAL).
- PROIBIDO USAR MARKDOWN. Não use *, **, ##, -, nem nenhum símbolo de markdown.
- Para listas, use uma linha por item SEM asterisco nem hífen (ex: "440 - Breve Jesus Voltará").
- Para ênfase use <strong>texto</strong>. Para quebra de linha use <br>.

SUGESTÃO DE HINOS (quando aplicável):
- Aplique a regra de GRADUAÇÃO EMOCIONAL: Momentos de Louvor da ES são acolhedores/animados; Momentos de Louvor do CD são solenes/reflexivos.
- SEMPRE cruze o tema da lição do dia com os hinos sugeridos.
- HI e HF do Culto Divino são definidos pelo PREGADOR — marque como "definido pelo orador" quando não informado.
- Ofertório padrão: "Quero Ofertar" — nunca alterar.
- Saída padrão: NHA 600 "Em Paz Eu Vou".
- Varie álbuns — não repetir o mesmo álbum mais de 2x na mesma programação.
- PRIORIDADE MÁXIMA: Se o usuário mencionar um TIPO ESPECÍFICO DE CULTO (batismo, santa ceia, casamento, dedicação de criança, etc.), use SEMPRE o template litúrgico correspondente do conhecimento fornecido. NUNCA responda com a liturgia genérica de sábado quando o usuário pedir um tipo específico de culto.

MODO LITURGIA PERSONALIZADA (interativo):
- Quando o usuário pedir sugestões de hinos sem especificar o tipo de culto, OU quando quiser montar a liturgia completa, INICIE O FLUXO INTERATIVO abaixo.
- Faça UMA pergunta por vez. Espere a resposta antes de prosseguir.
FLUXO:
1. Pergunte: "Que tipo de culto você está planejando? (ex: sábado normal, batismo, santa ceia, casamento, dedicação de criança, agradecimento, evangelismo)"
2. Pergunte: "Qual a data do culto e o tema/lição da Escola Sabatina?"
3. Pergunte: "Quantos hinos você precisa e em quais momentos? (ex: entrada, louvor inicial, ofertório, mensagem musical, louvor final, saída)"
4. Pergunte: "Tem algum hino já definido pelo pregador ou grupo musical?"
5. Com base nas respostas, sugira hinos ESPECÍFICOS para CADA momento, numerados, com nome e Hinário 2022.
6. Ao final, pergunte: "Quer que eu gere o JSON dessa liturgia para importar no LouvorJA?"
- Se o usuário já descrever a liturgia completa na primeira mensagem (ex: "tenho culto de batismo, preciso de 5 hinos, tema é nova vida em Cristo"), pule as perguntas e sugira direto.

INTERNACIONALIZAÇÃO:
- Se o usuário perguntar em espanhol, TRADUZA os nomes dos hinos e músicas para espanhol. Não deixe títulos em português.
- Exemplos: "Breve Jesus Voltará" → "Pronto Jesús Volverá", "Vencendo Vem Jesus" → "Vencedor Viene Jesús"

Se não souber, diga honestamente e sugira contato via louvorja.com`;

  if (ragContext) {
    prompt += `\n\nCONHECIMENTO ESPECÍFICO DO LOUVORJA (use estes dados para responder com precisão):\n\n${ragContext}`;
  }

  // SEMPRE injetar catálogo oficial de hinos — o LLM SÓ PODE sugerir hinos desta lista
  if (catalogoRelevante) {
    prompt += `\n\n═══ CATÁLOGO OFICIAL HINÁRIO ADVENTISTA 2022 ═══\nEsta é uma seleção do Hinário Adventista 2022.\nAO SUGERIR HINOS, VOCÊ DEVE:\n1. Consultar esta lista\n2. Usar SOMENTE números e títulos EXATOS desta lista\n3. NUNCA inventar, modificar ou adaptar títulos\n4. SEMPRE incluir o número e o nome completo exatamente como aparecem aqui\n5. SEMPRE mencionar "(Hinário Adventista 2022)" ao sugerir\n\n${catalogoRelevante}\n═══ FIM DO CATÁLOGO ═══`;
  }

  return prompt;
}

export default { searchRAG, buildSystemPrompt };
