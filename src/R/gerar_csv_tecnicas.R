path = "/home/tales/development/algodoeiro/src/dados/"
setwd(path)

library(RODBC)
channel <- odbcConnect("AlgodoeiroDSN")

tecnicas_temp = read.csv("Tecnicas_bruto.csv")
#colunas com NA serao excluidas a seguir
tecnicas_temp$Valeta.de.Retenção.de.Água = NULL
tecnicas_temp$Mureta.de.Pedras = NULL
tecnicas_temp$Preparo.do.solo.manual = NULL
tecnicas_temp$Preparo.do.solo.com.Trator.e.Grade = NULL
tecnicas_temp$Desbaste = NULL


agricultor_banco = sqlQuery(channel, "SELECT a.id, a.nome_agricultor, c.nome_comunidade FROM agricultor a, comunidade c WHERE a.id_comunidade = c.id ORDER BY a.nome_agricultor ", stringsAsFactor = FALSE)
tecnicas_temp_agr_comu = tecnicas_temp[,c("Agricultor.a","Comunidade")]

check_agricultores <- merge(x = agricultor_banco, y = tecnicas_temp_agr_comu, by.x = "nome_agricultor", by.y = "Agricultor.a", all.y = TRUE)

agricultores_na_encontrados_no_bd = check_agricultores[is.na(check_agricultores$id),]

library(reshape)
tecnicas <- melt(tecnicas_temp, id=c("Agricultor.a","Comunidade", "Ano"))

tecnicas_usadas = tecnicas[tecnicas$value != "",]
tecnicas_usadas$value = NULL

agricultores_na_encontrados_no_bd$id = NULL
agricultores_na_encontrados_no_bd$nome_comunidade = NULL

write.csv(agricultores_na_encontrados_no_bd, file = "Agricultores_Nao_Econtrados_No_BD.csv", row.names = FALSE, na="", quote=FALSE)
write.csv(tecnicas_usadas, file = "Tecnicas.csv", row.names = FALSE, na="", quote=FALSE)