library(RODBC)
library(ggplot2)
library(reshape)
library(car)
library(GGally)

#Conexão do Banco de Dados. AlgodoeiroDSN é o Data Source Name com as configurações do BD.
channel <- odbcConnect("AlgodoeiroDSN")

agricultor_producao = sqlQuery(channel, 
                               "SELECT a.id, a.nome_agricultor, year(p.data_plantio),
                               p.quantidade_produzida, p.area_plantada, p.id_cultura, c.nome_cultura ,
r.nome_regiao
                              from agricultor a, Cultura c, producao p,  Comunidade co, Regiao r 
                      where p.id_agricultor=a.id and p.id_cultura=c.id and
          co.id = a.id_comunidade and r.id = co.id_regiao order by a.nome_agricultor
                               ", stringsAsFactor = FALSE)

##Calcula a correlação dos anos de 2010 e 2011 juntos
agricultor_producao_total <- agricultor_producao
agricultor_producao_total = subset(agricultor_producao_total, year==2011)
#agricultor_producao_total$nome_agricultor <- paste(agricultor_producao_total$nome_agricultor , agricultor_producao_total$year, sep=" ")
agricultor_producao_total <- melt(agricultor_producao_total,id=c("nome_agricultor","area_plantada","nome_cultura","nome_regiao"))

agricultor_producao_total <- subset(agricultor_producao_total, variable=="quantidade_produzida")
agricultor_producao_total <- cast(agricultor_producao_total, nome_agricultor + area_plantada + nome_regiao ~ nome_cultura)

# corrige a disposição do dataframe
#finalFrame = reshape(filterFrame,  timevar= "nome_cultura", idvar = "nome_agricultor", direction = "wide")
producao_por_cultura <- agricultor_producao_total

#Muda nome das colunas
colnames(producao_por_cultura)[which(names(producao_por_cultura) == "Algodão Aroeira")] <- "Algodao"
colnames(producao_por_cultura)[which(names(producao_por_cultura) == "Sorgo Forragem")] <- "SorgoForragem"

#Coloca onde tem NA 0 e onde não tem 1
producao_por_cultura[5:16][!is.na(producao_por_cultura[5:16])] <- 1
producao_por_cultura[5:16][is.na(producao_por_cultura[5:16])] <- 0

#Verifica a frequência de cada cultura
apply(X=producao_por_cultura,2,FUN=function(x) length(which(x==1)))

#Retirar culturas com
drops <- c("Pluma","Caroço", "Guandu", "Fava", "Pepino", "MilhoVerde")
producao_por_cultura <- producao_por_cultura[,!(names(producao_por_cultura) %in% drops)]
producao_por_cultura = producao_por_cultura[complete.cases(producao_por_cultura),]

#produtividade 
producao_por_cultura$Algodao <- producao_por_cultura$Algodao/(producao_por_cultura$area_plantada*0.5)
producao_por_cultura$Produtividade <- producao_por_cultura$Algodao/(producao_por_cultura$area_plantada*0.5)



library(MASS)

################ANALISE
reg = lm(producao_por_cultura$Algodao ~ producao_por_cultura$area_plantada)
summary(reg)
cor(producao_por_cultura$Algodao,producao_por_cultura$area_plantada)
png(file = "../resultados_das_analises/producao_algodaoXpresenca_jerimum.png", bg = "white")
plot(producao_por_cultura$Jerimum,producao_por_cultura$Algodao,xlab="Presença Jerimum",ylab="Produção Algodão")
dev.off()

plot(producao_por_cultura$Algodao,producao_por_cultura$area_plantada)


reg = lm(producao_por_cultura$Algodao ~ producao_por_cultura$area_plantada + producao_por_cultura$Feijão
         + producao_por_cultura$Milho + producao_por_cultura$Gergelim)

aov(producao_por_cultura$Algodao ~ producao_por_cultura$area_plantada + producao_por_cultura$Feijão
    + producao_por_cultura$Milho + producao_por_cultura$Gergelim)
summary(reg)

step(reg)

install.packages('fpc')
library(fpc)
db = dbscan(producao_por_cultura$Produtividade,eps = 10)
plot(db,producao_por_cultura$Produtividade)
hist(producao_por_cultura$Produtividade)