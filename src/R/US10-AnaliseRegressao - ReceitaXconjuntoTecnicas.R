library(RODBC)
library(reshape)

#Conexão do Banco de Dados. AlgodoeiroDSN é o Data Source Name com as configurações do BD.
channel <- odbcConnect("AlgodoeiroDSN")

agricultor_producao = sqlQuery(channel, 
                               "SELECT a.id, a.nome_agricultor, r.nome_regiao ,
                               p.id_cultura, c.nome_cultura, ROUND(p.quantidade_produzida*v.valor/p.area_plantada,2) as receita                              
                              from agricultor a, Cultura c, producao p,  Comunidade co, Regiao r, Venda v
                      where p.id_agricultor=a.id and p.id_cultura=c.id and r.id=v.id_regiao and
          co.id = a.id_comunidade and r.id = co.id_regiao and year(p.data_plantio)=2011 and p.id_cultura=v.id_cultura order by a.nome_agricultor 
                               ", stringsAsFactor = FALSE)

close(channel)


agricultor_producao_aux <- agricultor_producao
agricultor_producao_aux$receita <- 1

agricultor_producao_aux[agricultor_producao_aux$nome_cultura=="Sorgo Forragem",]$nome_cultura <- "SorgoForragem"
# Deixa as culturas do df na horizontal com valores de receita que no caso esta 1
agricultor_producao_aux <- cast(agricultor_producao_aux, nome_agricultor + nome_regiao ~ nome_cultura)
# Coloca 0 onde tem NA
agricultor_producao_aux[is.na(agricultor_producao_aux)] <- 0
#Verifica a frequência de cada cultura
apply(X=agricultor_producao_aux[3:12],2,FUN=function(x) length(which(x==1)))

# Retirando pepino
#agricultor_producao_aux <- agricultor_producao_aux[agricultor_producao_aux$Pepino != 1,]
# Seleciona apenas as combinações possiveis que ocorre mais de uma vez.
#agricultor_producao_aux <- agricultor_producao_aux[duplicated(agricultor_producao_aux[3:12]),]

# Selecionando as possiveis combinacoes de culturas
combinacoes <- unique(agricultor_producao_aux[3:12])

# Conta a quantidade de vezes que cada combinação aparece
library(plyr)
combinacoes <- ddply(agricultor_producao_aux,colnames(combinacoes),nrow)
