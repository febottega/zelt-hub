/* Padrão de acabamento e lazer de cada empreendimento, para a nota de custo-benefício. Chave = nome do card
   sem o sufixo " - ..." (DUO, Bothanic, Vista 43, Tulum, Criatto, Solare, Terrasse cobrem todos os cards).
   Padrão julgado pelo produto, nunca pelo preço: pesquisa de 29/10/2026 (sites das construtoras e anúncios)
   revisada pelo Felipe (Egon Belz, Flow, Grand Park, San Vito e Villa Toscana Médio e Valverde
   Econômico, também por ele). Lazer de Kaisergarten,
   Flow, Vista 43 e Amani 53 tirado dos materiais do Drive da ZELT (tabela da Castelo, folder e memorial
   do Flow, apresentação do Vista 43 e do Amani). Gard: só a quantidade, 6 itens, informada pelo Felipe.
   lazer: null = não achamos a lista (não é "sem lazer"); o modelo usa a média do padrão.
   portaria_24h é registrada mas não conta como item de lazer.
   andar: apartamentos por andar (30/10/2026). Vem da pesquisa quando ela achou o número (DUO e Bothanic: 2
   por torre; Kaisergarten, Pablo Neruda, Amani e Alameda: 1; Flow: 2, pelo folder) e, nos demais, do maior
   final de unidade nas tabelas de vendas (1204 = final 04) ou de unidades ÷ andares. Os que saíram só do
   final da tabela são piso, não certeza: Gard, Egon Belz, Villa Toscana, Balsini, San Blas, N Studios,
   Norden. Terraço Sky 4, Wissen 11 e Valverde 4 foram informados pelo Felipe. null = não achamos (o modelo
   usa a mediana; nenhum hoje). Terreno não tem. */
