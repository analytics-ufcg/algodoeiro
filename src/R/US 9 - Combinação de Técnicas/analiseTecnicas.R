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

close(channel)

write.csv(file="producao_tecnicas.csv", producao_tecnicas)

# Correçao para produtividade (produtividade = producao/(area)*0.5)
temp = producao_tecnicas
temp$quantidade_produzida[] <- temp$quantidade_produzida/(temp$area_plantada*0.5)
producao_tecnicas$quantidade_produzida <- temp$quantidade_produzida
rm(temp)
colnames(producao_tecnicas)[2] <- "produtividade"

# Correcao do data frame, 0 pra quem nao usa a tecnica, 1 pra quem usa
tabela_tecnicas <- producao_tecnicas
tabela_tecnicas$nome_agricultor <- paste(tabela_tecnicas$nome_agricultor , tabela_tecnicas$year, sep=" ")
tabela_tecnicas <- melt(tabela_tecnicas)

tabela_tecnicas <- subset(tabela_tecnicas, variable=="produtividade")
tabela_tecnicas <- cast(tabela_tecnicas, nome_agricultor ~ nome_tecnica)
tabela_tecnicas[2:17][!is.na(tabela_tecnicas[2:17])] <- 1
tabela_tecnicas[is.na(tabela_tecnicas)] <- 0

# --- correcao do data frame
colnames(tabela_tecnicas)[2] <- "AdubacaoOrganica"
colnames(tabela_tecnicas)[3] <- "AplicacaoDeCaulim"
colnames(tabela_tecnicas)[4] <- "AplicacaoDeNim"
colnames(tabela_tecnicas)[5] <- "AplicacaoDeUrinaDeVaca"
colnames(tabela_tecnicas)[7] <- "CoberturaMorta"
colnames(tabela_tecnicas)[8] <- "CortandoAsAguas"
colnames(tabela_tecnicas)[9] <- "CurvasDeNivel"
colnames(tabela_tecnicas)[11] <- "EnleiramentoDosGarranchos"
colnames(tabela_tecnicas)[12] <- "OutrosBioprotetoresNaturais"
colnames(tabela_tecnicas)[13] <- "PlantioEmNivel"
colnames(tabela_tecnicas)[14] <- "PreparoDoSoloComTraçãoAnimal"
colnames(tabela_tecnicas)[15] <- "PreparoDoSoloComTratorEGrade"
colnames(tabela_tecnicas)[16] <- "QuebraVento"

write.csv(file="tabela_tecnicas.csv", tabela_tecnicas)

par(mfrow=c(1,1))


# Passos a seguir
# --- plotar o gráfico de combinacao de tecnicas x receita
# --- correlacao e analise
# --- refletir quais modelos seguir
# --- gerar modelos de regressao


# falta adicionar a produtividade de algodao no df das tecnicas










#ggpairs(data=tabela_tecnicas[2:17], 
#        upper=list(params=list(corSize=17)), axisLabels='show',
#       lower=list(continuous="smooth", params=c(colour="blue")),
#        na.rm = TRUE)
