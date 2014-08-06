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

##Calcula a correlação dos anos de 2010 e 2011 juntos
agricultor_producao_total <- producao_tecnicas
agricultor_producao_total$nome_agricultor <- paste(agricultor_producao_total$nome_agricultor , agricultor_producao_total$year, sep=" ")
agricultor_producao_total <- melt(agricultor_producao_total)

agricultor_producao_total <- subset(agricultor_producao_total, variable=="quantidade_produzida")
agricultor_producao_total <- cast(agricultor_producao_total, nome_agricultor ~ nome_tecnica)

par(mfrow=c(4,4))

# reajustar esse df
hist(log(agricultor_producao_total[,2]))
hist(log(agricultor_producao_total[,3]))
hist(log(agricultor_producao_total[,4]))
hist(log(agricultor_producao_total[,5]))
hist(log(agricultor_producao_total[,6]))
hist(log(agricultor_producao_total[,7]))
hist(log(agricultor_producao_total[,8]))
hist(log(agricultor_producao_total[,9]))
hist(log(agricultor_producao_total[,10]))
hist(log(agricultor_producao_total[,11]))
hist(log(agricultor_producao_total[,12]))
hist(log(agricultor_producao_total[,13]))
hist(log(agricultor_producao_total[,14]))
hist(log(agricultor_producao_total[,15]))
hist(log(agricultor_producao_total[,16]))
hist(log(agricultor_producao_total[,17]))


#ggpairs(data=agricultor_producao_total[2:17], 
#        upper=list(params=list(corSize=17)), axisLabels='show',
#       lower=list(continuous="smooth", params=c(colour="blue")),
#        na.rm = TRUE)


close(channel)
