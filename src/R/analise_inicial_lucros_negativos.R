library(RODBC)
channel <- odbcConnect("AlgodoeiroDSN")

agricultor_banco = sqlQuery(channel, "SELECT a.id, a.nome_agricultor, a.ano_adesao, c.nome_comunidade, r.nome_regiao from agricultor a, comunidade c, regiao r where a.id_comunidade = c.id and c.id_regiao = r.id order by a.nome_agricultor ", stringsAsFactor = FALSE)

agricultor_especifico = sqlQuery(channel,"SELECT * from agricultor a, Producao p , Cultura cu, Venda v, Comunidade c, Regiao r
                                 where a.id = p.id_agricultor  and p.id_cultura = cu.id and a.id_comunidade = c.id and r.id = c.id_regiao
                                 and a.nome_agricultor like '%Anselmo%' and year(data_plantio) = 2011
                                 and v.id_cultura = cu.id and v.id_regiao = c.id_regiao")

agricultor_especifico1 = sqlQuery(channel,"SELECT * from agricultor a, Producao p , Cultura cu
                                 where a.id = p.id_agricultor  and p.id_cultura = cu.id 
                                 and a.nome_agricultor like '%Anselmo%'
                                 ")

agricultor_especifico = agricultor_especifico[,c("nome_agricultor", "area_plantada", "quantidade_produzida","nome_cultura","valor")]
agricultor_especifico$producao_ha = agricultor_especifico$quantidade_produzida / agricultor_especifico$area_plantada
agricultor_especifico$receita = agricultor_especifico$producao_ha * agricultor_especifico$valor
custos <- sqlQuery(channel,"SELECT * from Venda v, cultura cu where v.id_cultura = cu.id")

tabelas = sqlTables(channel)