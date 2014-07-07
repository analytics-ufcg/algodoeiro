library(RODBC)
channel <- odbcConnect("AlgodoeiroDSN")

agricultor_banco = sqlQuery(channel, "SELECT a.id, a.nome_agricultor, c.nome_comunidade from agricultor a, comunidade c where a.id_comunidade = c.id order by a.nome_agricultor ", stringsAsFactor = FALSE)
tecnica = sqlQuery(channel, "SELECT * from Tecnica", stringsAsFactor = FALSE)
agricultores_tecnicas <- read.csv("Tecnicas.csv")

agricultor_tecnica <- merge(x = tecnica, y = agricultores_tecnicas,
      by.x = c("nome_tecnica"),by.y = c("variable"), all.y = TRUE)

agricultor_tecnica <- rename(agricultor_tecnica, c(id="id_tecnica"))

agricultor_temp <- merge(x = agricultor_banco, y = agricultor_tecnica,
                            by.x = c("nome_agricultor", "nome_comunidade"),by.y = c("Agricultor.a", "Comunidade"), all.y = TRUE)


agricultor_BD <- data.frame("id_agricultor"=agricultor_temp$id,"ano"=agricultor_temp$Ano, "id_tecnica"=agricultor_temp$id_tecnica)

write.csv(agricultor_BD, "Tecnicas_adotadas.csv",row.names = FALSE)