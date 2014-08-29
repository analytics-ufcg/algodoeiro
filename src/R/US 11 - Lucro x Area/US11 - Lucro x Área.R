library(RODBC)
library(reshape)
library(GGally)

channel <- odbcConnect("AlgodoeiroDSN")

agricultor_receita = sqlQuery(channel, "SELECT a.id, a.nome_agricultor, r.nome_regiao, r.id as id_regiao,
                              ROUND(SUM(p.quantidade_produzida*v.valor),2) as receita, p.area_plantada
                              FROM Regiao r, Producao p, Venda v, Agricultor a, Comunidade c
                              where r.id=v.id_regiao and p.id_cultura=v.id_cultura and year(p.data_plantio)=2011 and 
                              a.id_comunidade=c.id and p.id_agricultor=a.id and c.id_regiao=r.id  
                              group by a.id, r.nome_regiao, a.nome_agricultor, p.area_plantada, r.id order by a.nome_agricultor")
custosRegiao = sqlQuery(channel,"SELECT r.id as id_regiao, SUM(c.quantidade*c.valor_unitario) as custo FROM Custo c, Regiao r WHERE r.id = c.id_regiao group by  r.id")

agricultor = merge(agricultor_receita,custosRegiao,by="id_regiao")
agricultor$lucro = agricultor$receita - agricultor$custo

modeloLucroArea = lm(agricultor$lucro ~agricultor$area_plantada)
summary(modeloLucroArea)
plot(agricultor$lucro, agricultor$area_plantada)
abline(lm(agricultor$area_plantada~ agricultor$lucro))

agricultor$lucroPorHa = agricultor$lucro / agricultor$area_plantada
modeloLucroHaArea = lm(agricultor$lucroPorHa ~ agricultor$area_plantada)
summary(modeloLucroHaArea)
plot(agricultor$area_plantada, agricultor$lucroPorHa)
abline(modeloLucroHaArea)
plot(modeloLucroHaArea$residuals)

agricultor$lucroPorHa = agricultor$lucro / agricultor$area_plantada
modeloLucroHaArea = lm(agricultor$lucroPorHa ~ sqrt(agricultor$area_plantada))
summary(modeloLucroHaArea)
plot( sqrt(agricultor$area_plantada), agricultor$lucroPorHa)
abline(lm(agricultor$lucroPorHa~ sqrt(agricultor$area_plantada)))
plot(modeloLucroHaArea$residuals)

modeloReceita = lm(agricultor$receita ~ agricultor$area_plantada)
summary(modeloReceita)
plot( agricultor$area_plantada, agricultor$receita)
abline(modeloReceita)
plot(modeloReceita$residuals)

agricultor$receitaPorHa = agricultor$receita / agricultor$area_plantada
modeloReceitaHa = lm(agricultor$receitaPorHa ~ agricultor$area_plantada)
summary(modeloReceitaHa)
plot( agricultor$area_plantada, agricultor$receitaPorHa)
abline(modeloReceitaHa)
plot(modeloReceitaHa$residuals)

install.packages("nlstools")
library(nls)

agricultorPajeu = subset(agricultor, )
modeloReceita = lm(agricultor$receita ~ agricultor$area_plantada)
summary(modeloReceita)
plot( agricultor$area_plantada, agricultor$receita)
abline(modeloReceita)
plot(modeloReceita$residuals)
