library(RODBC)


#Conexão do Banco de Dados. AlgodoeiroDSN é o Data Source Name com as configurações do BD.
channel <- odbcConnect("AlgodoeiroDSN")

sqlTables(channel)

tabelas = c("Agricultor","Agricultor_Certificacao","Ano","Atividade","Certificacao","Comunidade","Cultura","Custo",
            "Custo_Regiao","Producao","Regiao","Tecnica","Tecnica_Adotada","Usuario","Valor_Venda","Venda")
for(nome_tabela in tabelas){
  tabela = sqlFetch(channel,nome_tabela)
  write.csv(tabela,paste(nome_tabela,".csv",sep=""),sep=";",row.names=FALSE)
}


?write.csv