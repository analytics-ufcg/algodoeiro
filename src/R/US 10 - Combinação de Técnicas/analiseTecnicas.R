library(RODBC)
library(ggplot2)
library(reshape)
library(car)

#Conexão do Banco de Dados. AlgodoeiroDSN é o Data Source Name com as configurações do BD.
channel <- odbcConnect("AlgodoeiroDSN")

# Buscar combinações de técnicas que influenciam produtividade do algodão
# "Como pesquisador, acesso o sistema para descobrir que conjuntos de técnicas 
# influenciam na produtividade do algodão"
# Ao acessar o sistema, vejo que conjuntos influenciaram na produtividade. Por exemplo, X, Y e Z influenciam positivamente a produtividade.

producao_tecnicas = sqlQuery(channel, "SELECT a.nome_agricultor, p.quantidade_produzida,
                               p.area_plantada, t.nome_tecnica, year(p.data_plantio)
                               from agricultor a, Cultura c, producao p, Tecnica_Adotada ta, Tecnica t
                               where p.id_agricultor = a.id and p.id_cultura = c.id and ta.id_agricultor = a.id
                               and c.id=1 and t.id = ta.id_tecnica", stringsAsFactor = FALSE)

write.csv(file="producao_tecnicas.csv", producao_tecnicas)







agricultor_producao_total <- agricultor_producao
agricultor_producao_total$nome_agricultor <- paste(agricultor_producao_total$nome_agricultor , agricultor_producao_total$year, sep=" ")
agricultor_producao_total <- melt(agricultor_producao_total)

agricultor_producao_total <- subset(agricultor_producao_total, variable=="quantidade_produzida")
agricultor_producao_total <- cast(agricultor_producao_total, nome_agricultor ~ nome_cultura)

close(channel)
