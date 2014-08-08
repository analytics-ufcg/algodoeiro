library(RODBC)
library(reshape)
library(data.table)
library(GGally)

#Conexão do Banco de Dados. AlgodoeiroDSN é o Data Source Name com as configurações do BD.
channel <- odbcConnect("AlgodoeiroDSN")
# Foi deixado de fora  Fava(id=4) e Guandu (id=7) 
agricultor_producao = sqlQuery(channel,"SELECT a.id, a.nome_agricultor, r.nome_regiao, p.id_cultura, c.nome_cultura
                               from agricultor a, Cultura c, producao p,  Comunidade co, Regiao r
                               where p.id_agricultor=a.id and p.id_cultura=c.id and co.id = a.id_comunidade and r.id = co.id_regiao
                               and year(p.data_plantio)=2011 and p.id_cultura !=4 and p.id_cultura !=7 order by a.nome_agricultor", stringsAsFactor = FALSE)

agricultor_receita = sqlQuery(channel, "SELECT a.id, a.nome_agricultor, r.nome_regiao,
                              ROUND(SUM(p.quantidade_produzida*v.valor)/ p.area_plantada,2) as receita
                              FROM Regiao r, Producao p, Venda v, Agricultor a, Comunidade c
                              where r.id=v.id_regiao and p.id_cultura=v.id_cultura and year(p.data_plantio)=2011 and 
                              a.id_comunidade=c.id and p.id_agricultor=a.id and c.id_regiao=r.id 
                              group by a.id, r.nome_regiao, a.nome_agricultor, p.area_plantada order by a.nome_agricultor")

close(channel)


agricultor_producao_aux <- agricultor_producao
agricultor_producao_aux$produziu <- 1

agricultor_producao_aux[agricultor_producao_aux$nome_cultura=="Sorgo Forragem",]$nome_cultura <- "SorgoForragem"
agricultor_producao_aux[agricultor_producao_aux$nome_cultura=="Algodão Aroeira",]$nome_cultura <- "Algodao"

# Deixa as culturas do df na horizontal com valores de produziu que no caso esta 1
agricultor_producao_aux <- cast(agricultor_producao_aux, id +nome_agricultor + nome_regiao ~ nome_cultura)
# Coloca 0 onde tem NA
agricultor_producao_aux[is.na(agricultor_producao_aux)] <- 0
#Verifica a frequência de cada cultura
apply(X=agricultor_producao_aux[4:14],2,FUN=function(x) length(which(x==1)))

# Retirando pluma e caroço
agricultor_producao_aux$Pluma <- NULL
agricultor_producao_aux$Caroço <- NULL

# Selecionando as possiveis combinacoes de culturas
combinacoes <- unique(agricultor_producao_aux[4:12])

# Conta a quantidade de vezes que cada combinação aparece
library(plyr)
combinacoes <- ddply(agricultor_producao_aux,colnames(combinacoes),nrow)

setnames(combinacoes, "V1", "Repeticoes")

#Concatena as combinacoes
combinacoesJuntas <- do.call(paste, c(as.list(agricultor_producao_aux[4:12]), sep=""))

#Cria um data frame com as receitas e as combinacoes
agricultor_prod_receita <- data.frame("nome_agricultor"=agricultor_producao_aux$nome_agricultor, "receita"= agricultor_receita$receita, "combinacoes"=combinacoesJuntas)
#Coloca o valor 1 que é para informar que produziu
agricultor_prod_receita$produziu <- 1

#Cria um novo data frame com as colunas de combinações
agricultor_prod_rec<-cast(agricultor_prod_receita, nome_agricultor + receita ~ combinacoes)
# Coloca 0 onde estava NA
agricultor_prod_rec[is.na(agricultor_prod_rec)] <- 0
# Calcula a occorencia das combinações
apply(X=agricultor_prod_rec[3:40],2,FUN=function(x) length(which(x==1)))

#Gráfico Receitas
ggplot(agricultor_prod_receita, aes(x=produziu, y = receita, colour=combinacoes)) +
  geom_point(alpha = 0.3, position = position_jitter(width = .2))+
  facet_grid(combinacoes ~. ) + geom_boxplot(alpha = 0.7, outlier.colour = agricultor_prod_receita$combinacoes) + 
  coord_flip()
