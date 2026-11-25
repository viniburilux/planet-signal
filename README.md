# UCs sob Pressão

Painel público nacional de unidades de conservação (UCs) e terras indígenas (TIs) sob pressão. Projeto do Hack Brasil 2026, trilha Meio ambiente & economia verde.

## O que é
Um mapa e um ranking. Cada UC ou TI vira um card com:
- percentual da área coberta por cadastros ambientais rurais (CAR) privados;
- km² de supressão recente, a partir dos alertas de desmatamento;
- crédito rural público vinculado à área;
- um par de imagens de satélite (antes e depois) de mais de um sensor.

A ESEC Uruçuí-Una é o caso completo de demonstração. O ranking nacional mostra que o método escala.

## Como funciona
- Site estático (HTML e JavaScript, mapa com tiles abertos). Sem backend, sem login, sem tempo real.
- Dados pré-computados em JSON: ranking UC/TI por alertas, métricas por unidade, geometrias simplificadas.
- Fontes abertas: alertas DETER (INPE), limites de UCs e TIs (ICMBio, MMA, Funai), cadastro ambiental rural (SICAR), crédito rural (SICOR/Banco Central), imagens Sentinel.
- Demonstração ao vivo: GitHub Pages (em breve).

## Estado
Dia 1 de 5. Estrutura criada em 25/11/2026. Próximos passos: esqueleto do site, ranking nacional, card da ESEC Uruçuí-Una.

## Cronograma
| Dia | Entrega |
|---|---|
| 25/11 | Repositório, esqueleto do site, README, ESEC Uruçuí-Una no ar |
| 26/11 | Mapa nacional, cards das 20 primeiras UCs, pares de imagem |
| 27/11 | Camada de CAR e crédito, página de metodologia |
| 28/11 | Acabamento visual, teste no celular |
| 29/11 | Vídeo, README final, submissão |
| 30/11 | Reserva de segurança |

## Limites
O painel mostra áreas e valores agregados por unidade. Não identifica pessoas nem empresas. Alertas de desmatamento não cobrem fogo; a leitura de imagem complementa.

## Equipe
Vinícius Buri e Jhoel (integrantes do time).
