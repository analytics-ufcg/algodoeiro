channel <- odbcConnect("AlgodoeiroDSN")

pajeuBanco= sqlQuery(channel,"select a.nome_agricultor, p.quantidade_produzida, c.nome_comunidade, r.nome_regiao, cu.nome_cultura from producao p, comunidade c, regiao r, agricultor a, cultura cu
where a.id = p.id_agricultor and a.id_comunidade = c.id and c.id_regiao = r.id and cu.id = p.id_cultura
                            and r.nome_regiao = 'Pajeu'")

pajeu2010 = read.csv("Pajeu/pajeu_2010_BD.csv")
pajeu2011 = read.csv("Pajeu/pajeu_2011_BD.csv")
pajeu2010 <- rename(pajeu2010,c("AreaPlantada" = "area", "DataPlantio" = "data", "Agricultor.a"="agricultor","Comunidade"="comunidade"))


pajeuTudo = rbind(pajeu2010,pajeu2011)

paradaJunta = merge(pajeuTudo,pajeuBanco,by.x=c("agricultor","comunidade","Cultura"),by.y = c("nome_agricultor","nome_comunidade","nome_cultura"),all.x = TRUE)
subset(paradaJunta, is.na(paradaJunta$nome_regiao))


cariri2010 = read.csv("Cariri/producao_cariri_2010_bd.csv")
cariri2011 = read.csv("Cariri/cariri_2011_BD.csv")
cariri2010 <- rename(cariri2010,c("nome" = "agricultor"))
cariri2011 <- rename(cariri2011,c("nome" = "agricultor"))


carirao = rbind(cariri2010,cariri2011)
caririBanco= sqlQuery(channel,"select a.nome_agricultor, p.quantidade_produzida, c.nome_comunidade, r.nome_regiao, cu.nome_cultura from producao p, comunidade c, regiao r, agricultor a, cultura cu
where a.id = p.id_agricultor and a.id_comunidade = c.id and c.id_regiao = r.id and cu.id = p.id_cultura
                            and r.nome_regiao = 'Cariri'")
paradaJunta = merge(carirao,caririBanco,by.x=c("Agricultor.a","Comunidade","Cultura"),by.y = c("nome_agricultor","nome_comunidade","nome_cultura"),all.y = TRUE)
subset(paradaJunta, is.na(paradaJunta$nome_regiao))


#apodi = read.csv("producao_apodi_bd.csv")
apodi2010 = read.csv("Apodi/apodi_2010_BD.csv")
apodi2011 = read.csv("Apodi/apodi_2011_BD.csv")
apodi2011 <- rename(apodi2011,c("AreaPlantada" = "area", "DataPlantio" = "data", "Agricultor.a"="agricultor","Comunidade"="comunidade"))




todos = rbind(pajeu2010,pajeu2011,apodi2010,apodi2011,cariri2010,cariri2011)


todos = todos[with(todos, order(Cultura)), ]


subset(todos,is.na(as.Date(todos$data)))
write.csv(todos, "PRODUCAO_BD_NOVO.csv", row.names = F)


sqlFetch(channel,"cultura")