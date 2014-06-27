library(RODBC)
library("reshape")

channel <- odbcConnect("AlgodoeiroDSN")
agricultores = sqlQuery(channel,"select nome_agricultor, nome_comunidade, nome_regiao from agricultor a, comunidade c, 
                        regiao r where a.id_comunidade = c.id and c.id_regiao = r.id
                        and r.nome_regiao = 'Apodi' order by nome_agricultor")

apodiProducao2010 = read.csv("Apodi/apodi_2010_xls.csv",sep=",")
apodiProducao2010 = apodiProducao2010[with(apodiProducao2010, order(agricultor)), ]
#54 Josielton de F. Sousa Tabuleiro Grande    M 26/03/2010 0.69               0        0     0      0        0        <NA>
#Josielton de Freitas Sousa  
paradaJunta = merge(apodiProducao2010,agricultores,by.x=c("agricultor","comunidade"),by.y = c("nome_agricultor","nome_comunidade"),all.x = TRUE)

subset(paradaJunta, is.na(paradaJunta$nome_regiao))

################################
apodiProducao2010$sexo = NULL
producaoBD <- melt(apodiProducao2010, id = c("agricultor","comunidade", "area","data"))
producaoBD = producaoBD[complete.cases(producaoBD$value),]
producaoBD = subset(producaoBD,value>0)
producaoBD = producaoBD[with(producaoBD, order(agricultor)), ]

producaoBD <- rename(producaoBD,c("variable" = "Cultura", "value" = "QuantidadeProduzida"))
producaoBD$Cultura <- as.character(producaoBD$Cultura)
producaoBD$Cultura[producaoBD$Cultura == "Algodão.Aroeira"] <- "Algodão Aroeira"

write.csv(producaoBD, "Apodi/apodi_2010_BD.csv", row.names = F)











channel <- odbcConnect("AlgodoeiroDSN")
agricultores = sqlQuery(channel,"select nome_agricultor, nome_comunidade, nome_regiao from agricultor a, comunidade c, 
                        regiao r where a.id_comunidade = c.id and c.id_regiao = r.id
                        and r.nome_regiao = 'Apodi' order by nome_agricultor")

apodiProducao2011 = read.csv("Apodi/apodi_2011_xls.csv",sep=";",stringsAsFactor=FALSE)
apodiProducao2011 = apodiProducao2011[with(apodiProducao2011, order(agricultor)), ]
#ProducaoComunidade = read.csv("Producao-Comunidade.csv",sep=",")

paradaJunta = merge(apodiProducao2011,agricultores,by.x=c("agricultor","comunidade"),by.y = c("nome_agricultor","nome_comunidade"),all.x = TRUE)

subset(paradaJunta, is.na(paradaJunta$nome_regiao))


#21 Francisca Fernandes dos Santos    Santo Antonio    F   NA 02/02/2011              77    28       NA    15      8       10     NA   NA       NA
#Franciscca Fernandes
#40       José Maria de Lima Sales         Brejinho    M   NA 02/02/2011             831   299       NA  1000    150       NA     NA   NA       NA
#José Maria de Lima Silva
#43          Josielton de F. Sousa Tabuleiro Grande    M   NA 02/02/2011             445    78       NA    75     10       10     NA   NA       NA
#Josielton de Freitas Sousa
#63         Rita Edileuza da Costa    Moacir Lucena    F   NA 02/02/2011             300   108       NA   200    100       60     NA   NA       NA
#Rita Edileiza da Costa

################################
apodiProducao2011$sexo = NULL
producaoBD <- melt(apodiProducao2011, id = c("agricultor","comunidade", "area","data"))
producaoBD = producaoBD[complete.cases(producaoBD$value),]
producaoBD = subset(producaoBD,value>0)
producaoBD = producaoBD[with(producaoBD, order(agricultor)), ]


producaoBD <- rename(producaoBD,c("variable" = "Cultura", "value" = "QuantidadeProduzida"))


producaoBD$Cultura <- as.character(producaoBD$Cultura)
producaoBD$Cultura[producaoBD$Cultura == "Algodão.Aroeira"] <- "Algodão Aroeira"
producaoBD$Cultura[producaoBD$Cultura == "Sorgo.Forragem"] <- "Sorgo Forragem"


write.csv(producaoBD, "Apodi/apodi_2011_BD.csv", row.names = F)

a = read.csv("Apodi/apodi_2011_BD.csv")
b = read.csv("Apodi/oldapodi_2011_BD.csv")
