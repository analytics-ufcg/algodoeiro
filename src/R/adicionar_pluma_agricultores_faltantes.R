library(RODBC)
library("reshape")
library(compare)
channel <- odbcConnect("AlgodoeiroDSN")

agricultoresSemPluma  = sqlQuery(channel,"SELECT a.nome_agricultor, year(data_plantio) ,count(*)
                        from agricultor a, comunidade c, 
                        regiao r, producao p, cultura cu where a.id_comunidade = c.id and c.id_regiao = r.id
                        and p.id_agricultor = a.id and cu.id = p.id_cultura and cu.nome_cultura != 'Pluma'
group by a.nome_agricultor, year(data_plantio)  order by a.nome_agricultor")


agricultoresComPluma  = sqlQuery(channel,"SELECT a.nome_agricultor, year(data_plantio) 
                        from agricultor a, comunidade c, 
                        regiao r, producao p, cultura cu where a.id_comunidade = c.id and c.id_regiao = r.id
                        and p.id_agricultor = a.id and cu.id = p.id_cultura and cu.nome_cultura = 'Pluma'
group by a.nome_agricultor, year(data_plantio)  order by a.nome_agricultor")

todosAgricultores  = sqlQuery(channel,"SELECT a.nome_agricultor, year(data_plantio) 
                        from agricultor a, comunidade c, 
                        regiao r, producao p, cultura cu where a.id_comunidade = c.id and c.id_regiao = r.id
                        and p.id_agricultor = a.id and cu.id = p.id_cultura
group by a.nome_agricultor, year(data_plantio)  ,cu.nome_cultura")


todosAgricultores  = sqlQuery(channel,"SELECT a.nome_agricultor, year(data_plantio)  
                        from agricultor a, producao p
                    where p.id_agricultor = a.id and (a.nome_agricultor, year(data_plantio)  ) in 
(SELECT a.nome_agricultor, year(data_plantio) 
                        from agricultor a, producao p, cultura cu where p.id_agricultor = a.id 
            and cu.id = p.id_cultura and cu.nome_cultura = 'Pluma'
group by a.nome_agricultor, year(data_plantio)  order by a.nome_agricultor
)
group by a.nome_agricultor, year(data_plantio) order by a.nome_agricultor")

semId = sqlQuery(channel,"
SELECT a.id, year(data_plantio)  
                        from agricultor a, producao p
                    where p.id_agricultor = a.id and (a.id, year(data_plantio)  ) not in 
(SELECT a.id, year(data_plantio) 
                        from agricultor a, producao p, cultura cu where p.id_agricultor = a.id 
            and cu.id = p.id_cultura and cu.nome_cultura == 'Pluma'
group by a.id, year(data_plantio)  order by a.id
)
group by a.id, year(data_plantio) order by a.id
                 ")

