##Analisar correlaçao entre producoes!

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

##Calcula a correlação dos anos de 2010 e 2011 juntos
agricultor_producao_total <- agricultor_producao
agricultor_producao_total$nome_agricultor <- paste(agricultor_producao_total$nome_agricultor , agricultor_producao_total$year, sep=" ")
agricultor_producao_total <- melt(agricultor_producao_total)

agricultor_producao_total <- subset(agricultor_producao_total, variable=="quantidade_produzida")
agricultor_producao_total <- cast(agricultor_producao_total, nome_agricultor ~ nome_cultura)

# corrige a disposição do dataframe
#finalFrame = reshape(filterFrame,  timevar= "nome_cultura", idvar = "nome_agricultor", direction = "wide")
producao_por_cultura <- agricultor_producao_total
# calcula a correlação
corTotalMatrix_spearman = cor(producao_por_cultura[2:15],use="pairwise.complete.obs",method="spearman")
#corMatrix_kendall = cor(producao_por_cultura[2:14],use="pairwise.complete.obs",method="kendall")

spearmanCorTotalDF = data.frame(corTotalMatrix_spearman)

#atribui o nome das culturas nas variaveis
names(spearmanCorTotalDF) <- colnames(producao_por_cultura[-1])
spearmanCorTotalDF = data.frame("Cultura" = colnames(producao_por_cultura[-1]), spearmanCorTotalDF)

#exibe so a correlação em relação ao algodão
correlacaoAlgodaoTotal = head(spearmanCorTotalDF, 1)
correlacaoAlgodaoTotal[correlacaoAlgodaoTotal$Cultura == "Algodão Aroeira"]$Cultura <- "Correlação c/ Algodão"

#Retirar as culturas abaixo por serem redundantes ou amostragem pequena 
drops <- c("Algodão.Aroeira", "Pluma","Caroço", "Guandu", "Fava", "Pepino", "Milho.Verde")
correlacaoAlgodaoTotal <- correlacaoAlgodaoTotal[,!(names(correlacaoAlgodaoTotal) %in% drops)]

#graficos qqplot 
#(algodao + amendoim / algodao + Feijao / algodao +Gergelim / algodao + Jerimum / algodao + Melancia / algodao + Milho / algodao + Sorgo)
#algodao <- producao_por_cultura[,2] 
dfAlgodaoAmendoim <- producao_por_cultura[!is.na(producao_por_cultura[,2]) &!is.na(producao_por_cultura$Amendoim),]
png(file = "CorrelacaoAlgodaoAmendoim.png", bg = "white")
qqplot(dfAlgodaoAmendoim[,2], dfAlgodaoAmendoim$Amendoim, xlab="Algodão Aroeira" , ylab="Amendoim", main="Correlação")
abline(lm(dfAlgodaoAmendoim$Amendoim ~ dfAlgodaoAmendoim[,2]))
dev.off()
#plot(lm(dfAlgodaoAmendoim$Amendoim ~ dfAlgodaoAmendoim[,2]))


dfAlgodaoFeijao <- producao_por_cultura[!is.na(producao_por_cultura[,2]) & !is.na(producao_por_cultura$Feijão),]
png(file = "CorrelacaoAlgodaoFeijao.png", bg = "white")
qqplot(dfAlgodaoFeijao[,2], dfAlgodaoFeijao$Feijão, xlab="Algodão Aroeira", ylab="Feijão", main="Correlação")
abline(lm(dfAlgodaoFeijao$Feijão ~ dfAlgodaoFeijao[,2]))
dev.off()

dfAlgodaoGergelim <- producao_por_cultura[!is.na(producao_por_cultura[,2]) & !is.na(producao_por_cultura$Gergelim),]
png(file = "CorrelacaoAlgodaoGergelim.png", bg = "white")
qqplot(dfAlgodaoGergelim[,2], dfAlgodaoGergelim$Gergelim, xlab="Algodão Aroeira", ylab="Gergelim", main="Correlação")
abline(lm(dfAlgodaoGergelim$Gergelim ~ dfAlgodaoGergelim[,2]))
dev.off()

