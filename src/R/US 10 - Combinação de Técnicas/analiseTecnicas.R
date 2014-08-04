library(RODBC)
library(ggplot2)
library(reshape)
library(car)

#Conexão do Banco de Dados. AlgodoeiroDSN é o Data Source Name com as configurações do BD.
channel <- odbcConnect("AlgodoeiroDSN")

agricultor_producao = sqlQuery(channel, 
                               
                               "SELECT a.id, a.nome_agricultor, year(p.data_plantio),
                               p.quantidade_produzida, p.area_plantada, p.id_cultura, c.nome_cultura 
                              from agricultor a, Cultura c,
                               producao p where p.id_agricultor=a.id and p.id_cultura=c.id order by a.nome_agricultor", stringsAsFactor = FALSE)


  agricultor_producao_total <- agricultor_producao
  agricultor_producao_total$nome_agricultor <- paste(agricultor_producao_total$nome_agricultor , agricultor_producao_total$year, sep=" ")
  agricultor_producao_total <- melt(agricultor_producao_total)
  
  agricultor_producao_total <- subset(agricultor_producao_total, variable=="quantidade_produzida")
  agricultor_producao_total <- cast(agricultor_producao_total, nome_agricultor ~ nome_cultura)

"SELECT a.id_agri, a.nome_agricultor, p.quantidade_produzida,
                               p.area_plantada, ta.id_tecnica, t.id, t.nome_tecnica, year(p.data_plantio)
                               from agricultor a, Cultura c, producao p, Tecnica_Adotada ta, Tecnica t
                               where p.id = a.id_agri"


# Buscar combinações de técnicas que influenciam produtividade do algodão

# "Como pesquisador, acesso o sistema para descobrir que conjuntos de técnicas 
# influenciam na produtividade do algodão"

# Ao acessar o sistema, vejo que conjuntos influenciaram na produtividade. Por exemplo, X, Y e Z influenciam positivamente a produtividade.

close(channel)
