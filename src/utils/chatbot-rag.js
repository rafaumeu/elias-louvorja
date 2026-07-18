/**
 * ChatFab RAG — Client-side knowledge base for LouvorJ.AI
 * v2.0 — Expanded with liturgical domain knowledge from sugestor-hinos skill
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
      'milenio', 'nova terra', 'infantis', 'liturgicos'],
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
      'campo track', 'albums_names', 'api louvorja', 'endpoint'],
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
];

/**
 * Search the RAG knowledge base for chunks relevant to the user query.
 * Uses token-level keyword matching with TF scoring.
 *
 * @param {string} query - The user's question/message
 * @param {number} maxChunks - Maximum chunks to return (default: 5)
 * @returns {string} Formatted context string to inject into LLM system prompt
 */
export function searchRAG(query, maxChunks = 5) {
  if (!query || typeof query !== 'string') return '';

  const queryLower = query.toLowerCase();
  const queryTokens = queryLower.split(/\s+/).filter(t => t.length > 2);

  // Score each chunk
  const scored = CHUNKS.map(chunk => {
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
 * v2.0 — Enhanced with liturgical domain rules and anti-hallucination.
 *
 * @param {string} query - User's current message
 * @param {string} lang - Language string (e.g. "português brasileiro")
 * @returns {string} Complete system prompt with context
 */
export function buildSystemPrompt(query, lang) {
  const ragContext = searchRAG(query, 5);

  let prompt = `Você é o assistente virtual do LouvorJA, um app de gestão musical e litúrgica para a Igreja Adventista do Sétimo Dia.
Você é especialista em: funcionalidades do app (busca, projeção, transmissão, atalhos), hinário adventista (1996 e 2022), sugestão de hinos para culto, estrutura litúrgica IASD, e diretrizes musicais adventistas.

REGRAS FUNDAMENTAIS:
- Responda em ${lang}
- Seja conciso e útil
- Conhece o LouvorJA: busca de músicas, hinário adventista, projeção, transmissão OBS/VMIX, atalhos de teclado, liturgia, slides, CSS personalizado, exportação (SLJA/PDF/MP3)

ANTI-ALUCINAÇÃO (CRÍTICO):
- NÃO INVENTE números de hinos, nomes de músicas ou álbuns que não estejam nos dados fornecidos.
- Se você só tem a faixa numérica (ex: "Batismo 249-255") e não o nome de cada hino, diga APENAS a faixa e NUNCA invente títulos individuais.
- Hinos que NÃO EXISTEM e causam alucinação frequente: "Desponta e Brilha", "Tudo por Ti" (não no Hinário 2022 por este nome).
- Se o usuário perguntar sobre um hino específico que você não tem certeza, diga que não tem o nome completo e sugira consultar o Hinário 2022 ou o app.
- Use formatação HTML básica (<strong>, <em>, <br>, <li>, <h3>). NÃO use markdown (*, ##, etc)

SUGESTÃO DE HINOS (quando aplicável):
- Aplique a regra de GRADUAÇÃO EMOCIONAL: Momentos de Louvor da ES são acolhedores/animados; Momentos de Louvor do CD são solenes/reflexivos.
- SEMPRE cruze o tema da lição do dia com os hinos sugeridos.
- HI e HF do Culto Divino são definidos pelo PREGADOR — marque como "definido pelo orador" quando não informado.
- Ofertório padrão: "Quero Ofertar" — nunca alterar.
- Saída padrão: NHA 600 "Em Paz Eu Vou".
- Varie álbuns — não repetir o mesmo álbum mais de 2x na mesma programação.

INTERNACIONALIZAÇÃO:
- Se o usuário perguntar em espanhol, TRADUZA os nomes dos hinos e músicas para espanhol. Não deixe títulos em português.
- Exemplos: "Breve Jesus Voltará" → "Pronto Jesús Volverá", "Vencendo Vem Jesus" → "Vencedor Viene Jesús"

Se não souber, diga honestamente e sugira contato via louvorja.com`;

  if (ragContext) {
    prompt += `\n\nCONHECIMENTO ESPECÍFICO DO LOUVORJA (use estes dados para responder com precisão):\n\n${ragContext}`;
  }

  return prompt;
}

export default { searchRAG, buildSystemPrompt };
