install.packages("RODBC")
library(RODBC)
channel <- odbcConnect("AlgodoeiroDSN")

############Carregamento dados de comunidade ############
comunidades = sqlQuery(channel, "SELECT * from comunidade order by id" ,
                 stringsAsFactor = FALSE)

regiao = sqlQuery(channel, "SELECT * from regiao order by id" ,
                       stringsAsFactor = FALSE)

cultura = sqlQuery(channel, "SELECT * from cultura order by id" ,
                       stringsAsFactor = FALSE)

agricultor_banco = sqlQuery(channel, "SELECT * from Agricultor order by id", stringsAsFactor = FALSE)

############# Carregando csvs##########
agricultores <- read.csv("Agricultor.csv")

producao <- read.csv("Producao.csv")

plantio <- read.csv("Plantio.csv")

todos_agricultores <- read.csv("Agricultor_tratar.csv")

todos_producao <- read.csv("Producao_tratar.csv")

######################TESTES#####################
##Left outer
#Teste para conferir inconsistencias, caso alguma linha tem NA, entao ela nao tem o id nas outras tabelas
teste <- merge(x = comunidades, y = todos_agricultores, by.x = "nome_comunidade", by.y = "Comunidade", all=FALSE)

##Tabela de Agricultores
teste <- merge(x = todos_agricultores, y = comunidades, by.x = "Comunidade", by.y = "nome_comunidade", all=FALSE)
teste$Comunidade <- NULL
teste$Cidade <- NULL
teste$Regiao <-NULL
teste$nome_cidade <- NULL
teste$id_regiao <- NULL

Agricultores <- data.frame(agricultor=teste$Agricultor.a, sexo=teste$Sexo,id_comunidade=teste$id , ano_adesao=teste$AnoAdesao, 
                           variedade_algodao=teste$VariedadeAlgodao)

write.csv(Agricultores, file = "agricultores.csv", row.names = FALSE)

##Tabela de Plantio
tabela2 <- merge(x = producao, y = Agricultores, by.x = "Agricultor.a", by.y = "agricultor", all = FALSE)
teste <- merge(x = todos_agricultores, y = teste, by.x = "Agricultor.a", by.y = "Agricultor.a", all=FALSE)
