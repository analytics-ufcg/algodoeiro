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

write.csv(file="producao_tecnicas.csv", producao_tecnicas)

# correçao para produtividade
temp = producao_tecnicas
temp$quantidade_produzida[] <- temp$quantidade_produzida/(temp$area_plantada*0.5)
producao_tecnicas$quantidade_produzida <- temp$quantidade_produzida
rm(temp)
colnames(producao_tecnicas)[2] <- "produtividade"

##Calcula a correlação dos anos de 2010 e 2011 juntos
tabela_tecnicas <- producao_tecnicas
tabela_tecnicas$nome_agricultor <- paste(tabela_tecnicas$nome_agricultor , tabela_tecnicas$year, sep=" ")
tabela_tecnicas <- melt(tabela_tecnicas)

tabela_tecnicas <- subset(tabela_tecnicas, variable=="produtividade")
tabela_tecnicas <- cast(tabela_tecnicas, nome_agricultor ~ nome_tecnica)
tabela_tecnicas[2:17][!is.na(tabela_tecnicas[2:17])] <- 1
tabela_tecnicas[is.na(tabela_tecnicas)] <- 0


write.csv(file="tabela_tecnicas.csv", tabela_tecnicas)

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
