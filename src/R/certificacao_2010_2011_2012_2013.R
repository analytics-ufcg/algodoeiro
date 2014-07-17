#setwd("/home/celio/Desenvolvimento/algodoeiro/src/dados")
library(RODBC)
channel <- odbcConnect("AlgodoeiroDSN")

agricultores = sqlQuery(channel, "SELECT a.id as id_agricultor, ano.ano_producao from Agricultor a, Ano ano", stringsAsFactor = FALSE)

certificacao = sqlQuery(channel, "SELECT id as id_certificao, nome_certificacao from Certificacao")

agricultores["id_certificacao"] = 1

agricultores[agricultores$ano_producao <= 2011,]$id_certificacao = 2
write.csv(agricultores, "Agricultores_com_Certificacao.csv", row.names = FALSE)