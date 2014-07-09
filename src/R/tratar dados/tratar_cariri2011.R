library(RODBC)
library("reshape")

channel <- odbcConnect("AlgodoeiroDSN")
agricultores = sqlQuery(channel,"select nome_agricultor, nome_comunidade, nome_regiao from agricultor a, comunidade c, 
                        regiao r where a.id_comunidade = c.id and c.id_regiao = r.id
                        and r.nome_regiao = 'Cariri' order by nome_agricultor")
agricultorestudo = sqlQuery(channel,"select nome_agricultor, nome_comunidade, nome_regiao from agricultor a, comunidade c, 
                        regiao r where a.id_comunidade = c.id and c.id_regiao = r.id
                         order by nome_agricultor")

caririProducao2011 = read.csv("Cariri/CaririProducao2011.csv",sep=";")
caririProducao2011 = caririProducao2011[with(caririProducao2011, order(nome)), ]

paradaJunta = merge(caririProducao2011,agricultores,by.x=c("nome","comunidade"),by.y = c("nome_agricultor","nome_comunidade"),all.x = TRUE)

subset(paradaJunta, is.na(paradaJunta$area))

################################
caririProducao2011$sexo = NULL
producaoCaririBD <- melt(caririProducao2011, id = c("nome","comunidade", "area","data"))
producaoCaririBD = producaoCaririBD[complete.cases(producaoCaririBD),]
producaoCaririBD = subset(producaoCaririBD,value>0)

producaoCaririBD <- rename(producaoCaririBD,c("variable" = "Cultura", "value" = "QuantidadeProduzida"))
producaoCaririBD$Cultura <- as.character(producaoCaririBD$Cultura)
producaoCaririBD$Cultura[producaoCaririBD$Cultura == "Algodão.Aroeira"] <- "Algodão Aroeira"
producaoCaririBD$Cultura[producaoCaririBD$Cultura == "Sorgo.Forragem"] <- "Sorgo Forragem"

#as.Date(producaoCaririBD$data)
write.csv(producaoCaririBD, "Cariri/cariri_2011_BD.csv", row.names = F)

#11  AntonioTeodomiro da Silva    M P. A Paus Brancos 17/02/2011 0.26             100       NA    80     60
#20      Damão  Lopes da Silva    M Cacimba de Cavalo 15/02/2011 0.46             120       NA   130     95
#40 Ivaldo Venturra dos Santos    M        Cacimbinha 05/02/2011 0.30             100       15   120     70
#EXCLUIDO
#29     Edson Bezerra de Souza    M        Cacimbinha 15/02/2011 0.50             160       NA   145     70














library(RODBC)
library("reshape")

channel <- odbcConnect("AlgodoeiroDSN")
agricultores = sqlQuery(channel,"select nome_agricultor, nome_comunidade, nome_regiao from agricultor a, comunidade c, 
                        regiao r where a.id_comunidade = c.id and c.id_regiao = r.id
                        and r.nome_regiao = 'Cariri' order by nome_agricultor")
agricultorestudo = sqlQuery(channel,"select nome_agricultor, nome_comunidade, nome_regiao from agricultor a, comunidade c, 
                            regiao r where a.id_comunidade = c.id and c.id_regiao = r.id
                            order by nome_agricultor")

caririProducao2010 = read.csv("Cariri/CaririProducao2010.csv",sep=";")
caririProducao2010 = caririProducao2010[with(caririProducao2010, order(nome)), ]

#ProducaoComunidade = read.csv("Producao-Comunidade.csv",sep=",")

paradaJunta = merge(caririProducao2010,agricultores,by.x=c("nome","comunidade"),by.y = c("nome_agricultor","nome_comunidade"),all.x = TRUE)

subset(paradaJunta, is.na(paradaJunta$nome_regiao))

################################
caririProducao2010$sexo = NULL
producaoCaririBD <- melt(caririProducao2010, id = c("nome","comunidade", "area","data"))
producaoCaririBD = producaoCaririBD[complete.cases(producaoCaririBD),]

producaoCaririBD = subset(producaoCaririBD,value>0)

producaoCaririBD <- rename(producaoCaririBD,c("variable" = "Cultura", "value" = "QuantidadeProduzida"))
producaoCaririBD$Cultura <- as.character(producaoCaririBD$Cultura)
producaoCaririBD$Cultura[producaoCaririBD$Cultura == "Algodão.Aroeira"] <- "Algodão Aroeira"
producaoCaririBD$Cultura[producaoCaririBD$Cultura == "Sorgo.Forragem"] <- "Sorgo Forragem"
producaoCaririBD$Cultura[producaoCaririBD$Cultura == "Milho.Verde"] <- "Milho Verde"



#Remove os NA's das producoes
producaoCaririBD <- producaoCaririBD[complete.cases(producaoCaririBD),]

write.csv(producaoCaririBD, "Cariri/producao_cariri_2010_bd.csv", row.names = F)
a = read.csv("Cariri/producao_cariri_2010_bd.csv")
b = read.csv("Cariri/producao_cariri_2010_bd2.csv")
#b = subset(b,QuantidadeProduzida != '0,0')

