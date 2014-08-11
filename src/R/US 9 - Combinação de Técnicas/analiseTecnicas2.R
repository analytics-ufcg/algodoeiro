library(RODBC)
library(ggplot2)
library(reshape)
library(car)
library(GGally)

#Conexão do Banco de Dados. AlgodoeiroDSN é o Data Source Name com as configurações do BD.
channel <- odbcConnect("AlgodoeiroDSN")

producao_tecnicas = sqlQuery(channel, "SELECT distinct a.nome_agricultor, p.quantidade_produzida,
                               p.area_plantada, t.nome_tecnica, year(p.data_plantio)
                               from agricultor a, Cultura c, producao p, Tecnica_Adotada ta, Tecnica t
                               where p.id_agricultor = a.id and p.id_cultura = c.id and ta.id_agricultor = a.id
                               and c.id=1 and t.id = ta.id_tecnica  order by a.nome_agricultor", stringsAsFactor = FALSE)

#write.csv(file="producao_tecnicas.csv", producao_tecnicas)

# correçao para produtividade
temp = producao_tecnicas
temp$quantidade_produzida[] <- temp$quantidade_produzida/(temp$area_plantada*0.5)
producao_tecnicas$quantidade_produzida <- temp$quantidade_produzida
rm(temp)
colnames(producao_tecnicas)[2] <- "produtividade"

##Calcula a correlação dos anos de 2010 e 2011 juntos
tabela_tecnicas <- producao_tecnicas
tabela_tecnicas <- subset(tabela_tecnicas, year==2011)
tabela_tecnicas$nome_agricultor <- paste(tabela_tecnicas$nome_agricultor , tabela_tecnicas$year, sep=" ")
getProd <- unique(tabela_tecnicas[1:2])
tabela_tecnicas <- melt(tabela_tecnicas)


tabela_tecnicas <- subset(tabela_tecnicas, variable=="produtividade")
tabela_tecnicas <- cast(tabela_tecnicas, nome_agricultor ~ nome_tecnica)
tabela_tecnicas[2:17][!is.na(tabela_tecnicas[2:17])] <- 1
tabela_tecnicas[is.na(tabela_tecnicas)] <- 0
#insere a coluna com a produtividade de cada agricultor
tabela_tecnicas$Produtividade <- getProd$produtividade


#write.csv(file="tabela_tecnicas.csv", tabela_tecnicas)

#Verifica a frequência de cada tecnica
apply(X=tabela_tecnicas,2,FUN=function(x) length(which(x==1)))
colnames(tabela_tecnicas)[2] <- "Adubacao.Organica"
colnames(tabela_tecnicas)[3] <- "Aplicacao.De.Caulim"
colnames(tabela_tecnicas)[4] <- "Aplicacao.De.Nim"
colnames(tabela_tecnicas)[5] <- "Aplicacao.De.Urina.De.Vaca"
#colnames(tabela_tecnicas)[6] <- "Biofertilizante"
colnames(tabela_tecnicas)[7] <- "Cobertura.Morta"
colnames(tabela_tecnicas)[8] <- "Cortando.As.Aguas"
colnames(tabela_tecnicas)[9] <- "Curva.De.Nivel"
#colnames(tabela_tecnicas)[10] <- "Desbaste"
colnames(tabela_tecnicas)[11] <- "Enleiramento.Dos.Garranchos"
colnames(tabela_tecnicas)[12] <- "Outros.Bioprotetores.Naturais"
colnames(tabela_tecnicas)[13] <- "Plantio.Em.Nivel"
colnames(tabela_tecnicas)[14] <- "Preparo.Do.Solo.Com.Tracao.Animal"
colnames(tabela_tecnicas)[15] <- "Preparo.Do.Solo.Com.Trator.E.Grade"
colnames(tabela_tecnicas)[16] <- "Quebra.Vento"
#colnames(tabela_tecnicas)[17] <- "Queimada"


# Selecionando as possiveis combinacoes de culturas
combinacoes <- unique(tabela_tecnicas[2:17])

# Conta a quantidade de vezes que cada combinação aparece
library(plyr)
combinacoes <- ddply(tabela_tecnicas,colnames(combinacoes),nrow)
colnames(combinacoes)[17] <- "Repeticoes"
#ordena da maior qtde pra menor
combinacoes <- combinacoes[order(combinacoes[,17], decreasing=TRUE),]

#dividir os grupos e pegar os agricultores desses grupos
grupo1 <- c("Preparo.Do.Solo.Com.Tracao.Animal")
grupo2 <- c("Preparo.Do.Solo.Com.Trator.E.Grade" , "Biofertilizante" ,"Cortando.As.Aguas" , "Desbaste" , "Outros.Bioprotetores.Naturais")
grupo3 <- c("Aplicacao.De.Nim" , "Biofertilizante" , "Cortando.As.Aguas"  ,  "Desbaste" , "Outros.Bioprotetores.Naturais" , "Preparo.Do.Solo.Com.Trator.E.Grade")
grupo4 <- c("Biofertilizante" ,"Cobertura.Morta" , "Desbaste" , "Plantio.Em.Nivel" , "Quebra.Vento" , "Preparo.Do.Solo.Com.Trator.E.Grade")
grupo5 <- c("Curva.De.Nivel" ,"Plantio.Em.Nivel" )
grupo6 <- c("Curva.De.Nivel" ,"Plantio.Em.Nivel", "Preparo.Do.Solo.Com.Trator.E.Grade")

tabela_tecnicas[,(names(tabela_tecnicas) %in% grupo1 == 1)] 
agric1 <- subset(tabela_tecnicas, Preparo.Do.Solo.Com.Tracao.Animal == 1) # & (!(names(tabela_tecnicas) %in% grupo1 )))
#agric1 <- as.data.frame(tabela_tecnicas$nome_agricultor[(names(tabela_tecnicas) %in% grupo1 == TRUE) & (tabela_tecnicas$Preparo.Do.Solo.Com.Tracao.Animal == 1)])
analise_tecX <-  (tabela_tecnicas$Preparo.Do.Solo.Com.Tracao.Animal == 1)
#agricultoresGrupo1 <- subset(tabela_tecnicas, Preparo.Do.Solo.Com.Tracao.Animal == 1 & Preparo.Do.Solo.Com.Trator.E.Grade == 0 & Biofertilizante == 0 & Cortando.As.Aguas == 0 & Desbaste == 0 & Outros.Bioprotetores.Naturais == 0 & Aplicacao.De.Nim == 0 & Quebra.Vento == 0 & Cobertura.Morta == 0 & Plantio.Em.Nivel == 0 )
#keep <- c("nome_agricultor", "Produtividade")
#agricultoresGrupo1 <- agricultoresGrupo1[,keep, drop=FALSE]


par(mfrow=c(4,4))

# reajustar esse df
hist(log(tabela_tecnicas[,2]))
hist(log(tabela_tecnicas[,3]))
hist(log(tabela_tecnicas[,4]))
hist(log(tabela_tecnicas[,5]))
hist(log(tabela_tecnicas[,6]))
hist(log(tabela_tecnicas[,7]))
hist(log(tabela_tecnicas[,8]))
hist(log(tabela_tecnicas[,9]))
hist(log(tabela_tecnicas[,10]))
hist(log(tabela_tecnicas[,11]))
hist(log(tabela_tecnicas[,12]))
hist(log(tabela_tecnicas[,13]))
hist(log(tabela_tecnicas[,14]))
hist(log(tabela_tecnicas[,15]))
hist(log(tabela_tecnicas[,16]))
hist(log(tabela_tecnicas[,17]))


#ggpairs(data=tabela_tecnicas[2:17], 
#        upper=list(params=list(corSize=17)), axisLabels='show',
#       lower=list(continuous="smooth", params=c(colour="blue")),
#        na.rm = TRUE)


close(channel)
