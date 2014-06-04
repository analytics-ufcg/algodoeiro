library(RODBC)
channel <- odbcConnect("AlgodoeiroDSN")

agricultor_banco = sqlQuery(channel, "SELECT a.id, a.nome_agricultor, a.ano_adesao, c.nome_comunidade, r.nome_regiao from agricultor a, comunidade c, regiao r where a.id_comunidade = c.id and c.id_regiao = r.id order by a.nome_agricultor ", stringsAsFactor = FALSE)

############# Carregando csvs##########
#sqlTables(channel)

#todos_producao <- read.csv("Producao_tratar.csv")

##Tabela de Plantio
producao <- read.csv("Producao.csv")

innerJoin <- merge(x = agricultor_banco, y = producao, by.x = "nome_agricultor", by.y = "Agricultor.a", all = FALSE)
outerJoin <- merge(x = agricultor_banco, y = producao, by.x = "nome_agricultor", by.y = "Agricultor.a", all = TRUE)
leftJoin <- merge(x = agricultor_banco, y = producao, by.x = "nome_agricultor", by.y = "Agricultor.a", all.x = TRUE)
rightJoin <- merge(x = agricultor_banco, y = producao, by.x = "nome_agricultor", by.y = "Agricultor.a", all.y = TRUE)

agricultores_prod_sem_adesao = subset(rightJoin,is.na(id))
agricultores_adesao_sem_producao = subset(leftJoin,is.na(Cultura))
nomes_duplicados = agricultor_banco[duplicated(agricultor_banco$nome_agricultor),]$nome_agricultor
nomes_duplicados_tudo = agricultor_banco[agricultor_banco$nome_agricultor %in% nomes_duplicados,]


write.csv(innerJoin,file="producao_com_duplicados.csv")
write.csv(subset(leftJoin,is.na(Cultura))$nome_agricultor,file="agriculores_com_prod_sem_adesao.csv",row.names=FALSE)

######Dados retirados na mão. Modificar!!!!
producao_nova = read.csv(file="producao_com_duplicados.csv")

#Merge com coluna cultura
producao_nova_cultura <- merge(x = producao_nova, y = cultura, by.x = "Cultura", by.y = "nome_cultura", all = TRUE)
producao_nova_cultura = producao_nova_cultura[with(producao_nova_cultura, order(X)), ]

#seleção de colunas para o banco
producao_banco = producao_nova_cultura[,c("id.x","id.y","AreaPlantada","QuantidadeProduzida","DataPlantio")]
colnames(producao_banco) = c("id_agricultor","id_cultura","area_plantada","quantidade_produzida","data_plantio")

write.csv(producao_banco,file="TABELA_PRODUCAO.csv",row.names= FALSE, na="", quote=FALSE)