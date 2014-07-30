# analise de regressao

library(GGally)
library(RODBC)
library(ggplot2)
library(reshape)
library(car)
library(MASS)

channel <- odbcConnect("AlgodoeiroDSN")

agricultor_producao = sqlQuery(channel, 
                               "SELECT a.id, a.nome_agricultor, year(p.data_plantio),
                               p.quantidade_produzida, p.area_plantada, p.id_cultura, c.nome_cultura from agricultor a, Cultura c,
                               producao p where p.id_agricultor=a.id and p.id_cultura=c.id order by a.nome_agricultor", stringsAsFactor = FALSE)

agricultor_producao_total <- agricultor_producao

  # apenas com o ano de 2011
producao_2011 <- subset(agricultor_producao, agricultor_producao$year == 2011)

producao_2011_cul <- melt(producao_2011)
producao_2011_cul <- subset(producao_2011_cul, variable=="quantidade_produzida")
producao_2011_cul <- cast(producao_2011_cul, nome_agricultor ~ nome_cultura)

colnames(producao_2011_cul)[2] <- "Algodao"
colnames(producao_2011_cul)[14] <- "SorgoForragem"
drops <- c( "Pluma","Caroço", "Guandu", "Fava", "Pepino", "MilhoVerde")
pairs_producao <- producao_2011_cul[,!(names(producao_2011_cul) %in% drops)]

# analisando visualmente a normalidade

  par(mfrow=c(4,4))
  
    # reajustar esse df
    hist(producao_2011_cul$Algodao)
    hist(producao_2011_cul$Amendoim)
    hist(producao_2011_cul$Caroço)
    hist(producao_2011_cul$Fava)
    hist(producao_2011_cul$Feijão)
    hist(producao_2011_cul$Gergelim)
    hist(producao_2011_cul$Guandu)
    hist(producao_2011_cul$Jerimum)
    hist(producao_2011_cul$Melancia)
    hist(producao_2011_cul$Milho)
    hist(producao_2011_cul$Pepino)
    hist(producao_2011_cul$Pluma)
    hist(producao_2011_cul$SorgoForragem)

  # aplicando uma funcao logaritmica, vemos que os dados tendem a seguir uma distribuiçao normal

    hist(log(producao_2011_cul$Algodao))
    hist(log(producao_2011_cul$Amendoim))
    hist(log(producao_2011_cul$Caroço))
    hist(log(producao_2011_cul$Fava))
    hist(log(producao_2011_cul$Feijão))
    hist(log(producao_2011_cul$Gergelim))
    hist(log(producao_2011_cul$Guandu))
    hist(log(producao_2011_cul$Jerimum))
    hist(log(producao_2011_cul$Melancia))
    hist(log(producao_2011_cul$Milho))
    hist(log(producao_2011_cul$Pepino))
    hist(log(producao_2011_cul$Pluma))
    hist(log(producao_2011_cul$SorgoForragem))


#Retirar as culturas abaixo por serem redundantes ou amostragem pequena 
drops <- c("Pluma","Caroço", "Guandu", "Fava", "Pepino")
producao_2011_cul <- producao_2011_cul[,!(names(producao_2011_cul) %in% drops)]


# metrics

  ggpairs(data=log(producao_2011_cul[2:9]), 
          upper=list(params=list(corSize=9)), axisLabels='show',
          lower=list(continuous="smooth", params=c(colour="blue")),
          na.rm = TRUE)


  
  # analise de regressao
  dat <- log(producao_2011_cul[2:9])  
  par(mfrow=c(1,1))

  attach(dat)

    # stepwise manual

  


modelo <- lm(dat$Algodao ~ Gergelim + Jerimum + Milho + Melancia, data=dat) #p-value > 0.05
modelo <- lm(dat$Algodao ~ Gergelim + Jerimum + Milho + Amendoim, data=dat) #p-value > 0.05
modelo <- lm(dat$Algodao ~ Gergelim + Jerimum + Milho + Amendoim, data=dat) #p-value > 0.05 # analisar caso

#multicolinearidade milho-feijao
modelo <- lm(dat$Algodao ~ Feijão + Gergelim + Milho + Jerimum, data=dat) #p-value ok
modelo <- lm(dat$Algodao ~ Milho + Amendoim, data=dat) #p-value ok
modelo <- lm(dat$Algodao ~ Milho + Gergelim, data=dat) #p-value ok # analisar caso
modelo <- lm(dat$Algodao ~ Milho + Melancia, data=dat)
modelo <- lm(dat$Algodao ~ Milho + Jerimum, data=dat)

summary(modelo)


# amedoim (- gergelim, sorgo)
# feijão (- melancia, milho)
# gergelim (- amedoim)
# jerimum (- melancia, )
# melancia (- feijao, jerimim, )
# milho (- feijao, )
# sorgoforragem (- amendoim)















