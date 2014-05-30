library(RODBC)
channel <- odbcConnect("AlgodoeiroDSN")

############Carregamento dados de comunidade ############
comunidades = sqlQuery(channel, "SELECT * from comunidade order by id" ,
                 stringsAsFactor = FALSE)

############# Carregando csvs##########
agricultores <- read.csv("Agricultor.csv")

plantio <- read.csv("Plantio.csv")


#############TABELA 1##############
c1 <- c(1, 2, 3, 4, 5, 6, 7, 8)
c2 <- c("teste1", "teste2", "teste3", "teste4", "teste5", "teste6", "teste7", "teste8")
c3 <- c(TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE)

tabela1 <- data.frame(c1, c2, c3)

#############TABELA 2##############
c1 <- c(1, 2, 3, 4, 5)
c02 <- c(1, 2, 3, 4, 5)
c03 <- c(1, 2, 3, 4, 5)
c04 <- c(1, 2, 3, 4, 5)
c05 <- c(1, 2, 3, 4, 5)

tabela2 <- data.frame(c1, c02, c03, c04, c05)

#############TABELA 3##############
c1 <- c(1, 2, 1234)
c2 <- c("testeteste1", "testeteste2", "testeteste3")
c3 <- c(TRUE, FALSE, FALSE)

tabela3 <- data.frame(c1, c2, c3)

############# MERGES ##############

#Outer join
merge(x = tabela1, y = tabela2, by = "c1", all = TRUE)
merge(x = tabela2, y = tabela1, by = "c1", all = TRUE)
merge(x = tabela1, y = tabela3, by = "c1", all = TRUE)

#Left outer
merge(x = tabela1, y = tabela2, by = "c1", all.x=TRUE)
merge(x = tabela2, y = tabela1, by = "c1", all.x=TRUE)
merge(x = tabela1, y = tabela3, by = "c1", all.x=TRUE)

#Right outer
merge(x = tabela1, y = tabela2, by = "c1", all.y=TRUE)
merge(x = tabela2, y = tabela1, by = "c1", all.y=TRUE)
merge(x = tabela1, y = tabela3, by = "c1", all.y=TRUE)

#Cross join 
merge(x = tabela1, y = tabela3, by = NULL)
merge(x = tabela1, y = tabela2, by = NULL)

#Inner join
merge(x = tabela1, y = tabela3, by = "c1", all = FALSE)