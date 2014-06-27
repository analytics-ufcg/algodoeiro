library(RODBC)
channel <- odbcConnect("AlgodoeiroDSN")

agricultor_banco = sqlQuery(channel, "SELECT a.id, a.nome_agricultor, a.ano_adesao, c.nome_comunidade, r.nome_regiao from agricultor a, comunidade c, regiao r where a.id_comunidade = c.id and c.id_regiao = r.id order by a.nome_agricultor ", stringsAsFactor = FALSE)
cultura = sqlFetch(channel,"cultura_nova")


producao <- read.csv("PRODUCAO_BD.csv")
cultura <- data.frame("cultura" = unique(producao$Cultura))
cultura$cultura <- as.character(cultura$cultura)
cultura = rbind(cultura,'Palma')
cultura = rbind(cultura,"Mamona")
cultura = cultura[with(cultura, order(cultura)), ]
cultura <- data.frame(cultura)
write.csv(cultura,file="cultura.csv",row.names=FALSE)



producaoOriginal = producao

producao_cultura <- merge(x = producao, y = cultura, by.x = "Cultura", by.y = "nome_cultura", all.x = TRUE)
subset(producao_cultura, is.na(producao_cultura$id))

producao = producao_cultura

producao_agricultor <- merge(x = agricultor_banco, y = producao,
                             by.x = c("nome_agricultor","nome_comunidade"), by.y = c("agricultor","comunidade"), all.y = TRUE)

subset(producao_cultura, is.na(producao_agricultor$id.x))


producao_banco = producao_agricultor[,c("id.x","id.y","area","QuantidadeProduzida","data")]

colnames(producao_banco) = c("id_agricultor","id_cultura","area_plantada","quantidade_produzida","data_plantio")
write.csv(producao_banco,file="TABELA_PRODUCAO_NOVO.csv",row.names= FALSE, na="", quote=FALSE)


producaoFetch = sqlFetch(channel,"Producao")
producao_banco1 = read.csv(file="TABELA_PRODUCAO.csv")
producao_banco1$data_plantio = as.Date(producao_banco1$data_plantio, "%d/%m/%Y")
producao_agricultor <- merge(x = producaoFetch, y = producao_banco1,
                             by = c("id_agricultor","id_cultura","data_plantio"), all = TRUE)

subset(producao_banco1, is.na(producao_banco1$data_plantio))

a = read.csv(file="TABELA_PRODUCAO.csv")








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