const PADRAO_LAZER = {
  "Villa Toscana": { padrao: "Médio", lazer: ["piscina", "academia", "salao_festas", "playground", "sauna_spa", "pet_place", "cinema_jogos", "portaria_24h"], andar: 4 },
  "Grand Park": { padrao: "Médio", lazer: ["piscina", "academia", "salao_festas", "espaco_gourmet", "playground", "quadra", "sauna_spa", "pet_place", "cinema_jogos"], andar: 4 },
  "Carbono": { padrao: "Médio", lazer: ["piscina", "academia", "rooftop", "coworking", "cinema_jogos", "lavanderia"], andar: 9 },
  "Liv": { padrao: "Médio", lazer: ["piscina", "academia", "salao_festas", "espaco_gourmet", "coworking", "bicicletario", "lavanderia", "mercado_autonomo"], andar: 11 },
  "Kaisergarten": { padrao: "Altíssimo", lazer: ["piscina", "academia", "salao_festas", "playground"], andar: 1 },
  "Gard": { padrao: "Alto", lazer: 6, andar: 4 },
  "Egon Belz": { padrao: "Médio", lazer: ["piscina", "salao_festas", "rooftop", "coworking"], andar: 12 },
  "DUO": { padrao: "Altíssimo", lazer: ["piscina", "academia", "salao_festas", "espaco_gourmet", "playground", "rooftop", "pet_place", "cinema_jogos"], andar: 2 },
  "Bothanic": { padrao: "Altíssimo", lazer: ["piscina", "academia", "salao_festas", "espaco_gourmet", "playground", "pet_place"], andar: 2 },
  "Imperial Park": { padrao: "Alto", lazer: ["piscina", "academia", "salao_festas", "espaco_gourmet", "portaria_24h"] },
  "Terraço Sky": { padrao: "Alto", lazer: ["piscina", "academia", "salao_festas", "playground", "rooftop", "bicicletario"], andar: 4 },
  "Gardens": { padrao: "Médio", lazer: ["piscina", "academia", "espaco_gourmet", "playground", "rooftop", "coworking", "pet_place", "portaria_24h"], andar: 5 },
  "Malta": { padrao: "Médio", lazer: ["piscina", "academia", "salao_festas", "playground"], andar: 8 },
  "San Vito": { padrao: "Médio", lazer: ["piscina", "academia", "salao_festas", "espaco_gourmet", "playground", "coworking", "pet_place", "mercado_autonomo"], andar: 4 },
  "Maldivas": { padrao: "Médio", lazer: ["piscina", "academia", "salao_festas", "espaco_gourmet", "playground", "pet_place", "cinema_jogos", "bicicletario"], andar: 6 },
  "Alameda Giardini": { padrao: "Altíssimo", lazer: ["piscina", "academia", "salao_festas", "espaco_gourmet", "playground"], andar: 1 },
  "Lisbon": { padrao: "Alto", lazer: ["piscina", "academia", "salao_festas"], andar: 2 },
  "Lago di Garda": { padrao: "Alto", lazer: ["salao_festas", "espaco_gourmet", "playground", "quadra", "coworking", "pet_place", "portaria_24h"] },
  "Balsini 195": { padrao: "Médio", lazer: ["piscina", "academia", "salao_festas", "playground", "rooftop"], andar: 5 },
  "Wissen": { padrao: "Médio", lazer: ["piscina", "academia", "espaco_gourmet", "coworking", "mercado_autonomo"], andar: 11 },
  "N Studios": { padrao: "Médio", lazer: ["piscina", "academia", "espaco_gourmet", "coworking", "mercado_autonomo"], andar: 7 },
  "Vista 43": { padrao: "Médio", lazer: ["piscina", "academia", "salao_festas", "espaco_gourmet", "playground", "coworking", "pet_place"], andar: 17 },
  "Cipriani Tower": { padrao: "Alto", lazer: ["piscina", "piscina_aquecida", "academia", "salao_festas", "espaco_gourmet", "playground", "quadra", "pet_place", "cinema_jogos"], andar: 4 },
  "San Blas": { padrao: "Alto", lazer: ["piscina", "academia", "salao_festas", "playground", "quadra", "pet_place", "cinema_jogos"], andar: 6 },
  "Valverde": { padrao: "Econômico", lazer: ["academia", "salao_festas", "playground", "coworking"], andar: 4 },
  "Pablo Neruda": { padrao: "Altíssimo", lazer: ["piscina", "academia", "salao_festas", "espaco_gourmet", "playground", "cinema_jogos"], andar: 1 },
  "Alphaville": { padrao: "Médio", lazer: ["piscina", "academia", "salao_festas", "playground", "pet_place"], andar: 4 },
  "Villaggio di Fiori": { padrao: "Alto", lazer: ["piscina", "academia", "salao_festas", "espaco_gourmet", "playground", "quadra", "cinema_jogos", "portaria_24h"] },
  "Sunset Boulevard": { padrao: "Alto", lazer: ["piscina", "academia", "salao_festas", "espaco_gourmet", "playground", "pet_place", "cinema_jogos"], andar: 2 },
  "Princess Tower": { padrao: "Alto", lazer: ["piscina", "academia", "salao_festas", "espaco_gourmet", "playground"], andar: 4 },
  "Ed. Toulouse": { padrao: "Médio", lazer: ["piscina", "academia", "salao_festas", "playground"], andar: 4 },
  "Ed. Edimburgo": { padrao: "Médio", lazer: ["piscina", "academia", "salao_festas", "playground"], andar: 6 },
  "Flow": { padrao: "Médio", lazer: ["piscina", "academia", "espaco_gourmet", "playground", "rooftop", "coworking"], andar: 2 },
  "Central Park": { padrao: "Alto", lazer: ["piscina", "academia", "espaco_gourmet", "quadra", "sauna_spa"] },
  "Tulum": { padrao: "Médio", lazer: ["piscina", "academia", "salao_festas", "playground", "coworking", "pet_place"], andar: 9 },
  "Amani 53": { padrao: "Altíssimo", lazer: ["academia", "espaco_gourmet"], andar: 1 },
  "Villaggio Treviso": { padrao: "Alto", lazer: ["piscina", "piscina_aquecida", "academia", "salao_festas", "espaco_gourmet", "playground", "quadra"] },
  "Criatto": { padrao: "Alto", lazer: ["piscina", "academia", "salao_festas", "playground", "quadra", "coworking", "pet_place", "cinema_jogos"], andar: 4 },
  "Estanislau Park": { padrao: "Econômico", lazer: ["piscina", "academia", "salao_festas", "espaco_gourmet", "playground", "coworking", "pet_place", "cinema_jogos", "bicicletario"], andar: 8 },
  "Hannover": { padrao: "Econômico", lazer: ["piscina", "academia", "salao_festas", "playground", "coworking", "pet_place", "cinema_jogos", "bicicletario", "mercado_autonomo"], andar: 8 },
  "Scire Fortaleza": { padrao: "Econômico", lazer: ["piscina", "academia", "salao_festas", "espaco_gourmet", "playground", "coworking", "pet_place", "bicicletario"], andar: 8 },
  "Norden": { padrao: "Econômico", lazer: ["piscina", "academia", "salao_festas", "espaco_gourmet", "playground", "quadra", "coworking", "pet_place", "cinema_jogos", "bicicletario"], andar: 8 },
  "Solare": { padrao: "Econômico", lazer: ["piscina", "academia", "espaco_gourmet", "playground", "rooftop", "coworking", "pet_place", "cinema_jogos", "bicicletario", "lavanderia"], andar: 10 },
  "Terrasse": { padrao: "Econômico", lazer: ["piscina", "academia", "salao_festas", "espaco_gourmet", "playground", "quadra", "rooftop", "coworking", "pet_place", "cinema_jogos", "bicicletario", "lavanderia", "mercado_autonomo"], andar: 10 }
};
