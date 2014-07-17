library(RODBC)
library(ggplot2)
library(reshape)
library(car)
#Conexão do Banco de Dados. AlgodoeiroDSN é o Data Source Name com as configurações do BD.
channel <- odbcConnect("AlgodoeiroDSN")

agricultor_producao = sqlQuery(channel, 
                               "SELECT a.id, a.nome_agricultor, year(p.data_plantio),
                               p.quantidade_produzida, p.area_plantada, p.id_cultura, c.nome_cultura from agricultor a, Cultura c,
                               producao p where p.id_agricultor=a.id and p.id_cultura=c.id order by a.nome_agricultor", stringsAsFactor = FALSE)

#agricultor_produtividade_2010 <- subset(agricultor_producao, nome_cultura=="Algodão Aroeira" & year==2010)
#agricultor_produtividade_2011 <- subset(agricultor_producao, nome_cultura=="Algodão Aroeira" & year==2011)

#agricultor_produtividade_2011$produtividade <- agricultor_produtividade_2011$quantidade_produzida/(agricultor_produtividade_2011$area_plantada*0.5)


# correçao 
temp = agricultor_producao
temp$quantidade_produzida[] <- temp$quantidade_produzida/(temp$area_plantada*0.5)
agricultor_producao$quantidade_produzida[agricultor_producao$id_cultura == 1] <- temp$quantidade_produzida[agricultor_producao$id_cultura == 1]
rm(temp)

agricultor_produtividade_2010 <- subset(agricultor_producao, year==2010)
df2010 <- melt(agricultor_produtividade_2010)
df2010 <- subset(df2010, variable=="quantidade_produzida")
df2010 <- cast(df2010,  nome_agricultor ~ nome_cultura)

agricultor_produtividade_2011 <- subset(agricultor_producao, year==2011)
df2011 <- melt(agricultor_produtividade_2011)
df2011 <- subset(df2011, variable=="quantidade_produzida")
df2011 <- cast(df2011,  nome_agricultor ~ nome_cultura)

plot(agricultor_produtividade_2011$quantidade_produzida)
qqnorm(agricultor_produtividade_2011$quantidade_produzida);qqline(agricultor_produtividade_2011$quantidade_produzida)

#qdo usa o agricultor producao ta agrupando a quantidade pelo numero de repeticoes da cultura nos anos ...
#filterFrame <- agricultor_producao[c("nome_cultura","quantidade_produzida","year" , "nome_agricultor", "id")]
filterFrame <- agricultor_produtividade_2011[c("nome_cultura","quantidade_produzida","year" , "nome_agricultor", "id")]

cor2011 <- melt(filterFrame)
cor2011 <- subset(cor2011, variable=="quantidade_produzida")
cor2011 <- cast(cor2011,  nome_agricultor ~ nome_cultura)

# corrige a disposição do dataframe
#finalFrame = reshape(filterFrame,  timevar= "nome_cultura", idvar = "nome_agricultor", direction = "wide")

# calcula a correlação
corMatrix_spearman = cor(cor2011[2:14],use="pairwise.complete.obs",method="spearman")
#corMatrix_kendall = cor(finalFrame1[2:45],use="pairwise.complete.obs",method="kendall")

spearmanCorDF = data.frame(corMatrix_spearman)

names(spearmanCorDF) <- colnames(cor2011[-1])
spearmanCorDF = data.frame("Cultura" = colnames(cor2011[-1]), spearmanCorDF)

#exibe so a correlação em relação ao algodão
correlacaoAlgodao = head(spearmanCorDF, 1)
correlacaoAlgodao[correlacaoAlgodao$Cultura == "Algodão Aroeira"]$Cultura <- "Correlação"

#Retirar as culturas abaixo por serem redundantes ou amostragem pequena 
drops <- c("Algodão.Aroeira", "Pluma","Caroço", "Guandu", "Fava", "Pepino")
correlacaoAlgodao <- correlacaoAlgodao[,!(names(correlacaoAlgodao) %in% drops)]

#correlacoes = formataMatrizCorrelacao(spearmanCorDF)

#tmp1 <- subset(agricultor_produtividade_2011, nome_cultura =="Algodão Aroeira")
#tmp2 <- subset(agricultor_produtividade_2011, nome_cultura =="Guandu")
#tmp3 <- subset(agricultor_produtividade_2011, nome_cultura =="Fava")
#tmp4 <- subset(agricultor_produtividade_2011, nome_cultura =="Pepino")
#tmp5 <- subset(agricultor_produtividade_2011, nome_cultura =="Amendoim")
#tmp6 <- subset(agricultor_produtividade_2011, nome_cultura =="Jerimum")
#tmp7 <- subset(agricultor_produtividade_2011, nome_cultura =="Sorgo Forragem")
#rm(tmp1, tmp2, tmp3, tmp4, tmp5, tmp6, tmp7)

#graficos qqplot 
#(algodao + amendoim / algodao + Feijao / algodao +Gergelim / algodao + Jerimum / algodao + Melancia / algodao + Milho / algodao + Sorgo)
#algodao <- df2011[,2] 
dfAlgodaoAmendoim <- df2011[!is.na(df2011[,2]) &!is.na(df2011$Amendoim),]
qqplot(dfAlgodaoAmendoim[,2], dfAlgodaoAmendoim$Amendoim)
#qqplot(df2011[!is.na(df2011$Amendoim),][,2], df2011[!is.na(df2011$Amendoim),]$Amendoim)
plot(lm(dfAlgodaoAmendoim[,2] ~ dfAlgodaoAmendoim$Amendoim))

dfAlgodaoFeijao <- df2011[!is.na(df2011[,2]) & !is.na(df2011$Feijão),]
qqplot(dfAlgodaoFeijao[,2], dfAlgodaoFeijao$Feijão)

dfAlgodaoGergelim <- df2011[!is.na(df2011[,2]) & !is.na(df2011$Gergelim),]
qqplot(dfAlgodaoGergelim[,2], dfAlgodaoGergelim$Gergelim)
#plot(lm(dfAlgodaoGergelim[,2], dfAlgodaoGergelim$Gergelim))

########SALVAR NO BANCO DE DADOS
#correlacoes = correlacoes[,c("CodDisciplina1","CodDisciplina2","Correlacao")]
#Definte tipos a serem salvos no BD
#varTypes <- c('VARCHAR(8)','VARCHAR(8)','Float')
#names(varTypes) <- colnames(correlacoes)
#sqlDrop(channel,"CorrelacaoDisciplinasPorNotas")
#sqlSave(channel, correlacoes, "CorrelacaoDisciplinasPorNotas", rownames = FALSE,fast=TRUE, append=TRUE,varTypes=varTypes)
close(channel)
