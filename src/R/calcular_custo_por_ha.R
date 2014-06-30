#setwd('/home/celio/Desenvolvimento/algodoeiro/src/dados')
Custos <- read.csv("Custos.csv")

CustosPorHa <- data.frame("id_atividade"=Custos$id_atividade,
                       "id_regiao"=Custos$id_regiao,
                       "quantidade"=round(Custos$quantidade / Custos$area_produzida, digits=2),
                       "valor_unitario"=Custos$valor_unitario)

write.csv(CustosPorHa,"CustosPorHa.csv",row.names =F)