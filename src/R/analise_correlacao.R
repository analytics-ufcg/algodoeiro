library(RODBC)
library(foreach)
channel <- odbcConnect("AlgodoeiroDSN")

agricultor_producao = sqlQuery(channel, 
                               "SELECT a.id, a.nome_agricultor, year(p.data_plantio),
                               p.quantidade_produzida, p.area_plantada, p.id_cultura, c.nome_cultura from agricultor a, Cultura c,
                               producao p where p.id_agricultor=a.id and p.id_cultura=c.id order by a.nome_agricultor", stringsAsFactor = FALSE)

agricultor_produtividade_2010 <- subset(agricultor_producao, nome_cultura=="Algodão Aroeira" & year==2010)
agricultor_produtividade_2011 <- subset(agricultor_producao, nome_cultura=="Algodão Aroeira" & year==2011)

agricultor_produtividade_2011$produtividade <- agricultor_produtividade_2011$quantidade_produzida/(agricultor_produtividade_2011$area_plantada*0.5)


# correçao 
temp = agricultor_producao
temp$quantidade_produzida[] <- temp$quantidade_produzida/(temp$area_plantada*0.5)
agricultor_producao$quantidade_produzida[agricultor_producao$id_cultura == 1] <- temp$quantidade_produzida[agricultor_producao$id_cultura == 1]
rm(temp)
