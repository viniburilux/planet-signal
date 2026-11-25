# Planet Signal — teste: trajetória de embeddings vs NDVI (25/11)

## Pergunta
Em 3 sítios confirmados, a trajetória anual dos AlphaEarth embeddings (64D, 2017–2025) detecta a transformação antes — ou detecta o que o NDVI/NDWI perde?

## Sítios e ROIs (mudança × controle)
| Sítio | ROI mudança (centro) | ROI controle (centro) | Evento conhecido |
|---|---|---|---|
| ESEC Uruçuí-Una norte | -44.9805, -8.8273 | -45.10, -8.70 (cerrado estável dentro da ESEC) | Corte raso 2024→2025; maior alerta 31,7 km² em 31/03/2025 |
| TI Kayapó (corredor do rio) | -50.98, -7.88 | -51.10, -7.80 (floresta na TI) | 31 alertas MINERACAO; garimpo confirmado 2024-07-28 × 2026-08-14 |
| PARNA Jamanxim | -55.7257, -5.7922 | -55.60, -5.70 (floresta no parque) | Fogo ativo + desmate novo na cena de 21/08/2026 |

Buffers: 1.500 m (mudança e controle). Controles ajustados visualmente no mapa antes da extração.

## Extração (leve, sem fila do HydroRisk)
- Fonte: GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL, anos 2017–2025, média do vetor 64D por ROI por ano (reduceRegion, scale 30).
- Índices no mesmo ROI/ano: NDVI e NDWI medianos (Sentinel-2 SR, jun–out, máscara SCL).
- Saída: JSON site × ano × {64 dims, ndvi, ndwi} — impresso no console do Code Editor, sem batch, sem export. Minutos, não dias.

## Análise (local, Python)
1. Delta ano a ano: distância de cosseno entre vetores consecutivos (mudança vs controle).
2. Distância ao baseline 2017 (drift acumulado).
3. Ano de detecção: primeiro ano com delta > p95 do controle; comparar com o ano em que NDVI cruza o mesmo tipo de limiar → "embedding detecta antes?" (hipótese da dissecação das seeds: pulso de 1–2 anos).
4. O que o índice perde: separação mudança×controle nos embeddings vs NDVI (AUC simples por ano).

## Amarração com a pesquisa do Vini
- Mesma métrica da dissecação das seeds (13/11): cosseno sobre médias anuais; números conhecidos pra calibrar — Kayapó S4 spike 0,185 vs floresta 0,019; Yanomami 0,158; Tapajós 6,6x no ano do início AMW.
- TAAI 2026 (trajetórias de embeddings) e NeurIPS GlobalSouthAI #167 (auditoria ESG territorial): o teste é o "Planet Signal" mínimo — trajetória por sítio com evento datado.
- Limite conhecido das seeds (registrar no resultado, sem rótulo): embedding separa garimpo de floresta (AUC 0,91) mas não de corte comum (0,64) — Jamanxim (fogo/desmate) e ESEC (corte raso) testam exatamente essa fronteira.

## Entrega
Gráficos por sítio: (a) delta-cosseno 2017→2025 mudança vs controle; (b) NDVI mesmo período; (c) marca do evento conhecido. + 1 frase por sítio pro PAC.

## RESULTADO (25/11 04:26, rodado no Code Editor, conta viniburilux)

Gotcha técnico registrado: a coleção GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL tem 97.155 imagens — é TILEADA, não 1 imagem/ano. `.first()` pega 1 tile e devolve null fora dele; tem que usar `.mosaic()` após o filtro de ano.

**Kayapó (corredor do rio):** separação limpa e persistente. Drift ao baseline 2017: sítio sobe a 0,10-0,12 (2021-2025) contra 0,02-0,03 do controle — 3-5x. Delta ano a ano do sítio acima do controle em TODOS os anos desde 2019. NDVI também cai (0,72→0,43), mas a trajetória do embedding é menos ruidosa.

**Jamanxim:** embedding detecta ANTES dos alertas. Drift do sítio descola do controle desde 2021 (0,052 vs 0,025) e sobe monotonicamente até 0,079 em 2025; controle fica 0,01-0,03. Os alertas DETER do ponto só começam em out/2025 e o fogo em ago/2026. NDVI separa pouco (0,74 vs 0,80 em 2025).

**ESEC norte:** NDVI pegou o corte raso (0,53→0,43 em 2025); embedding não separou no ROI de 1,5 km — o corte é uma fração pequena do círculo e a média dilui. Mostra o limite: pra mosaico de patches, precisa de grade de células (STT), não média de ROI. Controle da ESEC ficou em vegetação diferente (NDVI 0,16-0,37) — refinar se o pacote for usado.

**Leitura para o Planet Signal:** (1) a trajetória de embeddings separa sítio de controle com menos ruído que NDVI; (2) em Jamanxim sinaliza 3-4 anos antes do alerta oficial; (3) a unidade de análise certa é a célula (como o STT do GhostWorks), não o ROI único. Consistente com a dissecação das seeds (pulso de 1-2 anos; AUC 0,91 garimpo×floresta).

## GRADE DE CÉLULAS — PARNA Jamanxim (25/11 04:35)

Método: polígono WDPA do parque dentro do próprio EE (WCMC/WDPA/current/polygons), 600 pontos aleatórios (seed 7), stack 2017/2024/2025 mosaicado (coleção tileada), amostragem a 60m, delta cosseno por célula calculado server-side. ~40s de compute interativo, sem custo.

Resultado (n=600 células): drift mediano 0,026 (baseline natural do parque). 40 células (7%) acima de 0,05 — 2x o nível que separava sítio de controle no teste de ROI. Máx 0,70. As células quentes NÃO estão só no ponto do alerta DETER de out/2025: só 8 das 40 ficam perto dele; as outras 32 se espalham pelo parque (lon -56,0 a -55,4). No mapa 2017→2024 (antes de qualquer alerta) já aparecem 15 células > 0,05.

Leitura: a grade de células resolve o problema da diluição do ROI (caso ESEC) e mostra ONDE dentro da UC a trajetória saiu do baseline — um mapa de priorização de campo/verificação. Jamanxim tem múltiplos focos, não um. Vale pro painel do Hack Brasil: este é o produto visual (mapa de calor de drift por célula).

---

## NOTA DE BASTIDOR (não vai pra narrativa, vídeo ou hackathon)

- Controle da ESEC norte caiu em vegetação diferente (NDVI 0,16-0,37); refinar o polígono de controle se o pacote for usado em entrega.
- ROI de 1,5 km dilui cortes pequenos: usar grade de células (validado no Jamanxim) em vez de média de ROI.
- Embedding separa transformação de floresta, não a causa (garimpo × corte raso × fogo): AUC 0,91 garimpo×floresta, 0,64 garimpo×corte (dissecação GhostWorks).
- Coleção V1/ANNUAL é tileada (97.155 imagens): filtrar por ano e usar .mosaic(); .first() devolve null fora do tile.
- Filtro por nome no WDPA falha ('Jamanxim' vs 'Parque Nacional do Jamanxim'): usar filterBounds com ponto interno.
- Grade acima de ~600-1000 pontos derrubou a aba do navegador; rodar por UC, não em lote.