dfAlgodaoJerimum <- producao_por_cultura[!is.na(producao_por_cultura[,2]) & !is.na(producao_por_cultura$Jerimum),]
png(file = "CorrelacaoAlgodaoJerimum.png", bg = "white")
qqplot(dfAlgodaoJerimum[,2], dfAlgodaoJerimum$Jerimum, xlab="Algodão Aroeira", ylab="Jerimum", main="Correlação")
abline(lm(dfAlgodaoJerimum$Jerimum ~ dfAlgodaoJerimum[,2]))
dev.off()

dfAlgodaoMelancia <- producao_por_cultura[!is.na(producao_por_cultura[,2]) & !is.na(producao_por_cultura$Melancia),]
png(file = "CorrelacaoAlgodaoMelancia.png", bg = "white")
qqplot(dfAlgodaoMelancia[,2], dfAlgodaoMelancia$Melancia, xlab="Algodão Aroeira", ylab="Melancia", main="Correlação")
abline(lm(dfAlgodaoMelancia$Melancia ~ dfAlgodaoMelancia[,2]))
dev.off()

dfAlgodaoMilho <- producao_por_cultura[!is.na(producao_por_cultura[,2]) & !is.na(producao_por_cultura$Milho),]
png(file = "CorrelacaoAlgodaoMilho.png", bg = "white")
qqplot(dfAlgodaoMilho[,2], dfAlgodaoMilho$Milho, xlab="Algodão Aroeira", ylab="Milho", main="Correlação")
abline(lm(dfAlgodaoMilho$Milho ~ dfAlgodaoMilho[,2]))
dev.off()

#Sorgo <- producao_por_cultura[,15] 
dfAlgodaoSorgo <- producao_por_cultura[!is.na(producao_por_cultura[,2]) & !is.na(producao_por_cultura[,14]),]
png(file = "CorrelacaoAlgodaoSorgo.png", bg = "white")
qqplot(dfAlgodaoSorgo[,2], dfAlgodaoSorgo[,15], xlab="Algodão Aroeira", ylab="Sorgo Forragem", main="Correlação")
abline(lm(dfAlgodaoSorgo[,15] ~ dfAlgodaoSorgo[,2]))
dev.off()
write.csv(correlacaoAlgodaoTotal, file="CorrelacaoAlgodao-Culturas.csv")




###Calcula apenas 2011
##cria o dataframe do ano 2011 fazendo reshape das linhas x colunas
agricultor_producao_2011 <- subset(agricultor_producao, year==2011)
df2011 <- melt(agricultor_producao_2011)
df2011 <- subset(df2011, variable=="quantidade_produzida")
df2011 <- cast(df2011,  nome_agricultor ~ nome_cultura)

plot(agricultor_producao_2011$quantidade_produzida)
qqnorm(agricultor_producao_2011$quantidade_produzida);qqline(agricultor_producao_2011$quantidade_produzida)

#filtra o df com as variaveis que interessam
#filterFrame <- agricultor_producao_2011[c("nome_cultura","quantidade_produzida","year" , "nome_agricultor", "id")]

#cor2011 <- melt(filterFrame)
#cor2011 <- subset(cor2011, variable=="quantidade_produzida")
#cor2011 <- cast(cor2011,  nome_agricultor ~ nome_cultura)

# corrige a disposição do dataframe
#finalFrame = reshape(filterFrame,  timevar= "nome_cultura", idvar = "nome_agricultor", direction = "wide")
cor2011 <- df2011
# calcula a correlação
corMatrix_spearman = cor(cor2011[2:14],use="pairwise.complete.obs",method="spearman")
#corMatrix_kendall = cor(finalFrame1[2:45],use="pairwise.complete.obs",method="kendall")

spearmanCorDF = data.frame(corMatrix_spearman)

#atribui o nome das culturas nas variaveis
names(spearmanCorDF) <- colnames(cor2011[-1])
spearmanCorDF = data.frame("Cultura" = colnames(cor2011[-1]), spearmanCorDF)

#exibe so a correlação em relação ao algodão
correlacaoAlgodao = head(spearmanCorDF, 1)
correlacaoAlgodao[correlacaoAlgodao$Cultura == "Algodão Aroeira"]$Cultura <- "Correlação"

#Retirar as culturas abaixo por serem redundantes ou amostragem pequena 
drops <- c("Algodão.Aroeira", "Pluma","Caroço", "Guandu", "Fava", "Pepino")
correlacaoAlgodao <- correlacaoAlgodao[,!(names(correlacaoAlgodao) %in% drops)]

