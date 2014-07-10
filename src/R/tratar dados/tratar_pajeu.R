library(RODBC)
library("reshape")

channel <- odbcConnect("AlgodoeiroDSN")
agricultores = sqlQuery(channel,"select nome_agricultor, nome_comunidade, nome_regiao from agricultor a, comunidade c, 
                        regiao r where a.id_comunidade = c.id and c.id_regiao = r.id
                        and r.nome_regiao = 'Pajeu' order by nome_agricultor")

pajeuProducao2010 = read.csv("Pajeu/pajeu2010.csv",sep=";",stringsAsFactor=FALSE)
pajeuProducao2010 = pajeuProducao2010[with(pajeuProducao2010, order(Agricultor.a)), ]
#ProducaoComunidade = read.csv("Producao-Comunidade.csv",sep=",")

paradaJunta = merge(pajeuProducao2010,agricultores,by.x=c("Agricultor.a","Comunidade"),by.y = c("nome_agricultor","nome_comunidade"),all.x = TRUE)

subset(paradaJunta, is.na(paradaJunta$nome_regiao))

################################
pajeuProducao2010$Sexo = NULL
producaoBD <- melt(pajeuProducao2010, id = c("Agricultor.a","Comunidade", "AreaPlantada","DataPlantio"))
producaoBD = producaoBD[complete.cases(producaoBD$value),]
producaoBD = subset(producaoBD,value>0)

producaoBD <- rename(producaoBD,c("variable" = "Cultura", "value" = "QuantidadeProduzida"))
producaoBD$Cultura <- as.character(producaoBD$Cultura)
producaoBD$Cultura[producaoBD$Cultura == "Algodão.Aroeira"] <- "Algodão Aroeira"
producaoBD$Cultura[producaoBD$Cultura == "Sorgo.Forragem"] <- "Sorgo Forragem"
producaoBD$Cultura[producaoBD$Cultura == "Milho.Verde"] <- "Milho Verde"

write.csv(producaoBD, "Pajeu/pajeu_2010_BD.csv", row.names = F)
#a = read.csv("Pajeu/pajeu_2010_BD.csv")
#b = read.csv("Pajeu/oldpajeu_2010_BD.csv")










channel <- odbcConnect("AlgodoeiroDSN")
agricultores = sqlQuery(channel,"select nome_agricultor, nome_comunidade, nome_regiao from agricultor a, comunidade c, 
                        regiao r where a.id_comunidade = c.id and c.id_regiao = r.id
                        and r.nome_regiao = 'Pajeu' order by nome_agricultor")

pajeuProducao2011 = read.csv("Pajeu/pajeu2011.csv",sep=";",stringsAsFactor=FALSE)
pajeuProducao2011 = pajeuProducao2011[with(pajeuProducao2011, order(agricultor)), ]
#ProducaoComunidade = read.csv("Producao-Comunidade.csv",sep=",")

paradaJunta = merge(pajeuProducao2011,agricultores,by.x=c("agricultor","comunidade"),by.y = c("nome_agricultor","nome_comunidade"),all.x = TRUE)

subset(paradaJunta, is.na(paradaJunta$nome_regiao))

#Agricultor.a  Comunidade Sexo DataPlantio AreaPlantada Algodão.Aroeira.Rama Amendoim Milho Feijão
#NAO TEM ADESAO
#38   José Aldeci  Assent. Santa Rita    M  08/02/2011         0,26                120,0          100,0   70,0
#modificado por José Nildo Limeira da Silva  
#52    José Nildo  Assent. Santa Rita    M  03/02/2011         0,23                 12,0           40,0   20,0
#MODIFICADO Olivia Soares de Souza Nunes
#69 Olivia Soares Comunid. Pilãozinho    F  15/02/2011         0,21                 60,0            160    100
# Colocado Elias Luiz Moraes
#Elias Luiza Moraes
pajeuProducao2011$sexo = NULL
producaoBD <- melt(pajeuProducao2011, id = c("agricultor","comunidade", "area","data"))
producaoBD = producaoBD[complete.cases(producaoBD$value),]
producaoBD = producaoBD[complete.cases(producaoBD$area),]
producaoBD = subset(producaoBD,value>0)

producaoBD <- rename(producaoBD,c("variable" = "Cultura", "value" = "QuantidadeProduzida"))

producaoBD$Cultura <- as.character(producaoBD$Cultura)
producaoBD$Cultura[producaoBD$Cultura == "Algodão.Aroeira"] <- "Algodão Aroeira"
producaoBD$Cultura[producaoBD$Cultura == "Sorgo.Forragem"] <- "Sorgo Forragem"
producaoBD$Cultura[producaoBD$Cultura == "Milho.Verde"] <- "Milho Verde"

producaoBD = producaoBD[with(producaoBD, order(agricultor)), ]

write.csv(producaoBD, "Pajeu/pajeu_2011_BD.csv", row.names = F)
a = read.csv("Pajeu/pajeu_2011_BD.csv")
b = read.csv("Pajeu/pajeu_2011_BD2.csv")
#d = subset(b,QuantidadeProduzida > 0)
#c = subset(a,Cultura == "Pluma")