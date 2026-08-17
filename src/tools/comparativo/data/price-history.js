const PRICE_HISTORY = {
  "San Vito": {
   datas: ["2025-02","2026-03","2026-04","2026-05","2026-06","2026-07","2026-08"],
   fontes: ["Tabela válida até 28/02/2025","Tabela válida até 30/03/2026","Tabela válida até 30/04/2026","Tabela válida até 31/05/2026","Tabela válida até 30/06/2026","Tabela válida até 31/07/2026","Tabela vigente em ago/2026"],
   obs: "Tabela de preço fechado, sem indexação — cada mudança de valor aqui é decisão da HR Sul, não índice. São sete levantamentos, mas com um vão de 13 meses entre fev/2025 e mar/2026, e é dentro desse vão que todo o movimento de preço aconteceu: de março a agosto de 2026 nenhum dos nove valores mudou um real em seis tabelas seguidas. Ou seja, as datas exatas dos reajustes não são determináveis com o material disponível. E o movimento não foi uniforme — é essa a leitura do empreendimento. O apto 402, o maior tipo do bloco com 125,95 m², subiu 8,20% (R$ 915.000 → R$ 990.000). Já o 403 e o 404 CAÍRAM 5,80% cada, R$ 40.000 a menos (R$ 690.000 → R$ 650.000): são as duas únicas quedas de preço registradas neste empreendimento. As configurações de vaga não mudaram entre as duas épocas — a tabela de fev/2025 já trazia duas vagas no 402 (77-78), três no 1701 e duas no 1704 —, então isso é preço mesmo, não troca de pacote como aconteceu no Ed. Toulouse. O apto 1304 saiu da tabela de mar a jun/2026 e voltou em jul/2026 a R$ 590.000, 2,61% acima dos R$ 575.000 de fev/2025; daí o intervalo em branco na linha dele. O 1404, o 1701 e o 1704 estão com o mesmo preço há 18 meses. O estoque encolheu forte: a tabela de fev/2025 trazia 39 unidades com preço, a de ago/2026 tem 9, mais 6 reservadas. Sobre a entrega: a tabela de fev/2025 informava dez/2027, e as tabelas de 2026 deixaram de trazer essa linha — o card usa jul/2027, que não vem de nenhuma dessas tabelas e precisa ser confirmado com a HR Sul.",
   unidades: {
    "402": [915000,990000,990000,990000,990000,990000,990000],
    "403": [690000,650000,650000,650000,650000,650000,650000],
    "404": [690000,650000,650000,650000,650000,650000,650000],
    "1204": [566000,585000,585000,585000,585000,585000,585000],
    "1304": [575000,null,null,null,null,590000,590000],
    "1404": [595000,595000,595000,595000,595000,595000,595000],
    "1503": [622000,630000,630000,630000,630000,630000,630000],
    "1701": [2199000,2199000,2199000,2199000,2199000,2199000,2199000],
    "1704": [1745000,1745000,1745000,1745000,1745000,1745000,1745000]
   }
  },
  "Ed. Toulouse": {
   datas: ["2025-06","2025-09","2025-11","2025-12","2026-04","2026-06","2026-07"],
   fontes: ["Tabela jun/2025 · Rev. 44 (23/06/2025)","Tabela set/2025 – Rev. 48 (01/09)","Tabela nov/2025 – Rev. 50 (04/11)","Tabela dez/2025 – Rev. 55 (03/12)","Tabela abr/2026 – Rev. 61 (02/04)","Tabela jun/2026 – Rev. 66 (22/06)","Tabela jul/2026 (03/07/2026)"],
   obs: "Tabela de preço fechado: o total não é indexado ao CUB (só as parcelas são corrigidas), então cada mudança de valor aqui é decisão de preço da Speranzini, não índice. ATENÇÃO na leitura da alta de 1,4%: os R$ 10.000 que separam R$ 709.000 de R$ 719.000 não são reajuste, são troca de vaga. Até a Rev. 55 (dez/2025) a tabela dizia \"preço dos apartamentos com vaga dupla\" e cobrava exatamente R$ 10.000 a mais para trocar por duas vagas simples; da Rev. 61 (abr/2026) em diante o preço passou a ser o das duas vagas simples. Em igualdade de configuração, o preço do 103 e do 104 está congelado desde junho de 2025 — 13 meses. O que endureceu de verdade foi a entrada, que quase dobrou: R$ 90.000 até set/2025, R$ 110.000 em nov/2025, R$ 150.000 em abr/2026 e R$ 170.000 desde a Rev. 66; junto disso o parcelamento encurtou de 75x para 60x em 22/06/2026 e os reforços desapareceram (eram dois de R$ 38.000 em 2025, virou um de R$ 50.000, depois nenhum). Ou seja: mesmo preço, muito mais caixa antecipado. A entrega em novembro/2026 é a única coisa que não mudou nas sete revisões. O estoque encolheu de 7 unidades em jun/2025 para 2: saíram 504, 604, 704, 804 e 902. O apto 902 repetiu o padrão de distrato com reprecificação: saiu a R$ 805.000 em jun/2025, voltou a R$ 830.000 em nov/2025 (+3,11%) e foi vendido antes de abr/2026. Há duas revisões em junho/2026 — a 65 (11/06) e a 66 (22/06); a série usa a 66 porque os totais são idênticos nas duas e só a condição de pagamento muda. Não há tabela de out/2025 nem de jan a mar/2026 e mai/2026.",
   unidades: {
    "103": [709000,709000,709000,709000,719000,719000,719000],
    "104": [760000,760000,760000,760000,770000,770000,770000]
   }
  },
  "Alameda Giardini": {
   datas: ["2025-01","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06","2026-07","2026-08"],
   fontes: ["Tabela jan/2025 · CUB R$ 2.887,91","Tabela jan/2026 · CUB R$ 3.012,64","Tabela fev/2026 · CUB R$ 3.019,26","Tabela mar/2026 · CUB R$ 3.028,45","Tabela abr/2026 · CUB R$ 3.037,72","Tabela mai/2026 · CUB R$ 3.064,10 (Semana 1)","Tabela jun/2026 · CUB R$ 3.096,25 (Semana 1)","Tabela jul/2026 · CUB R$ 3.121,62 (Semana 1)","Tabela ago/2026 · CUB R$ 3.151,24 (Semana 2)"],
   obs: "Dezenove meses de série, com um salto de jan/2025 para jan/2026 porque não há tabela intermediária. A base é o total da condição principal, que é comparável em todos os meses (sempre CUBs × CUB do mês), mesmo tendo mudado de 60x para 24x no caminho. As duas unidades contam histórias opostas. O apto 401 ficou em 951 CUBs nos nove levantamentos: os +9,12% nominais são exatamente a alta do CUB (R$ 2.887,91 → R$ 3.151,24), ou seja, reprecificação real zero em 19 meses. O apto 701 é o oposto e o único caso de reprecificação real registrado até agora na ferramenta: estava disponível a 968 CUBs em jan/2025, saiu da tabela de jan/2026 a mai/2026 e voltou em jun/2026 a 1.028 CUBs — +6,20% acima da inflação do CUB. Somando índice e reprecificação, o 701 subiu 15,88% nominais contra 9,12% do 401. O intervalo em branco na linha do 701 é essa ausência. O apto 901 também foi reprecificado antes de vender, de 977 para 985 CUBs (+0,82%), e consta como vendido desde fev/2026 — não entra na série porque não está mais disponível. O empreendimento está perto de esgotar: a tabela de jan/2025 trazia 12 unidades, entre elas o garden 301, os duplex 1101 e 1201 e a cobertura 1301 (1.500 CUBs, R$ 4.331.865,00), e hoje restam duas. Também mudaram, fora do preço: o parcelamento encurtou de 60x para 24x em mar/2026 (e a condição alternativa de 36x virou 12x, depois desapareceu em mai/2026), e o juro pós-chaves subiu de INPC + 0,30% a.m. para 0,45% em abril e 0,75% em maio.",
   unidades: {
    "401": [2746402.41,2865020.64,2871316.26,2880055.95,2888871.72,2913959.1,2944533.75,2968660.62,2996829.24],
    "701": [2795496.88,null,null,null,null,null,3182945,3209025.36,3239474.72]
   }
  },
  "Lisbon": {
   datas: ["2026-04","2026-05","2026-06","2026-07","2026-08"],
   fontes: ["Tabela abr/2026 · CUB R$ 3.037,72","Tabela mai/2026 · CUB R$ 3.064,10","Tabela jun/2026 – CUB R$ 3.096,25","Tabela jul/2026 – CUB R$ 3.121,62","Tabela ago/2026 – CUB R$ 3.151,24"],
   obs: "Série de nove unidades em cinco tabelas mensais consecutivas, sem lacuna. Os valores subiram 3,74% de abril a agosto, mas isso é apenas a indexação do CUB (R$ 3.037,72 → R$ 3.151,24): a contagem de CUBs de cada unidade não mudou uma vez em cinco meses, então a Idea Quattro não reprecificou nenhum apartamento no período — todos os 45 pontos da série conferem como CUB inteiro. A disponibilidade também ficou parada: as mesmas 9 unidades à venda e as mesmas 5 vendidas (502, 601, 701, 902 e cobertura 1001) de abril a agosto. A série usa o total da condição de 60x, a mesma base dos cards. Três mudanças reais aconteceram fora do preço em CUB: (1) abril era PRÉ-LANÇAMENTO, com desconto de 12% no 36x e de 20% nos aptos 602 e 901; de maio em diante virou LANÇAMENTO com 10% para todos, ou seja, quem compra em 36x paga mais agora — o 602 e o 901 encareceram cerca de 12,5% nessa condição; (2) o juro pós-chaves subiu de INPC + 0,45% a.m. em abril para INPC + 0,75% a.m. de maio em diante; (3) a entrega prevista era dezembro/2028 nas tabelas de abril a julho e passou para julho/2029 na de agosto. A cobertura 1002 manteve desconto de 5% no 36x em todos os meses.",
   unidades: {
    "401": [2339044.4,2359357,2384112.5,2403647.4,2426454.8],
    "402": [2764325.2,2788331,2817587.5,2840674.2,2867628.4],
    "501": [1807443.4,1823139.5,1842268.75,1857363.9,1874987.8],
    "602": [1822632,1838460,1857750,1872972,1890744],
    "702": [1843896.04,1859908.7,1879423.75,1894823.34,1912802.68],
    "801": [1704160.92,1718960.1,1736996.25,1751228.82,1767845.64],
    "802": [1685934.6,1700575.5,1718418.75,1732499.1,1748938.2],
    "901": [1616067.04,1630101.2,1647205,1660701.84,1676459.68],
    "1002": [2992154.2,3018138.5,3049806.25,3074795.7,3103971.4]
   }
  },
  "Balsini 195": {
    "datas": [
      "2026-01",
      "2026-02",
      "2026-03",
      "2026-04",
      "2026-05",
      "2026-06",
      "2026-07",
      "2026-08"
    ],
    "fontes": [
      "Lançamento jan/2026 (22/01)",
      "Lançamento fev/2026 (25/02)",
      "Vendas mar/2026 (05/03)",
      "Vendas abr/2026 (13/04)",
      "Vendas mai/2026 (08/05)",
      "Vendas jun/2026 (05/06)",
      "Vendas jul/2026 (13/07)",
      "Vendas ago/2026 (05/08)"
    ],
    "unidades": {
      "802": [
        499352.62,
        500449.9,
        502999.43,
        504539.1,
        508920.59,
        514063.19,
        518275.31,
        523458.06
      ],
      "1005": [
        508087.38,
        509203.86,
        511797.99,
        513364.59,
        517822.72,
        523055.28,
        527341.08,
        532614.49
      ],
      "1205": [
        523444.32,
        524594.54,
        527267.08,
        528881.03,
        533473.91,
        538864.62,
        543279.96,
        548712.76
      ],
      "1301": [
        571638.97,
        572895.09,
        575813.7,
        577576.25,
        582592.01,
        588479.06,
        593300.93,
        599233.94
      ],
      "1305": [
        531296.0,
        532463.47,
        535176.1,
        536814.26,
        541476.03,
        546947.6,
        551429.17,
        556943.46
      ],
      "1401": [
        578682.03,
        579953.63,
        582908.19,
        584692.46,
        589770.01,
        595729.59,
        600610.87,
        606616.98
      ],
      "1501": [
        586890.74,
        588180.38,
        591176.86,
        592986.44,
        598136.02,
        604180.14,
        609130.66,
        615221.97
      ]
    }
  },
  "Wissen": {
    "datas": [
      "2025-12",
      "2026-01",
      "2026-02",
      "2026-03",
      "2026-04",
      "2026-05",
      "2026-06",
      "2026-07",
      "2026-08"
    ],
    "fontes": [
      "Studios dez/2025 (03/12)",
      "2D jan/2026 (19/01)",
      "2D fev/2026 (25/02)",
      "2D mar/2026 (05/03)",
      "2D abr/2026 (17/04)",
      "2D mai/2026 (08/05)",
      "2D jun/2026 (05/06)",
      "2D jul/2026 (02/07)",
      "2D e Studios ago/2026 (05/08)"
    ],
    "obs": "Em abril/2026 as unidades 1201 e 1301 trocaram de vaga e box entre si, e o preço acompanhou a troca — o degrau nesse mês é realocação de garagem, não desvalorização. Em maio voltaram à configuração original. Os 2 dormitórios estão com valor congelado desde junho/2026. O studio 1003 saiu da tabela entre janeiro e julho e voltou em agosto, por isso a lacuna.",
    "unidades": {
      "1003": [
        332741.16,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        345213.26
      ],
      "1101": [
        null,
        531116.05,
        532284.51,
        533904.67,
        535538.94,
        540189.64,
        545648.22,
        545648.22,
        545648.22
      ],
      "1201": [
        null,
        550162.41,
        551372.77,
        553051.03,
        567243.9,
        553064.97,
        558653.65,
        558653.65,
        558653.65
      ],
      "1301": [
        null,
        556171.88,
        557395.46,
        559092.06,
        548303.42,
        572169.93,
        577951.66,
        577951.66,
        577951.66
      ]
    }
  },
  "N Studios": {
    "datas": [
      "2026-06-18",
      "2026-07-02",
      "2026-07-14",
      "2026-08-05"
    ],
    "fontes": [
      "Lançamento jun/2026 (18/06)",
      "Lançamento jul/2026 (02/07)",
      "Lançamento jul/2026 – 2ª revisão (14/07)",
      "Lançamento ago/2026 (05/08)"
    ],
    "obs": "A Novo Rumo reajustou a tabela em 02/07 (+0,82% em todas as unidades) e depois fez uma revisão em 14/07 que reduziu o preço da maior parte das unidades — algumas voltaram para abaixo do valor de junho. Os valores de agosto são iguais aos dessa 2ª revisão de julho. As unidades 305, 403 e 405 entraram na tabela depois de junho, por isso as lacunas.",
    "unidades": {
      "101": [
        322530.39,
        325173.13,
        310223.04,
        310223.04
      ],
      "106": [
        325418.75,
        328085.16,
        311913.67,
        311913.67
      ],
      "107": [
        404987.56,
        408305.94,
        396018.77,
        396018.77
      ],
      "201": [
        329690.64,
        332392.05,
        317441.27,
        317441.27
      ],
      "203": [
        412203.74,
        415581.25,
        403075.15,
        403075.15
      ],
      "204": [
        340948.07,
        343741.72,
        328789.85,
        328789.85
      ],
      "206": [
        307640.01,
        310160.75,
        295212.1,
        295212.1
      ],
      "207": [
        394855.94,
        398091.3,
        398091.3,
        398091.3
      ],
      "301": [
        336997.02,
        339758.3,
        324806.8,
        324806.8
      ],
      "303": [
        420616.06,
        424062.5,
        424062.5,
        424062.5
      ],
      "304": [
        348484.18,
        351339.58,
        336386.99,
        336386.99
      ],
      "305": [
        null,
        303200.78,
        293327.14,
        293327.14
      ],
      "306": [
        314496.37,
        317073.28,
        302123.98,
        302123.98
      ],
      "307": [
        402561.41,
        405859.91,
        405859.91,
        405859.91
      ],
      "401": [
        344452.5,
        347274.87,
        332322.66,
        332322.66
      ],
      "403": [
        null,
        null,
        324126.91,
        324126.91
      ],
      "405": [
        null,
        null,
        null,
        419137.08
      ],
      "501": [
        342402.0,
        345207.57,
        339578.44,
        339578.44
      ],
      "601": [
        331032.6,
        333745.01,
        341745.01,
        341745.01
      ],
      "901": [
        424807.63,
        428288.41,
        415071.49,
        415071.49
      ],
      "1001": [
        609285.37,
        614277.72,
        614277.72,
        614277.72
      ],
      "1003": [
        589321.99,
        594150.77,
        594150.77,
        594150.77
      ]
    }
  },
  "Villa Toscana": {
   datas: ["2026-01","2026-04","2026-07","2026-08"],
   fontes: ["Tabela jan/2026","Tabela abr/2026","Tabela jul/2026 (13/07)","Tabela ago/2026"],
   obs: "Série pela coluna Parcelado até 30x, a mesma condição usada nos cards. Parcelas corrigidas pela variação do INPC-IBGE acrescida de 0,90% a.m. De jul para ago/2026 as três unidades subiram exatamente 0,95%, tanto no à vista quanto no parcelado — indexação pura, sem nenhuma reprecificação. A unidade 501 saiu da tabela depois de abril.",
   unidades: {
    "1201": [991459.27,1026331.99,1054709.59,1064729.33],
    "1203": [1072492.06,1086813.35,1116863.24,1127473.44],
    "1402": [3476344.4,3630932.43,3731326.04,3766773.63]
   }
  },
  "Grand Park": {
   datas: ["2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06","2026-07","2026-08"],
   fontes: ["Tabela mar/2025","Tabela abr/2025","Tabela mai/2025","Tabela jun/2025","Tabela jul/2025","Tabela ago/2025","Tabela set/2025","Tabela out/2025","Tabela nov/2025","Tabela dez/2025","Tabela jan/2026","Tabela fev/2026","Tabela mar/2026","Tabela abr/2026","Tabela mai/2026","Tabela jun/2026","Tabela jul/2026","Tabela ago/2026"],
   obs: "Série pela coluna \"Valor parcelado até 30x\", a mesma condição usada nos cards. Histórico mensal completo de mar/2025 a ago/2026, sem nenhuma falha — 18 pontos, o mais longo da ferramenta. A 1803, apartamento tipo em revenda, fez +15.52% no período. Ressalva importante para uso comercial: a taxa de correção das parcelas subiu de 0,75% para 0,80% ao mês em jun/25 e para 0,90% em out/25, então parte do avanço do parcelado é custo de financiamento, não preço do imóvel — na coluna à vista, que não sofre esse efeito, a 1803 havia feito +14,20% até jul/2026 e ganhou mais 0,95% em agosto. A cobertura 1801 foi VENDIDA em agosto/2026 e saiu da série, seguindo a regra de a aba Investimentos mostrar apenas o que o cliente pode comprar. Ficam registrados os números dela, que eram o destaque do comparativo: entrou em mar/2025 a R$ 2.127.976,78 no parcelado e saiu vendida a R$ 3.029.057,87 em jul/2026, +42.34% em 16 meses (+35,53% na coluna à vista), com saltos de +8,82% em nov/25 e +5,80% em jan/26. A unidade 1704 havia sido vendida entre jun e jul/26. Vagas inalteradas: 1803 com duas, 1801 com três.",
   unidades: {
    "1803": [1001120.41,1003923.55,1006433.36,1010257.8,1020966.54,1025254.59,1030380.87,1032544.67,1033783.72,1035747.91,1100087.74,1108008.37,1111332.4,1114777.53,1124476.09,1136283.09,1145600.61,1156483.82]
   }
  },
  "Carbono": {
   datas: ["2026-01","2026-04","2026-07","2026-08"],
   fontes: ["Tabela jan/2026","Tabela abr/2026","Tabela jul/2026 (13/07)","Tabela ago/2026"],
   obs: "Tabela de investidores. Série pela coluna Parcelado até 30x, a mesma condição usada nos cards. Parcelas corrigidas pela variação do INPC-IBGE acrescida de 0,90% a.m. A unidade 905 entrou na tabela depois de janeiro, por isso a lacuna; a 909 saiu. De jul para ago/2026 a coluna à vista subiu exatamente 0,95% nas dez unidades — indexação pura, sem reprecificação. No parcelado a variação ficou entre 0,916% e 0,951%, porque a Andraus recalibrou o acréscimo do parcelamento em cinco unidades (509, 1002, 1003, 1006 e 1101) na casa dos centésimos de ponto; é arredondamento da planilha de origem, não decisão de preço. O desconto do à vista sobre o parcelado varia muito por unidade, de 4,62% na 1006 a 8,17% na 509 — vale conferir unidade por unidade em vez de assumir um percentual único.",
   unidades: {
    "509": [849259.88,864301.47,887314.22,895439.71],
    "807": [509570.8,518949.4,533298.11,538364.44],
    "903": [607929.26,619118.14,636236.47,642280.72],
    "905": [null,622262.03,639467.29,645542.22],
    "1002": [721065.64,734207.95,754314.91,761414.4],
    "1003": [504110.6,513278.27,527304.29,532256.68],
    "1006": [632755.73,644419.94,662265.5,668566.52],
    "1101": [828720.26,843751.92,866749.47,874869.59],
    "1102": [507124.47,516458.04,530737.87,535779.88],
    "1108": [480800.31,489649.39,503187.97,507968.25]
   }
  },
  "DUO - Torre 1": {"datas": ["2025-12", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08"], "fontes": ["Tabela dez/2025", "Tabela mar/2026", "Tabela abr/2026 (rev. 426.2, 20/04)", "Tabela mai/2026 (13/05)", "Tabela jun/2026 (02/06)", "Tabela jul/2026 (10/07)", "Tabela ago/2026 (04/08)"], "obs": "Série pela coluna de 60 meses, a mesma condição dos cards. Três fases distintas: de dez/25 a mar/26 o preço ficou praticamente parado (+0,65% em três meses, só CUB); em abr/26 a Cetor fez uma reprecificação comercial para baixo, unidade por unidade (a 1702 caiu 4,25% e a 2802 caiu 6,61%, enquanto a 2101 não foi tocada); de abr/26 em diante volta a subir pelo CUB, cerca de 0,9% ao mês. As unidades 2802 e 2902 ganharam uma terceira vaga entre jun e ago/26, entao parte da diferença nessas duas é composição de garagem e não preço. A 2101 trocou de vagas (94/95 para 137/138) mantendo duas. A 1502 voltou à tabela em ago/26 só na condição à vista e por isso não entra na série.", "unidades": {"1702": [1950620.26, 1963333.35, 1879827.47, 1896152.16, 1916047.5, 1931747.17, 1950076.87], "2101": [2659936.72, 2677272.76, 2685467.81, 2708788.8, 2737210.71, 2759638.82, 2785824.1], "2802": [2571272.16, 2588030.33, 2416921.03, 2419851.33, 2445241.57, 2465277.35, 2488669.53], "2902": [2659936.72, 2677272.76, 2595952.22, 2618495.84, 2645970.35, 2667650.86, 2692963.3]}},
  "DUO - Torre 2": {"datas": ["2025-12", "2026-03", "2026-04", "2026-06", "2026-07", "2026-08"], "fontes": ["Tabela dez/2025", "Tabela mar/2026", "Tabela abr/2026 (rev. 426.2, 20/04)", "Tabela jun/2026 (02/06)", "Tabela jul/2026 (10/07)", "Tabela ago/2026 (04/08)"], "obs": "Série pela coluna de 60 meses, a mesma condição dos cards. Mesmo movimento da Torre 1: parada de dez/25 a mar/26 (+0,65%, só CUB), reprecificação comercial para baixo em abr/26 (a 1203 caiu 9,21% e a 1503 caiu 8,95%) e alta pelo CUB de abr/26 em diante. Três unidades escaparam do corte e subiram direto do início ao fim: 304, 1903 e 3004, todas +4,73% em oito meses. Maio/26 foi excluído da série: naquela tabela a coluna da Torre 2 traz todos os valores multiplicados por um fator constante de 0,8057, o que é troca de base e não movimento de preço - abril e junho fecham entre si sem ela. As unidades 2703 e 2804 ganharam uma terceira vaga entre jun e ago/26, entao parte da diferença nessas duas é garagem e não preço.", "unidades": {"304": [3040261.35, 3060076.14, 3069442.94, 3128584.17, 3154219.11, 3184148.43], "1203": [2057017.73, 2070424.26, 1879827.47, 1916047.5, 1931747.17, 1950076.87], "1403": [2163415.2, 2177515.18, 1969343.06, 2007287.85, 2023735.13, 2042937.67], "1503": [2305278.49, 2320303.06, 2112568.01, 2153272.42, 2170915.87, 2191514.96], "1903": [2589005.07, 2605878.82, 2613855.34, 2664218.42, 2686048.45, 2711535.46], "2004": [2092483.55, 2106121.24, 1969343.06, 2007287.85, 2023735.13, 2042937.67], "2103": [2659936.72, 2677272.76, 2506436.63, 2554730.0, 2575662.9, 2600102.49], "2703": [2872731.66, 2891454.58, 2685467.81, 2737210.71, 2759638.82, 2785824.1], "2803": [2943663.3, 2962848.52, 2774983.41, 2828451.07, 2851626.78, 2878684.91], "2804": [2571272.16, 2588030.33, 2416921.03, 2463489.64, 2483674.94, 2507241.69], "2903": [3014594.95, 3034242.46, 2954014.59, 3010931.78, 3035602.7, 3064406.51], "2904": [2659936.72, 2677272.76, 2595952.22, 2645970.35, 2667650.86, 2692963.3], "3004": [5492058.54, 5527852.82, 5544773.42, 5651608.68, 5697916.73, 5751982.34]}},
  "Terraço Sky": {
    "datas": [
      "2026-01",
      "2026-07",
      "2026-08"
    ],
    "fontes": [
      "Tabela jan/2026",
      "Tabela jul/2026 (10/07)",
      "Tabela ago/2026 (04/08)"
    ],
    "obs": "Série pela coluna de 60 meses, a mesma condição usada nos cards. A cobertura 2101 é reajustada pelo CUB; os aptos 604 e 704 têm preço fechado em reais e não subiram. Em janeiro só a cobertura estava na tabela, por isso os aptos começam em julho.",
    "unidades": {
      "2101": [
        3499512.74,
        3626104.99,
        3660511.88
      ],
      "604": [
        null,
        880000.0,
        880000.0
      ],
      "704": [
        null,
        900000.0,
        900000.0
      ]
    }
  },
  "Malta": {
    "datas": [
      "2026-01",
      "2026-05",
      "2026-06"
    ],
    "fontes": [
      "Tabela de preços jan/2026 (06/01)",
      "Planilha de vendas mai/2026",
      "Planilha de vendas jun/2026 (23/06)"
    ],
    "obs": "Série pela coluna Em 60x com vaga, a mesma condição usada nos cards. A Hill não emite tabela nova desde junho/2026, então o último ponto é o valor ainda vigente. As unidades 908 e 1103 constavam como vendidas em janeiro e voltaram à tabela por distrato, por isso começam a série em maio.",
    "unidades": {
      "908": [
        null,
        553705.68,
        563773.06
      ],
      "1103": [
        null,
        758757.12,
        758757.12
      ],
      "1201": [
        1610749.8,
        1610749.8,
        1610749.8
      ]
    }
  },
  "Cipriani Tower": {"datas": ["2026-05", "2026-07", "2026-08"], "fontes": ["Disponibilidade mai/2026 (06/05)", "Disponibilidade jul/2026 (06/07)", "Disponibilidade ago/2026 (06/08)"], "obs": "A Cipriani não indexa nada, e o que a tabela mostra como valorização é zero porque realmente é zero. Comparei as tabelas de fev/2025, jul/2025, jan/2026, abr/2026 e mai/2026: o preço base das unidades está congelado há dezoito meses. A 601 subiu de R$ 866.000 para R$ 868.000 entre fev e jul/2025 (+0,23%) e parou; todas as outras — 602, 902, 1002, 504, 604, 804, 904, 1004, 1204, 1304, 1404, 1604, 701, 1101, 1201, 1301 — estão no mesmo valor desde fev/2025. O que mudou não foi preço, foi condição de pagamento, e mudou contra o cliente. Até jan/2026 a OMA vendia em 60x sem juro: a 601 saía por R$ 868.000 (entrada de R$ 382.000 + 60 × R$ 6.100 + 4 reforços de R$ 30.000). Em abr e mai/2026 a tabela passou a oferecer duas opções, 36x sem juro pelos mesmos R$ 868.000 ou 84x a 1,00% ao mês por R$ 927.744,88. De jul/2026 em diante a coluna sem juro desapareceu e sobrou só o 84x. Ou seja, quem compra hoje paga 6,88% mais em termos nominais que quem comprou em janeiro, e essa diferença é juro de financiamento, não valorização do imóvel. A série do gráfico está na coluna de 84x, a mesma dos cards, e por isso só cobre de mai/2026 em diante: antes disso essa coluna não existia na tabela. A 1503 entrou na tabela em ago/2026.", "unidades": {"504": [912783.56, 912783.56, 912783.56], "601": [927744.88, 927744.88, 927744.88], "602": [927744.88, 927744.88, 927744.88], "604": [925443.14, 925443.14, 925443.14], "701": [936650.11, 936650.11, 936650.11], "804": [949611.43, 949611.43, 949611.43], "902": [960460.56, 960460.56, 960460.56], "904": [962271.01, 962271.01, 962271.01], "1002": [971365.78, 971365.78, 971365.78], "1004": [973779.72, 973779.72, 973779.72], "1101": [983271.01, 983271.01, 983271.01], "1201": [994176.24, 994176.24, 994176.24], "1204": [997948.01, 997948.01, 997948.01], "1301": [1006081.46, 1006081.46, 1006081.46], "1304": [1010607.59, 1010607.59, 1010607.59], "1404": [1022116.3, 1022116.3, 1022116.3], "1604": [1046284.59, 1046284.59, 1046284.59]}},
  "San Blas": {
   datas: ["2023-06","2023-08","2023-11","2023-12","2024-02","2024-05","2026-01","2026-03","2026-05","2026-08"],
   fontes: ["Disponibilidade jun/2023","Disponibilidade ago/2023","Tabela de preços nov/2023","Disponibilidade dez/2023","Disponibilidade fev/2024","Disponibilidade mai/2024 (07/05)","Disponibilidade jan/2026","Disponibilidade mar/2026","Disponibilidade mai/2026 (28/05)","Disponibilidade ago/2026 (06/08)"],
   obs: "Preço nominal congelado em dez tabelas seguidas: o apto 2006 está em R$ 795.000,00 desde junho/2023 — 38 meses sem reajuste. O que mudou foi só a forma de pagamento (96 parcelas até nov/2023, 84 em 2024, 60 desde jan/2026); o valor total nominal é idêntico em todas as tabelas, e é essa a base da série e dos cards. O apto 2205 estava disponível a R$ 815.000,00 em jun/2023, constou como vendido de ago/2023 a mai/2024 e voltou à tabela em jan/2026 pelo mesmo valor — daí o intervalo em branco na linha. O apto 1701 de hoje (219,25 m², 4 suítes) é a união do antigo 1701 com o 1702: 105,76 + 113,49 m². Antes da união os dois somavam R$ 2.000.000,00 de jun/2023 a mai/2024, e a unidade unificada entrou na tabela em mai/2026 a R$ 2.006.498,04 — +0,32% nominal em dois anos. A série dele começa em mai/2026 porque antes não existia como unidade; ela usa a condição de 84 parcelas, e as demais a de 60. Não há tabela entre mai/2024 e jan/2026. As unidades 1602, 2005 e 2206 saíram da tabela depois de maio/2026.",
   unidades: {
    "1701": [null,null,null,null,null,null,null,null,2006498.04,2006498.04],
    "2205": [815000,null,null,null,null,null,815000,815000,815000,815000],
    "2006": [795000,795000,795000,795000,795000,795000,795000,795000,795000,795000]
   }
  },
  "Gard": {"datas": ["2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08"], "fontes": ["Tabela jan/2025 · CUB 2887,91", "Tabela fev/2025 · CUB 2901,09 (CUB publicado)", "Tabela mar/2025 · CUB 2907,85 (CUB publicado)", "Tabela abr/2025 · CUB 2916,12 (CUB publicado)", "Tabela mai/2025 · CUB 2923,52 (CUB publicado)", "Tabela jun/2025 · CUB 2934,53 (CUB publicado)", "Tabela jul/2025 · CUB 2965,54 (CUB publicado)", "Tabela ago/2025 · CUB 2978,02 (CUB publicado)", "Tabela set/2025 · CUB 2993,04 (CUB publicado)", "Tabela out/2025 · CUB 2999,38", "Tabela nov/2025 · CUB 3.003,02", "Tabela jan/2026 · CUB 3012,64 (CUB publicado)", "Tabela fev/2026 · CUB 3019,26 (CUB publicado)", "Tabela mar/2026 · CUB 3028,45 (CUB publicado)", "Tabela abr/2026 · CUB 3037,72 (CUB publicado)", "Tabela mai/2026 · CUB 3064,10 (CUB publicado)", "Tabela jun/2026 · CUB 3096,25", "Tabela jul/2026 · CUB 3121,62", "Tabela ago/2026 · CUB 3151,24"], "obs": "A Castelo precifica a Gard em cotas de CUB, não em reais. Conferi as cotas em quatro tabelas espalhadas pelo período — jan/2025, out/2025, jun/2026 e jul/2026 — e elas são idênticas até a quarta decimal: a 3004 vale 517,3454 CUB em todas. Ou seja, a Castelo não reprecificou a Gard uma única vez em 19 meses, e toda a valorização em reais é o CUB/SC subindo. Por isso as 25 unidades dão exatamente o mesmo percentual, +9,12% de jan/2025 a ago/2026. O parcelamento mudou de 72x para 65x e depois para 60x no período, mas o total em CUB não se alterou. Como cada ponto é cota × CUB do mês, cinco meses vêm do CUB declarado na própria tabela da Castelo (jan/25, out/25, jun, jul e ago/26) e o restante do CUB/SC publicado pelo Sinduscon — os CUB de set/2025 a ago/2026 foram todos confirmados nas tabelas da Castelo, inclusive nov/2025 (3.003,02), que na lista publicada aparecia deslocado um mês. Dez/2025 não entra: a pasta não tem tabela desse mês. Nov e dez/2024 existem na pasta e podem ser acrescentados depois de eu conferir as cotas neles.", "unidades": {"3004": [1494047.04, 1500865.65, 1504362.91, 1508641.35, 1512469.71, 1518165.68, 1534208.56, 1540665.03, 1548435.56, 1551715.53, 1553598.67, 1558575.53, 1562000.36, 1566754.76, 1571550.56, 1585198.13, 1601830.78, 1614955.84, 1630279.61], "2904": [1469949.51, 1476658.14, 1480098.99, 1484308.43, 1488075.04, 1493679.14, 1509463.27, 1515815.6, 1523460.8, 1526687.87, 1528540.63, 1533437.22, 1536806.81, 1541484.53, 1546202.97, 1559630.42, 1575994.81, 1588908.17, 1603984.78], "2903": [1623781.43, 1631192.13, 1634993.07, 1639643.03, 1643803.82, 1649994.4, 1667430.35, 1674447.46, 1682892.74, 1686457.52, 1688504.19, 1693913.21, 1697635.43, 1702802.68, 1708014.91, 1722847.55, 1740924.49, 1755189.25, 1771843.65], "2902": [1469949.51, 1476658.14, 1480098.99, 1484308.43, 1488075.04, 1493679.14, 1509463.27, 1515815.6, 1523460.8, 1526687.87, 1528540.63, 1533437.22, 1536806.81, 1541484.53, 1546202.97, 1559630.42, 1575994.81, 1588908.17, 1603984.78], "2804": [1445851.98, 1452450.63, 1455835.07, 1459975.51, 1463680.37, 1469192.6, 1484717.97, 1490966.17, 1498486.03, 1501660.2, 1503482.59, 1508298.91, 1511613.26, 1516214.29, 1520855.38, 1534062.71, 1550158.83, 1562860.49, 1577689.95], "2803": [1597162.06, 1604451.27, 1608189.9, 1612763.63, 1616856.21, 1622945.31, 1640095.42, 1646997.5, 1655304.33, 1658810.68, 1660823.78, 1666144.14, 1669805.33, 1674887.87, 1680014.66, 1694604.15, 1712384.75, 1726415.65, 1742797.03], "2802": [1445851.98, 1452450.63, 1455835.07, 1459975.51, 1463680.37, 1469192.6, 1484717.97, 1490966.17, 1498486.03, 1501660.2, 1503482.59, 1508298.91, 1511613.26, 1516214.29, 1520855.38, 1534062.71, 1550158.83, 1562860.49, 1577689.95], "2704": [1421754.44, 1428243.12, 1431571.15, 1435642.58, 1439285.69, 1444706.05, 1459972.66, 1466116.72, 1473511.26, 1476632.52, 1478424.54, 1483160.59, 1486419.7, 1490944.05, 1495507.79, 1508494.99, 1524322.84, 1536812.81, 1551395.11], "2703": [1570542.7, 1577710.43, 1581386.74, 1585884.25, 1589908.62, 1595896.22, 1612760.51, 1619547.55, 1627715.93, 1631163.84, 1633143.4, 1638375.07, 1641975.25, 1646973.08, 1652014.42, 1666360.75, 1683845.01, 1697642.07, 1713750.42], "2702": [1421754.44, 1428243.12, 1431571.15, 1435642.58, 1439285.69, 1444706.05, 1459972.66, 1466116.72, 1473511.26, 1476632.52, 1478424.54, 1483160.59, 1486419.7, 1490944.05, 1495507.79, 1508494.99, 1524322.84, 1536812.81, 1551395.11], "2604": [1397656.91, 1404035.61, 1407307.23, 1411309.65, 1414891.02, 1420219.51, 1435227.37, 1441267.29, 1448536.49, 1451604.85, 1453366.49, 1458022.27, 1461226.14, 1465673.81, 1470160.2, 1482927.28, 1498486.86, 1510765.14, 1525100.28], "2603": [1543923.33, 1550969.57, 1554583.57, 1559004.85, 1562961.01, 1568847.13, 1585425.58, 1592097.59, 1600127.52, 1603516.99, 1605462.99, 1610606.0, 1614145.16, 1619058.28, 1624014.17, 1638117.35, 1655305.26, 1668868.47, 1684703.8], "2602": [1397656.91, 1404035.61, 1407307.23, 1411309.65, 1414891.02, 1420219.51, 1435227.37, 1441267.29, 1448536.49, 1451604.85, 1453366.49, 1458022.27, 1461226.14, 1465673.81, 1470160.2, 1482927.28, 1498486.86, 1510765.14, 1525100.28], "2504": [1373559.38, 1379828.1, 1383043.32, 1386976.73, 1390496.35, 1395732.97, 1410482.07, 1416417.86, 1423561.73, 1426577.19, 1428308.46, 1432883.96, 1436032.59, 1440403.58, 1444812.61, 1457359.57, 1472650.88, 1484717.47, 1498805.45], "2503": [1517303.96, 1524228.71, 1527780.41, 1532125.45, 1536013.4, 1541798.04, 1558090.65, 1564647.63, 1572539.12, 1575870.14, 1577782.6, 1582836.93, 1586315.07, 1591143.48, 1596013.93, 1609873.94, 1626765.51, 1640094.87, 1655657.18], "2404": [1349461.85, 1355620.59, 1358779.4, 1362643.81, 1366101.68, 1371246.43, 1385736.77, 1391568.42, 1398586.96, 1401549.52, 1403250.41, 1407745.65, 1410839.04, 1415133.34, 1419465.02, 1431791.86, 1446814.91, 1458669.79, 1472510.62], "2402": [1349461.85, 1355620.59, 1358779.4, 1362643.81, 1366101.68, 1371246.43, 1385736.77, 1391568.42, 1398586.96, 1401549.52, 1403250.41, 1407745.65, 1410839.04, 1415133.34, 1419465.02, 1431791.86, 1446814.91, 1458669.79, 1472510.62], "2304": [1325364.31, 1331413.07, 1334515.48, 1338310.87, 1341707.0, 1346759.88, 1360991.47, 1366718.98, 1373612.19, 1376521.84, 1378192.37, 1382607.33, 1385645.48, 1389863.09, 1394117.43, 1406224.14, 1420978.92, 1432622.11, 1446215.78], "2303": [1464065.23, 1470747.01, 1474174.08, 1478366.67, 1482118.2, 1487699.87, 1503420.81, 1509747.72, 1517362.31, 1520576.46, 1522421.8, 1527298.8, 1530654.9, 1535313.89, 1540013.44, 1553387.14, 1569686.02, 1582547.69, 1597563.95], "2302": [1325364.31, 1331413.07, 1334515.48, 1338310.87, 1341707.0, 1346759.88, 1360991.47, 1366718.98, 1373612.19, 1376521.84, 1378192.37, 1382607.33, 1385645.48, 1389863.09, 1394117.43, 1406224.14, 1420978.92, 1432622.11, 1446215.78], "2204": [1301266.77, 1307205.57, 1310251.56, 1313977.95, 1317312.33, 1322273.34, 1336246.17, 1341869.55, 1348637.43, 1351494.17, 1353134.33, 1357469.01, 1360451.93, 1364592.86, 1368769.84, 1380656.43, 1395142.94, 1406574.44, 1419920.95], "2104": [1277169.24, 1282998.06, 1285987.65, 1289645.03, 1292917.66, 1297786.79, 1311500.87, 1317020.11, 1323662.66, 1326466.51, 1328076.28, 1332330.7, 1335258.37, 1339322.62, 1343422.25, 1355088.73, 1369306.96, 1380526.77, 1393626.12], "2002": [1253071.71, 1258790.55, 1261723.73, 1265312.11, 1268522.99, 1273300.25, 1286755.57, 1292170.68, 1298687.9, 1301438.84, 1303018.25, 1307192.39, 1310064.82, 1314052.39, 1318074.66, 1329521.02, 1343470.98, 1354479.09, 1367331.29], "1802": [1204876.64, 1210375.52, 1213195.89, 1216646.25, 1219733.64, 1224327.16, 1237264.97, 1242471.8, 1248738.36, 1251383.49, 1252902.15, 1256915.75, 1259677.71, 1263511.91, 1267379.48, 1278385.59, 1291799.02, 1302383.74, 1314741.62], "1502": [1132584.04, 1137752.99, 1140404.14, 1143647.47, 1146549.61, 1150867.53, 1163029.07, 1167923.49, 1173814.05, 1176300.48, 1177728.03, 1181500.8, 1184097.04, 1187701.19, 1191336.71, 1201682.45, 1214291.08, 1224240.71, 1235857.12]}},
  "Kaisergarten": {"datas": ["2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08"], "fontes": ["Tabela jan/2025 · CUB 2887,91", "Tabela fev/2025 · CUB 2901,09 (CUB publicado)", "Tabela mar/2025 · CUB 2907,85 (CUB publicado)", "Tabela abr/2025 · CUB 2916,12 (CUB publicado)", "Tabela mai/2025 · CUB 2923,52 (CUB publicado)", "Tabela jun/2025 · CUB 2934,53 (CUB publicado)", "Tabela jul/2025 · CUB 2965,54 (CUB publicado)", "Tabela ago/2025 · CUB 2978,02 (CUB publicado)", "Tabela set/2025 · CUB 2993,04", "Tabela out/2025 · CUB 2999,38", "Tabela nov/2025 · CUB 3003,02", "Tabela dez/2025 · CUB 3008,84", "Tabela jan/2026 · CUB 3012,64", "Tabela fev/2026 · CUB 3019,26", "Tabela mar/2026 · CUB 3028,45", "Tabela abr/2026 · CUB 3037,72", "Tabela mai/2026 · CUB 3064,10", "Tabela jun/2026 · CUB 3096,25", "Tabela jul/2026 · CUB 3121,62", "Tabela ago/2026 · CUB 3151,24"], "obs": "As duas unidades se comportam de forma oposta, e isso é o ponto do gráfico. A 301, que é revenda, tem cota fixa de 808,6220 CUB desde jan/2025 e por isso só acompanha o índice: +9,12% em 19 meses, igual à Gard. A cobertura 1301 ficou com cota fixa de 1.008,3992 até mai/2026 e então a Castelo acrescentou exatamente R$ 100.000,00 nela em jun/2026 — de R$ 3.089.835,99 para R$ 3.189.835,99, um salto de 3,24% acima do CUB. Desde então ela está travada nesse mesmo valor em reais: a cota vem caindo de mês a mês (1.030,2256 em jun, 1.021,8528 em jul, 1.012,2479 em ago) exatamente para segurar o número. Ou seja, a 1301 acumula +9,54% no período, mas está perdendo do CUB desde junho, e quem comprar agora entra num valor que já não é reajustado há três meses. Sete meses de 2025 (fev a ago) usam o CUB/SC publicado; os outros treze vêm do CUB declarado na própria tabela da Castelo. Out/2024 e nov/2024 existem na pasta e podem ser acrescentados.", "unidades": {"301": [2335227.56, 2345885.2, 2351351.48, 2358038.79, 2364022.59, 2372925.52, 2398000.89, 2408092.49, 2420237.99, 2425364.65, 2428308.04, 2433014.22, 2436086.98, 2441440.06, 2448871.3, 2456367.22, 2477698.67, 2503695.87, 2524210.61, 2548161.99], "1301": [2912166.13, 2925456.84, 2932273.61, 2940613.08, 2948075.23, 2959177.7, 2990448.16, 3003032.99, 3018179.14, 3024572.39, 3028242.97, 3034111.85, 3037943.77, 3044619.37, 3053886.56, 3063234.42, 3089835.99, 3189835.99, 3189835.99, 3189835.99]}},
  "Residencial EB": {"datas": ["2024-10", "2024-11", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-10", "2025-11", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08"], "fontes": ["Tabela out/2024 · CUB 2846,12", "Tabela nov/2024 · CUB 2863,73 (CUB publicado)", "Tabela fev/2025 · CUB 2901,09 (CUB publicado)", "Tabela mar/2025 · CUB 2907,85 (CUB publicado)", "Tabela abr/2025 · CUB 2916,12 (CUB publicado)", "Tabela mai/2025 · CUB 2923,52 (CUB publicado)", "Tabela jun/2025 · CUB 2934,53 (CUB publicado)", "Tabela jul/2025 · CUB 2965,54 (CUB publicado)", "Tabela ago/2025 · CUB 2978,02 (CUB publicado)", "Tabela out/2025 · CUB 2999,38", "Tabela nov/2025 · CUB 3003,02", "Tabela mar/2026 · CUB 3028,45", "Tabela abr/2026 · CUB 3037,72", "Tabela mai/2026 · CUB 3064,10", "Tabela jun/2026 · CUB 3096,25", "Tabela jul/2026 · CUB 3121,62", "Tabela ago/2026 · CUB 3151,24"], "obs": "Mesmo caso da Gard: a Castelo precifica o EB em cotas de CUB e nunca reprecificou. As cotas da 1402 (157,6826), da 1202 (153,0899) e da 1011 (142,4184) são idênticas na tabela de out/2024 e na de ago/2026 — 22 meses sem um único reajuste comercial. Toda a valorização é o CUB/SC subindo de R$ 2.846,12 para R$ 3.151,24, então as três unidades dão exatamente +10,72%. A 1011 saiu da tabela em jul/2026 e voltou em ago/2026, provavelmente distrato, mas a cota dela não mudou nesse ida e volta. A série tem só os meses em que existe tabela na pasta: faltam dez/2024, jan/2025, set/2025, dez/2025, jan/2026 e fev/2026, que a construtora não nos enviou. Nove meses usam o CUB/SC publicado e oito usam o CUB declarado na própria tabela da Castelo.", "unidades": {"1402": [448783.71, 451560.5, 457451.53, 458517.46, 459821.5, 460988.35, 462724.44, 467614.17, 469582.05, 472950.15, 473524.12, 477533.99, 478995.71, 483155.37, 488224.87, 492225.28, 496895.84], "1202": [435712.34, 438408.25, 444127.69, 445162.58, 446428.63, 447561.5, 449247.02, 453994.34, 455904.9, 459174.9, 459732.15, 463625.23, 465044.37, 469082.88, 474004.72, 477888.62, 482423.14], "1011": [405339.88, 407847.86, 413168.62, 414131.36, 415309.16, 416363.06, 417931.09, 422347.48, 424124.86, 427166.92, 427685.32, 431307.02, 432627.24, 436384.24, 440962.99, 444576.15, 448794.58]}},
  "Bothanic - torre A": {
    "datas": [
      "2025-11",
      "2026-03",
      "2026-07",
      "2026-08"
    ],
    "fontes": [
      "Tabela nov/2025",
      "Tabela mar/2026",
      "Tabela jul/2026 (10/07)",
      "Tabela ago/2026 (04/08)"
    ],
    "obs": "Série pela coluna de 60 meses, a mesma condição usada nos cards. Valores contratuais em CUB, reajustados pela variação positiva do CUB/SC — a evolução acompanha o índice, sem reprecificação comercial. As vagas do apto 1602 mudaram de 96 e 97 para 112 e 113 entre março e julho, sem efeito no preço.",
    "unidades": {
      "201": [
        1578698.72,
        1592067.36,
        1641047.18,
        1656618.52
      ],
      "1501": [
        1955997.78,
        1972561.45,
        2033247.13,
        2052539.93
      ],
      "1602": [
        1744101.45,
        1758870.75,
        1812982.26,
        1830185.03
      ],
      "1702": [
        1833542.55,
        1849069.25,
        1905955.71,
        1924040.68
      ],
      "1802": [
        1900623.38,
        1916718.13,
        1975685.79,
        1994432.41
      ],
      "1901": [
        4858950.98,
        4900097.27,
        5050848.34,
        5098774.13
      ]
    }
  },
  "Bothanic - torre B": {
    "datas": [
      "2026-03",
      "2026-07",
      "2026-08"
    ],
    "fontes": [
      "Tabela mar/2026",
      "Tabela jul/2026 (10/07)",
      "Tabela ago/2026 (04/08)"
    ],
    "obs": "Série pela coluna de 60 meses, a mesma condição usada nos cards. Valores contratuais em CUB, reajustados pela variação positiva do CUB/SC — a evolução acompanha o índice, sem reprecificação comercial. Usada a coluna de preço cheio; as colunas promocionais da planilha original (JAN-FEV-MAR e ABR-MAI-JUN) já venceram e não entram na série.",
    "unidades": {
      "203": [
        1486930.84,
        1532676.14,
        1547219.18
      ],
      "204": [
        1767995.46,
        1822387.69,
        1839679.71
      ],
      "303": [
        1516969.85,
        1563639.29,
        1578476.14
      ],
      "403": [
        1531989.35,
        1579120.87,
        1594104.61
      ],
      "503": [
        1547008.85,
        1594602.44,
        1609733.09
      ],
      "603": [
        1562028.36,
        1610084.02,
        1625361.57
      ],
      "703": [
        1577047.86,
        1625565.6,
        1640990.04
      ],
      "803": [
        1592067.36,
        1641047.18,
        1656618.52
      ],
      "1203": [
        1802340.41,
        1857789.26,
        1875417.19
      ],
      "1303": [
        1802340.41,
        1857789.26,
        1875417.19
      ],
      "1304": [
        1623573.0,
        1673522.08,
        1689401.57
      ],
      "1504": [
        1731811.2,
        1785090.22,
        1802028.34
      ],
      "1603": [
        1952535.44,
        2012605.03,
        2031701.96
      ],
      "1604": [
        1758870.75,
        1812982.26,
        1830185.03
      ],
      "1704": [
        1826519.63,
        1882712.34,
        1900576.77
      ],
      "1803": [
        2102730.48,
        2167420.8,
        2187986.72
      ],
      "1804": [
        1894168.5,
        1952442.43,
        1970968.5
      ]
    }
  },
  "Imperial Park": {
    "datas": [
      "2025-10",
      "2025-12",
      "2026-02",
      "2026-04",
      "2026-06",
      "2026-07",
      "2026-08"
    ],
    "fontes": [
      "Tabela out/2025",
      "Tabela dez/2025",
      "Tabela fev/2026",
      "Tabela abr/2026",
      "Tabela jun/2026 (02/06)",
      "Tabela jul/2026 (10/07)",
      "Tabela ago/2026 (04/08)"
    ],
    "obs": "Série pela coluna à vista, a mesma usada nos cards. O preço ficou praticamente parado entre outubro/2025 e abril/2026, subiu levemente em junho e julho, e caiu forte em agosto, quando a Cetor passou a rotular a coluna como \"ESPECIAL\". A queda leva os lotes 19, 20 e 21 para abaixo do valor de outubro/2025 — não é devolução de valorização acumulada, é redução real. A planilha traz \"fim: 31/06/2026\" como validade dessa condição, data inválida e já vencida: confirmar com a construtora se o preço reduzido segue valendo. Os lotes 7, 12, 22, 23 e 28 saíram da tabela ao longo do período.",
    "unidades": {
      "19": [
        500780.83,
        499165.43,
        498894.63,
        499428.06,
        509050.91,
        513221.96,
        422721.63
      ],
      "20": [
        500780.83,
        499165.43,
        498894.63,
        499428.06,
        509050.91,
        513221.96,
        422721.63
      ],
      "21": [
        500780.83,
        499165.43,
        498894.63,
        499428.06,
        499428.06,
        499428.06,
        422721.63
      ],
      "31": [
        500780.83,
        499165.43,
        498894.63,
        499428.06,
        509050.91,
        513221.96,
        489738.47
      ],
      "32": [
        500780.83,
        499165.43,
        498894.63,
        499428.06,
        509050.91,
        513221.96,
        489738.47
      ]
    }
  },
  "Villaggio di Fiori": {"datas": ["2026-06", "2026-07", "2026-08"], "fontes": ["Tabela jun/2026 – CUB R$ 3.096,25", "Tabela jul/2026 – CUB R$ 3.121,62", "Tabela ago/2026 – CUB R$ 3.151,24"], "obs": "A Sforza precifica os lotes em cotas de CUB, não em reais: valor = Qt. CUB × CUB do mês. Então quase todo o movimento aqui é índice, e o que interessa são as duas exceções. O CUB/SC subiu de R$ 3.096,25 (jun/2026) para R$ 3.121,62 (jul, +0,82%) e R$ 3.151,24 (ago, +0,95%) — os mesmos valores usados nas séries da Gard, da Kaisergarten e do Residencial EB. Nove dos onze lotes mantiveram a cota idêntica nos três levantamentos e por isso dão exatamente +1,78% de jun a ago, puro CUB. Os dois que a Sforza reprecificou para baixo em julho foram o lote 17, cuja cota caiu de 180,950 para 167,950 (−7,18%), e o lote 38, de 194,784 para 171,180 (−12,12%); em reais isso deu −5,54% e −10,56% no período, na contramão do índice. São as duas únicas decisões de preço do trimestre. E não é aleatório quais foram: o 38 é o maior lote do estoque (690,34 m²) e já era o mais barato por metro, R$ 874/m² em junho contra R$ 1.210 a R$ 1.318 dos demais, e depois do corte está em R$ 781/m²; o 17 era o segundo mais barato por metro. Ou seja, o desconto foi nos dois lotes que o mercado não absorveu, não uma correção geral de tabela. Ressalvas: a série tem só três pontos, todos dentro do mesmo trimestre, e não há tabela de lotes de 2025 na pasta — não dá para medir valorização de médio prazo aqui. O cabeçalho da coluna de CUB vem escrito \"CUB 05/26\" nas tabelas de junho e de julho, mas em ambas o valor confere com o CUB do próprio mês, então é rótulo desatualizado e não erro de cálculo. O ponto de ago/2026 não vem de PDF: é a tabela de vendas que já estava na base do comparativo, e ela fecha exatamente com a cota de julho multiplicada pelo CUB de agosto. O PDF de casas de jan/2025 não entra nesta série — são as casas do Condomínio Residencial Villaggio di Fiori, produto diferente dos lotes, e este empreendimento está cadastrado como Terreno.", "unidades": {"17": [560265.03, 524276.08, 529250.76], "18": [504361.39, 508494.02, 513318.95], "20": [517960.44, 522204.5, 527159.52], "36": [464889.41, 468698.61, 473145.93], "37": [495895.76, 499959.02, 504702.96], "38": [603101.4, 534358.91, 539429.26], "39": [444420.07, 448061.55, 452313.06], "41": [416784.53, 420199.58, 424186.71], "42": [511656.25, 515848.65, 520743.36], "43": [444330.01, 447970.75, 452221.4], "44": [462509.25, 466298.95, 470723.51]}},
  "Sunset Boulevard": {"datas": ["2025-07", "2025-08", "2025-10", "2025-11", "2025-12", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07"], "fontes": ["Tabela jul/2025 – Rev. 20 (18/07)", "Tabela ago/2025 – Rev. 20 (29/08)", "Tabela out/2025 – Rev. 21 (07/10)", "Tabela nov/2025 – Rev. 23 (04/11)", "Tabela dez/2025 – Rev. 29 (17/12)", "Tabela mar/2026 – Rev. 37 (27/03)", "Tabela abr/2026 – Rev. 45 (20/04)", "Tabela mai/2026 – Rev. 47 (20/05)", "Tabela jun/2026 – Rev. 53 (22/06)", "Tabela jul/2026 – Rev. 55 (22/07)"], "obs": "Tabela de preço fechado: o total não é indexado (só as parcelas são corrigidas pelo CUB), então cada mudança de valor aqui é decisão de preço da Speranzini. ATENÇÃO na leitura da queda de 2025 — ela é real em valor nominal, mas parte dela é reestruturação do plano de pagamento e não desconto no imóvel. A Speranzini mexeu no plano três vezes em doze meses: jul e ago/2025 tinham entrada + quatro reforços de R$ 95.000 + 80x; de out a dez/2025 passou a três reforços de R$ 80.000 + 80x; em mar/2026 encurtou o parcelamento para 70x; e de abr/2026 em diante ficou em dois reforços de R$ 100.000 + 70x. O apto 101 ilustra bem: R$ 180.000 + 4 × 95.000 + 80 × 9.250 = R$ 1.300.000 em jul/2025, contra R$ 180.000 + 3 × 80.000 + 80 × 8.500 = R$ 1.100.000 em out/2025 — o comprador paga R$ 200.000 menos, mas um reforço inteiro desapareceu da conta. Com essa ressalva, o desenho da série é claro e igual para todas as unidades: pico em jul-ago/2025, piso em nov/2025 (o 202 caiu 22,2%, de R$ 1.350.000 para R$ 1.050.000), recuperação parcial até abr/2026 e congelamento absoluto de abr a jul/2026 — quatro tabelas seguidas sem um real de diferença em nenhuma unidade. E ninguém voltou ao preço de 2025: de jul/2025 a jul/2026 todas as unidades estão abaixo, entre −4,2% (1302 e 1702) e −13,8% (402). Houve ainda dois descontos pontuais em jun/2026, os dois em unidades que saíram da tabela no mês seguinte: o 101 caiu de R$ 1.100.000 para R$ 930.000 (−15,45%) e o 301 de R$ 1.250.000 para R$ 1.170.000 (−6,40%) — queima dos dois andares mais baixos. O estoque encolheu de 27 unidades em jul/2025 para 19 em jul/2026, mas com movimento nos dois sentidos: cinco unidades entraram na tabela só em abr/2026 (602, 901, 1001, 1401 e 1601), provavelmente distratos, e por isso a linha delas começa vazia. Sobre as fontes: são dez tabelas, Rev. 20 a 55. Onde havia mais de uma tabela do mesmo mês usei sempre a revisão mais alta, descartando as Rev. 28 (dez/2025), 33 (mar/2026), 39 e 43 (abr/2026), 46 (mai/2026), 49 e 50 (jun/2026) e 54 (jul/2026). As tabelas de jul e ago/2025 trazem as duas o número Rev. 20 com datas de revisão diferentes (18/07 e 29/08), e os valores são idênticos nas duas. Faltam set/2025, jan/2026, fev/2026 e ago/2026; set/2025 é a mais importante, porque é dentro desse vão que a queda começou e sem ela não há como datá-la. A série foi conferida de duas formas independentes: as 160 linhas das dez tabelas fecham todas em entrada + reforços + N × parcela = total, e a coluna de jul/2026 bate unidade por unidade com a tabela de vendas que já estava na base do comparativo.", "unidades": {"101": [1300000, 1300000, 1100000, 990000, 1050000, 1050000, 1100000, 1100000, 930000, null], "102": [1300000, 1300000, 1100000, 990000, 1050000, 1050000, 1100000, 1100000, null, null], "201": [1350000, 1350000, 1150000, 1050000, null, null, null, null, null, null], "202": [1350000, 1350000, 1150000, 1050000, 1110000, 1110000, 1170000, 1170000, 1170000, 1170000], "301": [1400000, 1400000, 1200000, 1100000, 1170000, 1170000, 1250000, 1250000, 1170000, null], "402": [1450000, 1450000, 1200000, 1100000, 1170000, 1170000, 1250000, 1250000, 1250000, 1250000], "501": [1480000, 1480000, 1200000, 1200000, 1270000, 1270000, 1360000, 1360000, 1360000, 1360000], "502": [1480000, 1480000, 1200000, 1200000, 1270000, 1270000, 1360000, 1360000, 1360000, 1360000], "601": [1500000, 1500000, 1200000, 1200000, 1270000, 1270000, 1360000, 1360000, 1360000, 1360000], "602": [null, null, null, null, null, null, 1360000, 1360000, 1360000, 1360000], "701": [1500000, 1500000, 1200000, 1200000, null, null, null, null, null, null], "702": [1500000, 1500000, 1200000, 1200000, 1270000, 1270000, null, null, null, null], "801": [1550000, 1550000, 1250000, 1250000, 1330000, 1330000, 1420000, 1420000, 1420000, 1420000], "802": [1550000, 1550000, 1250000, 1250000, 1330000, 1330000, 1420000, 1420000, 1420000, 1420000], "901": [null, null, null, null, null, null, 1463000, 1463000, 1463000, 1463000], "902": [1570000, 1570000, 1250000, 1250000, 1330000, 1330000, 1463000, 1463000, 1463000, 1463000], "1001": [null, null, null, null, null, null, 1463000, 1463000, 1463000, 1463000], "1002": [1600000, 1600000, 1250000, 1250000, 1330000, 1330000, null, null, null, null], "1101": [1650000, 1650000, 1250000, 1250000, 1330000, 1330000, 1463000, 1463000, 1463000, 1463000], "1102": [1650000, 1650000, 1250000, 1250000, 1330000, 1330000, null, null, null, null], "1201": [1700000, 1700000, 1250000, 1250000, 1330000, null, null, null, null, null], "1301": [1700000, 1700000, 1400000, 1400000, 1480000, 1480000, 1628000, 1628000, 1628000, 1628000], "1302": [1700000, 1700000, 1400000, 1400000, 1480000, 1480000, 1628000, 1628000, 1628000, 1628000], "1401": [null, null, null, null, null, null, 1628000, 1628000, 1628000, 1628000], "1402": [1700000, 1700000, 1400000, 1400000, 1480000, 1480000, 1628000, 1628000, 1628000, 1628000], "1501": [1700000, 1700000, 1400000, 1400000, 1480000, 1480000, null, null, null, null], "1502": [1700000, 1700000, 1400000, 1400000, 1480000, 1480000, 1628000, 1628000, 1628000, 1628000], "1601": [null, null, null, null, null, null, 1660000, 1660000, 1660000, 1660000], "1602": [1750000, 1750000, 1400000, 1400000, null, null, null, null, null, null], "1701": [1770000, 1770000, 1450000, 1450000, null, null, null, null, null, null], "1702": [1770000, 1770000, 1450000, 1450000, 1540000, 1540000, 1694000, 1694000, 1694000, 1694000], "1802": [1780000, 1780000, 1450000, 1450000, 1540000, null, null, null, null, null]}},
  "Ed. Edimburgo": {"datas": ["2025-09", "2025-11", "2025-12", "2026-04-02", "2026-04-10"], "fontes": ["Tabela set/2025 – Rev. 31 (01/09)", "Tabela nov/2025 – Rev. 35 (07/11)", "Tabela dez/2025 – Rev. 36 (03/12)", "Tabela abr/2026 – Rev. 41 (02/04)", "Tabela abr/2026 – Rev. 42 (10/04)"], "obs": "Tabela de preço fechado, não indexada (só as parcelas são corrigidas pelo CUB), então cada mudança aqui é decisão de preço da Speranzini. Este é o reajuste mais precisamente datável de todo o material que temos: o preço ficou parado sete meses, de set/2025 até a Rev. 41 de 02/04/2026, e subiu cerca de 10% na Rev. 42 de 10/04/2026 — uma janela de oito dias. Por isso os dois pontos de abril entram na série com data completa em vez de só o mês; sem eles o salto pareceria diluído entre dezembro e abril, quando na verdade foi de uma vez. O aumento foi praticamente linear em toda a tabela, de +9,85% (702 e 705) a +10,11% (o 102), sem tratamento diferente por unidade ou por andar. E enquanto o total ficava congelado, a condição de pagamento endureceu três vezes: set/2025 era entrada de R$ 80.000 + três reforços de R$ 15.000 + 85x de R$ 3.764,71; nov e dez/2025 passaram a entrada de R$ 85.000 + dois reforços de R$ 20.000 + 80x de R$ 4.000; e abr/2026 encurtou para 75x de R$ 4.266,67. Os três dão o mesmo total de R$ 445.000 no apto 102, mas a parcela mensal subiu 13% e um reforço desapareceu — mesmo preço, mais caixa antecipado, exatamente o padrão que a tabela do Ed. Toulouse já mostrava. O estoque caiu de 16 unidades em set/2025 para 10 em abr/2026: saíram 101, 103, 202, 502, 604 e 706. Hoje a tabela de vendas na base do comparativo tem sete, e os valores dela são idênticos aos da Rev. 42 — ou seja, o preço se manteve nos quatro meses seguintes ao reajuste. Ressalvas: as tabelas do Edimburgo não trazem linha de \"mês de referência\" como as do Sunset, só a data da revisão, e foi dela que derivei as datas da série. Faltam out/2025 e jan a mar/2026, mas isso não prejudica a leitura porque a Rev. 41 prova que o preço não se moveu nesse vão; o que falta de verdade é de mai/2026 em diante. Uma correção para o card: o cadastro em DATA traz condicao \"Entrada + 85x\", que era a condição de set/2025 — a tabela vigente é 75x. A série foi conferida de duas formas: as 49 linhas das cinco tabelas fecham todas em entrada + reforços + N × parcela = total, e a Rev. 42 bate unidade por unidade com a tabela de vendas nas sete unidades que restam.", "unidades": {"101": [445000, 445000, 445000, null, null], "102": [445000, 445000, 445000, 445000, 490000], "103": [445000, null, null, null, null], "202": [489000, null, null, null, null], "205": [489000, 489000, 489000, 489000, 538000], "206": [489000, 489000, 489000, 489000, 538000], "305": [500000, 500000, 500000, 500000, 550000], "502": [511000, 511000, 511000, null, null], "505": [511000, 511000, 511000, 511000, 562000], "604": [523000, 523000, null, null, null], "605": [523000, 523000, 523000, 523000, 575000], "702": [528000, 528000, 528000, 528000, 580000], "705": [528000, 528000, 528000, 528000, 580000], "706": [528000, null, null, null, null], "802": [533000, 533000, 533000, 533000, 586000], "805": [533000, 533000, 533000, 533000, 586000]}},
  "Princess Tower": {"datas": ["2025-08", "2025-10", "2025-11", "2026-02", "2026-04"], "fontes": ["Tabela ago/2025 – Rev. 00 (20/08)", "Tabela out/2025 – Rev. 05 (28/10)", "Tabela nov/2025 – Rev. 07 (25/11)", "Tabela fev/2026 – Rev. 10 (11/02)", "Tabela abr/2026 – Rev. 14 (10/04)"], "obs": "Tabela de preço fechado, não indexada (só as parcelas são corrigidas pelo CUB). A descoberta mais importante aqui só aparece cruzando com o Ed. Edimburgo: a Rev. 14 do Princess Tower é datada de 10/04/2026, exatamente a mesma data da Rev. 42 do Edimburgo, e as duas trazem o mesmo aumento linear de 10%. Não é coincidência de leitura — foi uma reprecificação de carteira da Speranzini naquele dia. No Princess o +10% é exato em praticamente toda a tabela: 1.200.000 para 1.320.000, 860.000 para 946.000, 750.000 para 825.000, 950.000 para 1.045.000, 1.050.000 para 1.155.000. Antes disso, porém, o movimento tinha sido para baixo, e é aí que a leitura fica interessante. De ago para out/2025 quase toda a tabela caiu: os aptos de final 01 e 02 foram de 870.000 para 800.000 (−8,0%), os de final 03 e 04 de 800.000 para 750.000 (−6,3%) e o 703 caiu 9,5%, de 840.000 para 760.000. Ficou tudo parado em nov/2025, houve recuperação parcial em fev/2026 concentrada nos finais 01 e 02 e nos andares acima do oitavo, e então veio o +10% de abril. O resultado líquido de ago/2025 a abr/2026 é muito desigual e vale olhar unidade por unidade: as coberturas 101 e 102 e os aptos 1503 e 1504 fizeram exatamente +10,0%, porque não participaram da queda de outubro; os finais 01 e 02 dos andares 8 a 14 fizeram entre +11,7% e +17,3%; e os finais 03 e 04 dos andares baixos ficaram de lado ou negativos — o 703 está em −0,5%, o 903 em −1,1% e o 1003 em −1,7%. Ou seja, quem comprou em agosto de 2025 um final 03 de andar baixo tem hoje o mesmo preço de tabela ou menos, enquanto quem comprou um final 01 de andar alto acumulou 17%. Três tipologias convivem na mesma tabela: o grosso é de 118 m², e os aptos 101 (183,91 m²) e 102 (177,93 m²) são as unidades com cobertura aberta adicional, o que explica partirem de 1.200.000 enquanto o resto começa entre 750.000 e 950.000. O parcelamento encurtou de 80x para 75x na Rev. 14 e o cronograma de reforços foi antecipado em seis meses: na Rev. 00 os seis reforços iam de jun/2027 a dez/2029, na Rev. 14 vão de dez/2026 a jun/2029. Somado ao +10%, é mais dinheiro e mais cedo. O estoque caiu de 50 unidades em ago/2025 para 38 em abr/2026, e a tabela de vendas atual tem 37 — saiu o 204. O apto 1402 saiu da tabela entre ago e out/2025 e voltou em fev/2026 pelo mesmo preço do 1401, daí o vão na linha dele. Sobre as fontes: foram oito arquivos, sete únicos, porque a Rev. 02 veio duas vezes (arquivos idênticos byte a byte). Descartei a Rev. 02 de 07/10 em favor da Rev. 05 de 28/10 — mesmo mês, valores idênticos, só com unidades vendidas a menos — e a Rev. 10 de 02/02 em favor da Rev. 10 de 11/02, cuja única diferença é a volta do 1402. Faltam set/2025, dez/2025, jan/2026, mar/2026 e tudo de mai/2026 em diante; como a tabela de vendas vigente é idêntica à Rev. 14, o preço não se moveu nos quatro meses seguintes ao reajuste. A série foi conferida de duas formas: as 190 linhas das sete tabelas fecham em entrada + reforços + N × parcela = total, e a coluna de abr/2026 bate 37 de 37 unidades com a tabela de vendas do comparativo.", "unidades": {"101": [1200000, 1200000, 1200000, 1200000, 1320000], "102": [1200000, 1200000, 1200000, 1200000, 1320000], "201": [870000, 800000, 800000, 860000, 946000], "202": [870000, 800000, 800000, 860000, 946000], "203": [800000, 750000, 750000, 750000, 825000], "204": [800000, 750000, 750000, 750000, 825000], "301": [872000, 800000, 800000, 860000, 946000], "302": [872000, 800000, 800000, 860000, 946000], "303": [805000, 760000, 760000, 760000, 836000], "304": [805000, 760000, 760000, 760000, 836000], "401": [875000, 800000, 800000, 860000, 946000], "403": [807000, 760000, 760000, 760000, 836000], "404": [807000, 760000, 760000, 760000, 836000], "501": [877000, 800000, 800000, 860000, 946000], "502": [877000, 800000, 800000, 860000, null], "504": [809000, null, null, null, null], "601": [889000, 800000, 800000, 860000, 946000], "602": [889000, 800000, 800000, null, null], "603": [815000, 760000, 760000, 760000, 836000], "604": [815000, null, null, null, null], "701": [890000, 800000, 800000, 860000, 946000], "702": [890000, null, null, null, null], "703": [840000, 760000, 760000, 760000, 836000], "704": [840000, 760000, null, null, null], "802": [891000, 850000, 850000, 950000, 1045000], "803": [850000, 800000, 800000, 800000, 880000], "804": [850000, 800000, 800000, 800000, 880000], "901": [900000, 850000, 850000, 950000, 1045000], "902": [900000, 850000, 850000, null, null], "903": [890000, 800000, 800000, 800000, 880000], "904": [890000, 800000, null, null, null], "1001": [905000, 850000, 850000, 950000, 1045000], "1002": [905000, null, null, null, null], "1003": [895000, 800000, 800000, 800000, 880000], "1004": [895000, null, null, null, null], "1101": [910000, 910000, 910000, 970000, 1067000], "1103": [905000, 850000, 850000, 850000, 935000], "1104": [905000, 850000, 850000, 850000, null], "1201": [920000, 920000, 920000, 980000, 1078000], "1202": [920000, 920000, 920000, 980000, 1078000], "1203": [910000, 850000, 850000, 850000, 935000], "1301": [950000, 950000, 950000, 990000, 1089000], "1302": [950000, 950000, 950000, 990000, 1089000], "1303": [920000, 850000, 850000, 850000, 935000], "1304": [920000, 850000, 850000, null, null], "1401": [980000, 980000, 980000, 995000, 1095000], "1402": [980000, null, null, 995000, 1095000], "1403": [940000, 950000, 950000, 950000, 1045000], "1503": [1050000, 1050000, 1050000, 1050000, 1155000], "1504": [1050000, 1050000, 1050000, 1050000, 1155000]}},
  "Lago di Garda": {"datas": ["2025-01", "2026-06"], "fontes": ["Lista de lotes jan/2025", "Lista de lotes jun/2026"], "obs": "ATENÇÃO: esta é a única série do comparativo com só dois pontos, e é de propósito. Recebi cinco listas do Lago di Garda (jan/2025, out/2025, mar/2026, abr/2026 e jun/2026) e só consegui validar duas delas; as outras três entrariam com preço errado por lote, então ficaram fora. O que valida jan/2025: a soma dos 97 lotes que extraí dá R$ 58.731.557,00, exatamente o total impresso no próprio documento, sem um centavo de diferença. O que valida jun/2026: ela é a base da tabela de vendas que já está no comparativo, e obedece à regra de preço R$ 1.250,00 por m² com piso de R$ 450.000,00 em 85 dos 86 lotes (a única exceção é o lote 32, que ficou em R$ 449.650 sem o piso). Por que descartei out/2025, mar/2026 e abr/2026: nenhuma das três traz total declarado, logo não há como conferir, e as três têm a coluna de valor desalinhada em relação ao número do lote na extração do PDF. Em abr/2026 dá para ver os valores trocando de lugar comparando com mar/2026 — o lote 20 aparece com R$ 621.200 e o 23 com R$ 706.500, exatamente invertidos entre as duas tabelas — e o lote 1 exibe o texto \"ABR.26\" no lugar do valor. Em out/2025 o lote 64 aparece com R$ 686.800, que é o valor do lote 63 em janeiro, e o lote 86 (1.005,87 m²) sai a R$ 582 por m², um terço do resto da tabela. Usar esses meses seria atribuir a cada lote o preço do vizinho, e num material que vai para cliente isso não é aceitável. Agora o que os dois pontos válidos mostram, que é a informação importante: o preço CAIU cerca de 20% em dezessete meses. Um lote padrão de 350 m² saiu de R$ 565.600 para R$ 450.000, −20,0% na média dos 47 lotes dessa faixa; entre 356 e 420 m² a queda média é de 21,3% em 32 lotes; e acima de 420 m², onde o piso não pega, 21,1% em 7 lotes. O 53, de 480,38 m², foi de R$ 767.600 para R$ 600.475. A mediana do R$/m² caiu de 1.616 para 1.286. E não foi só o número que mudou, foi a lógica de precificação: até mar/2026 as listas traziam valores em faixas por área, com a matrícula de cada lote e coluna \"VALOR TOTAL\" ou \"VALOR LOTE\"; o documento de jun/2026 se chama \"LOTES LAGO Di GARDA\", a coluna virou \"Investimento\", a matrícula desapareceu e o preço passou a ser uma conta única de R$ 1.250 por m². Junto disso o financiamento direto foi de 60x em jan/2025 para até 120x, que é o que o card já registra. Ou seja, a leitura não é reajuste negativo: é liquidação de estoque, com preço menor e prazo dobrado. Para melhorar esta série basta qualquer lista do Lago que traga total declarado, como a de jan/2025 — ou as mesmas de out/2025, mar e abr/2026 em Excel ou CSV em vez de PDF, porque o problema está na extração, não nos dados.", "unidades": {"1": [565600, 450000], "2": [565600, 450000], "3": [565600, 450000], "4": [565600, 450000], "5": [565600, 450000], "6": [565600, 450000], "7": [565600, 450000], "8": [565600, 450000], "9": [565600, 450000], "10": [565600, null], "11": [643370, null], "12": [626200, 480562], "13": [585800, 453812], "14": [565600, 450000], "15": [565600, 450000], "16": [565600, 450000], "17": [565600, 450000], "18": [565600, 450000], "19": [565600, 450000], "20": [656500, 535162], "21": [666600, 515187], "22": [565600, 450000], "23": [565600, 450000], "24": [565600, 450000], "25": [565600, 450000], "26": [565600, 450000], "27": [565600, 450000], "28": [565600, 450000], "29": [545400, 450000], "30": [531502, null], "31": [535300, 450000], "32": [565600, 449650], "33": [565600, 462250], "34": [666600, 516750], "35": [676700, null], "36": [676700, 525000], "37": [676700, 525000], "38": [676700, 525000], "39": [676700, 525000], "40": [656500, 508950], "41": [531260, 450000], "42": [757500, 581625], "43": [565600, 450000], "44": [560000, 450000], "45": [565600, 450000], "46": [565600, 450000], "47": [565600, 450000], "48": [565600, 450000], "49": [565600, 450000], "50": [565600, 450000], "51": [545400, 468000], "52": [595900, 467500], "53": [767600, 600475], "54": [565600, 450000], "55": [565600, 450000], "56": [565600, 450000], "57": [565600, null], "58": [560000, null], "59": [565600, 450000], "60": [565600, 450000], "61": [549440, 450000], "62": [545400, 487500], "63": [686800, 545187], "64": [565600, 450000], "65": [565600, 450000], "66": [565600, 450000], "67": [757500, 612500], "68": [676700, 525000], "69": [565600, null], "70": [727200, 563625], "71": [565600, 450000], "72": [565600, 450000], "73": [560000, null], "74": [565600, 450000], "75": [565600, 450000], "76": [545400, null], "77": [606000, 490000], "78": [600000, null], "79": [606000, 490000], "80": [606000, 490000], "81": [585800, 455000], "82": [585800, 455000], "83": [585800, 455000], "84": [585800, 453075], "85": [686800, 535562], "86": [1625485, null], "87": [535300, 450000], "88": [606000, 470475], "89": [626200, 486150], "90": [626200, 486150], "91": [626200, 486150], "92": [626200, 486150], "93": [626200, 486150], "94": [626200, 486150], "95": [626200, 486150], "96": [626200, 486150], "97": [626200, 486150]}}
};