#tmp1 <- subset(agricultor_producao_2011, nome_cultura =="Algodão Aroeira")
#tmp2 <- subset(agricultor_producao_2011, nome_cultura =="Guandu")
#tmp3 <- subset(agricultor_producao_2011, nome_cultura =="Fava")
#tmp4 <- subset(agricultor_producao_2011, nome_cultura =="Pepino")
#tmp5 <- subset(agricultor_producao_2011, nome_cultura =="Amendoim")
#tmp6 <- subset(agricultor_producao_2011, nome_cultura =="Jerimum")
#tmp7 <- subset(agricultor_producao_2011, nome_cultura =="Sorgo Forragem")
#tmp8 <- subset(agricultor_producao_2011, nome_cultura =="Melancia")
#rm(tmp1, tmp2, tmp3, tmp4, tmp5, tmp6, tmp7)

#graficos qqplot 
#(algodao + amendoim / algodao + Feijao / algodao +Gergelim / algodao + Jerimum / algodao + Melancia / algodao + Milho / algodao + Sorgo)
#algodao <- df2011[,2] 
df2011AlgodaoAmendoim <- df2011[!is.na(df2011[,2]) &!is.na(df2011$Amendoim),]
qqplot(df2011AlgodaoAmendoim[,2], df2011AlgodaoAmendoim$Amendoim)
#qqplot(df2011[!is.na(df2011$Amendoim),][,2], df2011[!is.na(df2011$Amendoim),]$Amendoim)
plot(lm(df2011AlgodaoAmendoim[,2] ~ df2011AlgodaoAmendoim$Amendoim))

df2011AlgodaoFeijao <- df2011[!is.na(df2011[,2]) & !is.na(df2011$Feijão),]
qqplot(df2011AlgodaoFeijao[,2], df2011AlgodaoFeijao$Feijão)

df2011AlgodaoGergelim <- df2011[!is.na(df2011[,2]) & !is.na(df2011$Gergelim),]
qqplot(df2011AlgodaoGergelim[,2], df2011AlgodaoGergelim$Gergelim)
#plot(lm(df2011AlgodaoGergelim[,2], df2011AlgodaoGergelim$Gergelim))

df2011AlgodaoJerimum <- df2011[!is.na(df2011[,2]) & !is.na(df2011$Jerimum),]
qqplot(df2011AlgodaoJerimum[,2], df2011AlgodaoGergelim$Jerimum)
#plot(lm(df2011AlgodaoJerimum[,2], df2011AlgodaoGergelim$Jerimum))

df2011AlgodaoMelancia <- df2011[!is.na(df2011[,2]) & !is.na(df2011$Melancia),]
qqplot(df2011AlgodaoMelancia[,2], df2011AlgodaoGergelim$Melancia)
#plot(lm(df2011AlgodaoMelancia[,2], df2011AlgodaoGergelim$Melancia))

df2011AlgodaoMilho <- df2011[!is.na(df2011[,2]) & !is.na(df2011$Milho),]
qqplot(df2011AlgodaoMilho[,2], df2011AlgodaoGergelim$Milho)
#plot(lm(df2011AlgodaoMilho[,2], df2011AlgodaoGergelim$Milho))

df2011AlgodaoSorgo <- df2011[!is.na(df2011[,2]) & !is.na(df2011[,14]),]
qqplot(df2011AlgodaoSorgo[,2], df2011AlgodaoSorgo[,14])
#plot(lm(df2011AlgodaoSorgo[,2], df2011AlgodaoSorgo[,14]))

########SALVAR NO BANCO DE DADOS
#correlacoes = correlacoes[,c("CodDisciplina1","CodDisciplina2","Correlacao")]
#Definte tipos a serem salvos no BD
#varTypes <- c('VARCHAR(8)','VARCHAR(8)','Float')
#names(varTypes) <- colnames(correlacoes)
#sqlDrop(channel,"CorrelacaoDisciplinasPorNotas")
#sqlSave(channel, correlacoes, "CorrelacaoDisciplinasPorNotas", rownames = FALSE,fast=TRUE, append=TRUE,varTypes=varTypes)
close(channel)
