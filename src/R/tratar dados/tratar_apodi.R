library(RODBC)
library("reshape")

channel <- odbcConnect("AlgodoeiroDSN")
agricultores = sqlQuery(channel,"select nome_agricultor, nome_comunidade, nome_regiao from agricultor a, comunidade c, 
                        regiao r where a.id_comunidade = c.id and c.id_regiao = r.id
                        and r.nome_regiao = 'Apodi' order by nome_agricultor")

apodiProducao2010 = read.csv("Apodi/apodi_2010_xls.csv",sep=";")
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
b = read.csv("Apodi/apodi_2011_BD2.csv")



update <- read.csv("../csv_update_area_apodi.csv")



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
sqlUpdate(channel, update_producao_BD, "Producao",fast = TRUE,verbose = TRUE)
