library(RODBC)
channel <- odbcConnect("AlgodoeiroDSN")

############Carregamento dados de comunidade ############
comunidades = sqlQuery(channel, "SELECT * from comunidade order by id" ,
                       stringsAsFactor = FALSE)

############# Carregando csvs##########
sqlTables(channel)

todos_agricultores <- read.csv("Adesao.csv")

##merge com comunidade para pegar id das comunidades
tabela_merge <- merge(x = todos_agricultores, y = comunidades, by.x = "Comunidade", by.y = "nome_comunidade", all=FALSE)
tabela_merge$Comunidade <- NULL
tabela_merge$Cidade <- NULL
tabela_merge$Regiao <-NULL
tabela_merge$nome_cidade <- NULL
tabela_merge$id_regiao <- NULL

#selecionar colunas para o banco
Agricultores <- data.frame(agricultor=tabela_merge$Agricultor.a, sexo=tabela_merge$Sexo,id_comunidade=tabela_merge$id , ano_adesao=tabela_merge$AnoAdesao, 
                           variedade_algodao=tabela_merge$VariedadeAlgodao)
Agricultores = Agricultores[with(Agricultores, order(agricultor)), ]

write.csv(Agricultores, file = "TABELA_AGRICULTORES.csv", row.names = FALSE, na="", quote=FALSE)