library(RODBC)

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
