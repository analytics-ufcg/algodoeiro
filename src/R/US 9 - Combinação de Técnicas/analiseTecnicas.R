library(RODBC)
library(ggplot2)
library(reshape)
library(car)
library(GGally)

#Conexão do Banco de Dados. AlgodoeiroDSN é o Data Source Name com as configurações do BD.
channel <- odbcConnect("AlgodoeiroDSN")

producao_tecnicas = sqlQuery(channel, "SELECT distinct a.nome_agricultor, p.quantidade_produzida,
                             p.area_plantada, t.nome_tecnica, year(p.data_plantio)
                             from agricultor a, Cultura c, producao p, Tecnica_Adotada ta, Tecnica t
                             where p.id_agricultor = a.id and p.id_cultura = c.id and ta.id_agricultor = a.id
                             and c.id=1 and t.id = ta.id_tecnica  order by a.nome_agricultor", stringsAsFactor = FALSE)

close(channel)

#write.csv(file="producao_tecnicas.csv", producao_tecnicas)

# correçao para produtividade
temp = producao_tecnicas
temp$quantidade_produzida[] <- temp$quantidade_produzida/(temp$area_plantada*0.5)
producao_tecnicas$quantidade_produzida <- temp$quantidade_produzida
rm(temp)
colnames(producao_tecnicas)[2] <- "produtividade"

##Calcula a correlação dos anos de 2010 e 2011 juntos
tabela_tecnicas <- producao_tecnicas
tabela_tecnicas <- subset(tabela_tecnicas, year==2011)
tabela_tecnicas$nome_agricultor <- paste(tabela_tecnicas$nome_agricultor , tabela_tecnicas$year, sep=" ")
getProd <- unique(tabela_tecnicas[1:2])
tabela_tecnicas <- melt(tabela_tecnicas)


tabela_tecnicas <- subset(tabela_tecnicas, variable=="produtividade")
tabela_tecnicas <- cast(tabela_tecnicas, nome_agricultor ~ nome_tecnica)
tabela_tecnicas[2:17][!is.na(tabela_tecnicas[2:17])] <- 1
tabela_tecnicas[is.na(tabela_tecnicas)] <- 0
#insere a coluna com a produtividade de cada agricultor
tabela_tecnicas$Produtividade <- getProd$produtividade


#write.csv(file="tabela_tecnicas.csv", tabela_tecnicas)

#Verifica a frequência de cada tecnica
apply(X=tabela_tecnicas,2,FUN=function(x) length(which(x==1)))
colnames(tabela_tecnicas)[2] <- "Adubacao.Organica"
colnames(tabela_tecnicas)[3] <- "Aplicacao.De.Caulim"
colnames(tabela_tecnicas)[4] <- "Aplicacao.De.Nim"
colnames(tabela_tecnicas)[5] <- "Aplicacao.De.Urina.De.Vaca"
#colnames(tabela_tecnicas)[6] <- "Biofertilizante"
colnames(tabela_tecnicas)[7] <- "Cobertura.Morta"
colnames(tabela_tecnicas)[8] <- "Cortando.As.Aguas"
colnames(tabela_tecnicas)[9] <- "Curva.De.Nivel"
#colnames(tabela_tecnicas)[10] <- "Desbaste"
colnames(tabela_tecnicas)[11] <- "Enleiramento.Dos.Garranchos"
colnames(tabela_tecnicas)[12] <- "Outros.Bioprotetores.Naturais"
colnames(tabela_tecnicas)[13] <- "Plantio.Em.Nivel"
colnames(tabela_tecnicas)[14] <- "Preparo.Do.Solo.Com.Tracao.Animal"
colnames(tabela_tecnicas)[15] <- "Preparo.Do.Solo.Com.Trator.E.Grade"
colnames(tabela_tecnicas)[16] <- "Quebra.Vento"
#colnames(tabela_tecnicas)[17] <- "Queimada"


# Selecionando as possiveis combinacoes de culturas
combinacoes <- unique(tabela_tecnicas[2:17])

# Conta a quantidade de vezes que cada combinação aparece
library(plyr)
combinacoes <- ddply(tabela_tecnicas,colnames(combinacoes),nrow)
colnames(combinacoes)[17] <- "Repeticoes"
#ordena da maior qtde pra menor
combinacoes <- combinacoes[order(combinacoes[,17], decreasing=TRUE),]

#dividir os grupos e pegar os agricultores desses grupos
grupo1 <- c("Preparo.Do.Solo.Com.Tracao.Animal")
grupo2 <- c("Preparo.Do.Solo.Com.Trator.E.Grade" , "Biofertilizante" ,"Cortando.As.Aguas" , "Desbaste" , "Outros.Bioprotetores.Naturais")
grupo3 <- c("Aplicacao.De.Nim" , "Biofertilizante" , "Cortando.As.Aguas"  ,  "Desbaste" , "Outros.Bioprotetores.Naturais" , "Preparo.Do.Solo.Com.Trator.E.Grade")
grupo4 <- c("Biofertilizante" ,"Cobertura.Morta" , "Desbaste" , "Plantio.Em.Nivel" , "Quebra.Vento" , "Preparo.Do.Solo.Com.Trator.E.Grade")
grupo5 <- c("Curva.De.Nivel" ,"Plantio.Em.Nivel" )
grupo6 <- c("Curva.De.Nivel" ,"Plantio.Em.Nivel", "Preparo.Do.Solo.Com.Trator.E.Grade")

tabela_tecnicas_aux <- tabela_tecnicas

#Concatena as combinacoes
combinacoesJuntas <- do.call(paste, c(as.list(tabela_tecnicas_aux[2:17]), sep=""))


#Cria um data frame com as receitas e as combinacoes
agricultor_prod <- data.frame("nome_agricultor"=tabela_tecnicas_aux$nome_agricultor, "produtividade"= tabela_tecnicas_aux$Produtividade, "combinacoes"=combinacoesJuntas)
#Coloca o valor 1 que é para informar que produziu
agricultor_prod$produziu <- 1

#Cria um novo data frame com as colunas de combinações
agricultor_prod_comb<-cast(agricultor_prod, nome_agricultor + produtividade ~ combinacoes)
# Coloca 0 onde estava NA
agricultor_prod_comb[is.na(agricultor_prod_comb)] <- 0



# Calcula a occorencia das combinações
apply(X=agricultor_prod_comb[3:68],2,FUN=function(x) length(which(x==1)))

#Gráfico Produtividade
ggplot(agricultor_prod, aes(x=produziu, y = produtividade, colour=combinacoes)) +
  geom_point(alpha = 0.3, position = position_jitter(width = .2))+
  facet_grid(combinacoes ~. )  + # geom_boxplot(alpha = 0.7, outlier.colour = agricultor_prod$produtividade) +
  coord_flip()

ggplot(agricultor_prod, aes(x=produziu, y = produtividade, colour=combinacoes)) +
  geom_point(alpha = 0.3, position = position_jitter(width = .2))+
  facet_grid(combinacoes ~. )+ coord_flip() + 
  geom_hline(yintercept = quantile(agricultor_prod$produtividade, probs=0.25)) + 
  geom_hline(yintercept = quantile(agricultor_prod$produtividade, probs=0.75))


# Separando os mais significativos, acima de 20 ocorrencias de combinações de culturas
cont = table(agricultor_prod$combinacoes)
combMaior20 <- agricultor_prod[agricultor_prod$combinacoes %in% names(cont[cont > 20]),]

ggplot(combMaior20, aes(x=produziu, y = produtividade, colour=combinacoes)) +
  geom_point(alpha = 0.3, position = position_jitter(width = .2), size = 5)+
  facet_grid(combinacoes ~. ) + 
  geom_boxplot(alpha = 0.7, outlier.colour = agricultor_prod$combinacoes) + 
  coord_flip()

ggplot(combMaior20, aes(x=produziu, y = produtividade, colour=combinacoes)) +
  geom_point(alpha = 0.3, position = position_jitter(width = .2), size = 5)+
  facet_grid(combinacoes ~. ) + 
  coord_flip() + 
  geom_hline(yintercept = quantile(agricultor_prod$produtividade, probs=0.25)) + 
  geom_hline(yintercept = quantile(agricultor_prod$produtividade, probs=0.75))


# Separando os mais significativos, acima de 10 ocorrencias de combinações de culturas
cont = table(agricultor_prod$combinacoes)
combMaior10 <- agricultor_prod[agricultor_prod$combinacoes %in% names(cont[cont >= 10]),]

ggplot(combMaior10, aes(x=produziu, y = produtividade, colour=combinacoes)) +
  geom_point(alpha = 0.3, position = position_jitter(width = .2), size = 5)+
  facet_grid(combinacoes ~. ) + 
  #geom_boxplot(alpha = 0.7, outlier.colour = agricultor_prod$combinacoes) + 
  coord_flip()

ggplot(combMaior10, aes(x=produziu, y = produtividade, colour=combinacoes)) +
  geom_point(alpha = 0.3, position = position_jitter(width = .2), size = 5)+
  facet_grid(combinacoes ~. ) + 
  coord_flip() + 
  geom_hline(yintercept = quantile(agricultor_prod$produtividade, probs=0.25)) + 
  geom_hline(yintercept = quantile(agricultor_prod$produtividade, probs=0.75))




# Separando os mais significativos, abaixo de 10 ocorrencias de combinações de culturas
cont = table(agricultor_prod$combinacoes)
combMenor10 <- agricultor_prod[agricultor_prod$combinacoes %in% names(cont[cont < 10]),]

ggplot(combMenor10, aes(x=produziu, y = produtividade, colour=combinacoes)) +
  geom_point(alpha = 0.3, position = position_jitter(width = .2), size = 5)+
  facet_grid(combinacoes ~. ) + 
  #geom_boxplot(alpha = 0.7, outlier.colour = agricultor_prod$combinacoes) + 
  coord_flip()

ggplot(combMenor10, aes(x=produziu, y = produtividade, colour=combinacoes)) +
  geom_point(alpha = 0.3, position = position_jitter(width = .2), size = 5)+
  facet_grid(combinacoes ~. ) + 
  coord_flip() + 
  geom_hline(yintercept = quantile(agricultor_prod$produtividade, probs=0.25)) + 
  geom_hline(yintercept = quantile(agricultor_prod$produtividade, probs=0.75))

