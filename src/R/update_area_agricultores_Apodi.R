library(RODBC)
channel <- odbcConnect("AlgodoeiroDSN")

agricultor_banco = sqlQuery(channel, "SELECT a.id, a.nome_agricultor, a.ano_adesao, c.nome_comunidade, r.nome_regiao from agricultor a, comunidade c, regiao r where a.id_comunidade = c.id and c.id_regiao = r.id and r.nome_regiao='Apodi'  order by a.nome_agricultor ", stringsAsFactor = FALSE)

update <- read.csv("csv_update_area_apodi.csv")



update_agricultor <- merge(x = agricultor_banco, y = update,
                             by = c("nome_agricultor","nome_comunidade"), all.y = TRUE)

subset(update_agricultor, is.na(update_agricultor$id))


update_banco = update_agricultor[,c("id","area")]

colnames(update_banco) = c("id_agricultor","area_plantada")

producao_banco = sqlQuery(channel, "SELECT p.* from Producao p, Agricultor a, Comunidade c, Regiao r where year(p.data_plantio) =2011 and a.id = p.id_agricultor and a.id_comunidade = c.id and c.id_regiao =r.id and r.nome_regiao = 'Apodi'", stringsAsFactor = FALSE)

update_producao <- merge(x = update_banco, y = producao_banco,
                           by = c("id_agricultor"), all.y = TRUE)

update_producao_BD <- data.frame("id"=update_producao$id, "id_agricultor"=update_producao$id_agricultor, "id_cultura"=update_producao$id_cultura, "area_plantada"=update_producao$area_plantada.x, "quantidade_produzida"=update_producao$quantidade_produzida,"data_plantio"=update_producao$data_plantio)


update_producao_BD = update_producao_BD[with(update_producao_BD, order(id)), ]
sqlUpdate(channel, update_producao_BD, "Producao",fast = TRUE,verbose = TRUE, test=FALSE)