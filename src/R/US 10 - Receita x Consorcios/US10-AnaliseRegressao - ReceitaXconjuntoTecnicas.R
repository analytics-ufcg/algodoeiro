library(RODBC)
library(reshape)
library(data.table)
library(GGally)

#Conexão do Banco de Dados. AlgodoeiroDSN é o Data Source Name com as configurações do BD.
channel <- odbcConnect("AlgodoeiroDSN")
# Foi deixado de fora  Fava(id=4) e Guandu (id=7) 
agricultor_producao = sqlQuery(channel,"SELECT a.id, a.nome_agricultor, r.nome_regiao, p.id_cultura, c.nome_cultura
                               from agricultor a, Cultura c, producao p,  Comunidade co, Regiao r
                               where p.id_agricultor=a.id and p.id_cultura=c.id and co.id = a.id_comunidade and r.id = co.id_regiao
                               and year(p.data_plantio)=2011 and p.id_cultura !=4 and p.id_cultura !=7 order by a.nome_agricultor", 
                               stringsAsFactor = FALSE)

agricultor_receita = sqlQuery(channel, "SELECT a.id, a.nome_agricultor, r.nome_regiao,
                              ROUND(SUM(p.quantidade_produzida*v.valor)/ p.area_plantada,2) as receita, p.area_plantada
                              FROM Regiao r, Producao p, Venda v, Agricultor a, Comunidade c
                              where r.id=v.id_regiao and p.id_cultura=v.id_cultura and year(p.data_plantio)=2011 and 
                              a.id_comunidade=c.id and p.id_agricultor=a.id and c.id_regiao=r.id 
                              group by a.id, r.nome_regiao, a.nome_agricultor, p.area_plantada order by a.nome_agricultor")

close(channel)


agricultor_producao_aux <- agricultor_producao
agricultor_producao_aux$produziu <- 1

agricultor_producao_aux[agricultor_producao_aux$nome_cultura=="Sorgo Forragem",]$nome_cultura <- "SorgoForragem"
agricultor_producao_aux[agricultor_producao_aux$nome_cultura=="Algodão Aroeira",]$nome_cultura <- "Algodao"

# Deixa as culturas do df na horizontal com valores de produziu que no caso esta 1
agricultor_producao_aux <- cast(agricultor_producao_aux, id +nome_agricultor + nome_regiao ~ nome_cultura)
# Coloca 0 onde tem NA
agricultor_producao_aux[is.na(agricultor_producao_aux)] <- 0
#Verifica a frequência de cada cultura
apply(X=agricultor_producao_aux[4:14],2,FUN=function(x) length(which(x==1)))

# Retirando pluma e caroço
agricultor_producao_aux$Pluma <- NULL
agricultor_producao_aux$Caroço <- NULL

# Selecionando as possiveis combinacoes de culturas
combinacoes <- unique(agricultor_producao_aux[4:12])

# Conta a quantidade de vezes que cada combinação aparece
library(plyr)
combinacoes <- ddply(agricultor_producao_aux,colnames(combinacoes),nrow)

setnames(combinacoes, "V1", "Repeticoes")

#Concatena as combinacoes
combinacoesJuntas <- do.call(paste, c(as.list(agricultor_producao_aux[4:12]), sep=""))

quantCulturasProd <- rowSums(agricultor_producao_aux[4:12])
#Cria um data frame com as receitas e as combinacoes
agricultor_prod_receita <- data.frame("nome_agricultor"=agricultor_producao_aux$nome_agricultor, "receita"= agricultor_receita$receita, 
                                      "area_plantada"=agricultor_receita$area_plantada,"combinacoes"=combinacoesJuntas, 
                                      "quantCulturas"=quantCulturasProd)
#Coloca o valor 1 que é para informar que produziu
agricultor_prod_receita$produziu <- 1

#Cria um novo data frame com as colunas de combinações
agricultor_prod_rec<-cast(agricultor_prod_receita, nome_agricultor + receita + area_plantada + quantCulturas~ combinacoes)
# Coloca 0 onde estava NA
agricultor_prod_rec[is.na(agricultor_prod_rec)] <- 0
# Calcula a occorencia das combinações
apply(X=agricultor_prod_rec[3:40],2,FUN=function(x) length(which(x==1)))

library(ggplot2)
#Gráfico Receitas
ggplot(agricultor_prod_receita, aes(x=produziu, y = receita, colour=combinacoes)) +
  geom_point(alpha = 0.3, position = position_jitter(width = .2))+
  facet_grid(combinacoes ~. ) + geom_boxplot(alpha = 0.7, outlier.colour = agricultor_prod_receita$receita) + 
  coord_flip()

ggplot(agricultor_prod_receita, aes(x=produziu, y = receita, colour=combinacoes)) +
  geom_point(alpha = 0.3, position = position_jitter(width = .2))+
  facet_grid(combinacoes ~. )+ coord_flip() + 
  geom_hline(yintercept = quantile(agricultor_prod_receita$receita, probs=0.25)) + 
  geom_hline(yintercept = quantile(agricultor_prod_receita$receita, probs=0.75))

# Separando os mais significativos, acima de 30 ocorrencias de combinações de culturas
cont = table(agricultor_prod_receita$combinacoes)
combMaior30 <- agricultor_prod_receita[agricultor_prod_receita$combinacoes %in% names(cont[cont >=30]),]

ggplot(combMaior30, aes(x=produziu, y = receita, colour=combinacoes)) +
  geom_point(alpha = 0.3, position = position_jitter(width = .2), size = 5)+
  facet_grid(combinacoes ~. ) + geom_boxplot(alpha = 0.7, outlier.colour = agricultor_prod_receita$receita) + 
  coord_flip()

ggplot(combMaior30, aes(x=produziu, y = receita, colour=combinacoes)) +
  geom_point(alpha = 0.3, position = position_jitter(width = .2), size = 5)+
  facet_grid(combinacoes ~. ) + 
  coord_flip() + 
  geom_hline(yintercept = quantile(agricultor_prod_receita$receita, probs=0.25)) + 
  geom_hline(yintercept = quantile(agricultor_prod_receita$receita, probs=0.75))

# Separando os mais significativos, acima de 10 ocorrencias de combinações de culturas
combMaior10 <- agricultor_prod_receita[agricultor_prod_receita$combinacoes %in% names(cont[cont >=10]),]

ggplot(combMaior10, aes(x=produziu, y = receita, colour=combinacoes)) +
  geom_point(alpha = 0.3, position = position_jitter(width = .2), size = 5)+
  facet_grid(combinacoes ~. ) + geom_boxplot(alpha = 0.7, outlier.colour = agricultor_prod_receita$receita) + coord_flip()

ggplot(combMaior10, aes(x=produziu, y = receita, colour=combinacoes)) +
  geom_point(alpha = 0.3, position = position_jitter(width = .2), size = 5)+
  facet_grid(combinacoes ~. ) + coord_flip()+ 
  geom_hline(yintercept = quantile(agricultor_prod_receita$receita, probs=0.25)) + 
  geom_hline(yintercept = quantile(agricultor_prod_receita$receita, probs=0.75))

# Separando os mais significativos, acima de 5 ocorrencias de combinações de culturas
combMaior5 <- agricultor_prod_receita[agricultor_prod_receita$combinacoes %in% names(cont[cont >=5]),]

ggplot(combMaior5, aes(x=produziu, y = receita, colour=combinacoes)) +
  geom_point(alpha = 0.3, position = position_jitter(width = .2), size = 5)+
  facet_grid(combinacoes ~. ) + geom_boxplot(alpha = 0.7, outlier.colour = agricultor_prod_receita$receita) + coord_flip()

ggplot(combMaior5, aes(x=produziu, y = receita, colour=combinacoes)) +
  geom_point(alpha = 0.3, position = position_jitter(width = .2), size = 5)+
  facet_grid(combinacoes ~. ) + coord_flip()+ 
  geom_hline(yintercept = quantile(agricultor_prod_receita$receita, probs=0.25)) + 
  geom_hline(yintercept = quantile(agricultor_prod_receita$receita, probs=0.75))


# Testando correlacao entre a Receita/Área e a Área
cor.test(agricultor_receita$receita, agricultor_receita$area_plantada)

plot(agricultor_receita$receita, agricultor_receita$area_plantada)
abline(lm(agricultor_receita$area_plantada~ agricultor_receita$receita))

# Regressões
#Regressao para quantidade maior 30
reg30 <- lm(agricultor_prod_rec$receita~agricultor_prod_rec$"101100100" +agricultor_prod_rec$"101000100")
summary(reg30)
# Nao representa um bom modelo
#Regressao para quantidade maior 30 e area
reg30 <- lm(agricultor_prod_rec$receita~agricultor_prod_rec$"101100100" +agricultor_prod_rec$"101000100" + agricultor_prod_rec$area_plantada)
summary(reg30)


summary(lm(agricultor_prod_rec$receita~agricultor_prod_rec$"101100100"))
summary(lm(agricultor_prod_rec$receita~agricultor_prod_rec$"101000100"))

# Area
summary(lm(agricultor_prod_rec$receita~agricultor_prod_rec$area_plantada))

# Regressao para quantidade maior 10
summary(lm(agricultor_prod_rec$receita~agricultor_prod_rec$"101100100" +agricultor_prod_rec$"101000100"+
             agricultor_prod_rec$"101001100"+agricultor_prod_rec$"101101100"+agricultor_prod_rec$"111101100"
           +agricultor_prod_rec$"101100101"))

####p-valor um pouco abaixo do alfa
summary(lm(agricultor_prod_rec$receita~agricultor_prod_rec$"101001100"))
plot(agricultor_prod_rec$"101001100",agricultor_prod_rec$receita)
####

summary(lm(agricultor_prod_rec$receita~agricultor_prod_rec$"101101100"))
summary(lm(agricultor_prod_rec$receita~agricultor_prod_rec$"111101100"))
summary(lm(agricultor_prod_rec$receita~agricultor_prod_rec$"101100101"))

# Regressao para quantidade maior 10 com area
summary(lm(agricultor_prod_rec$receita~agricultor_prod_rec$"101100100" +agricultor_prod_rec$"101000100"+
             agricultor_prod_rec$"101001100"+agricultor_prod_rec$"101101100"+agricultor_prod_rec$"111101100"
           +agricultor_prod_rec$"101100101" + agricultor_prod_rec$area_plantada))
#p-valor é abaixo de abaixo do alfa

# Regressao para quantidade maior 10 e menor que 30
summary(lm(agricultor_prod_rec$receita~ agricultor_prod_rec$"101001100"+agricultor_prod_rec$"101101100"+
             agricultor_prod_rec$"111101100"+agricultor_prod_rec$"101100101"))

# Regressao para quantidade maior 10 e menor que 30 com area
summary(lm(agricultor_prod_rec$receita~ agricultor_prod_rec$"101001100"+agricultor_prod_rec$"101101100"+
             agricultor_prod_rec$"111101100"+agricultor_prod_rec$"101100101" + agricultor_prod_rec$area_plantada))
#p-valor é abaixo de abaixo do alfa

# Regressao para quantidade maior 5
reg5 <- lm(agricultor_prod_rec$receita~agricultor_prod_rec$"101100100" +agricultor_prod_rec$"101000100"+
             agricultor_prod_rec$"111100100"+agricultor_prod_rec$"101001100"+agricultor_prod_rec$"101100000"
           +agricultor_prod_rec$"101101100" +agricultor_prod_rec$"111101100"+agricultor_prod_rec$"101100101")
reg5Area <- lm(agricultor_prod_rec$receita~agricultor_prod_rec$"101100100" +agricultor_prod_rec$"101000100"+
                 agricultor_prod_rec$"111100100"+agricultor_prod_rec$"101001100"+agricultor_prod_rec$"101100000"
               +agricultor_prod_rec$"101101100" +agricultor_prod_rec$"111101100"+agricultor_prod_rec$"101100101" + agricultor_prod_rec$area_plantada)
summary(reg5)

####p-valor um pouco abaixo do alfa
summary(lm(agricultor_prod_rec$receita~agricultor_prod_rec$"101001100"))
plot(agricultor_prod_rec$"101001100",agricultor_prod_rec$receita) # nao mostra uma tendencia
####

# Regressao para quantidade maior 5 com area
summary(reg5Area)
#p-valor é abaixo de abaixo do alfa


# Regressao para quantidade maior 5 e menor que 10
summary(lm(agricultor_prod_rec$receita~ agricultor_prod_rec$"111100100"+agricultor_prod_rec$"101100000"))

# Regressao para quantidade maior 5 e menor que 10 com area
summary(lm(agricultor_prod_rec$receita~ agricultor_prod_rec$"111100100"+agricultor_prod_rec$"101100000" + agricultor_prod_rec$area_plantada))
#p-valor é abaixo de abaixo do alfa


library(MASS)
step <- stepAIC(reg5, direction="both")
step$anova

summary(lm(agricultor_prod_rec$receita~ agricultor_prod_rec$"101001100"+agricultor_prod_rec$"111101100"))

# Combinação de culturas + Área
stepArea <- stepAIC(reg5Area, direction="both")
stepArea$anova

summary(lm(agricultor_prod_rec$receita~agricultor_prod_rec$"101001100" + agricultor_prod_rec$area_plantada))


# Quantidade de culturas.
summary(lm(agricultor_prod_rec$receita~ agricultor_prod_rec$quantCulturas))

# Quantidade de culturas + Combinação de culturas
reg5QuantCulturas <- lm(agricultor_prod_rec$receita~agricultor_prod_rec$"101100100" +agricultor_prod_rec$"101000100"+
                              agricultor_prod_rec$"111100100"+agricultor_prod_rec$"101001100"+agricultor_prod_rec$"101100000"
                            +agricultor_prod_rec$"101101100" +agricultor_prod_rec$"111101100"+agricultor_prod_rec$"101100101" + 
                          agricultor_prod_rec$quantCulturas)

summary(reg5QuantCulturas)

stepQuant <- stepAIC(reg5QuantCulturas, direction="both")
stepQuant$anova

summary(lm(agricultor_prod_rec$receita ~ agricultor_prod_rec$"101000100" + 
             agricultor_prod_rec$"101001100" + agricultor_prod_rec$"111101100" + 
             agricultor_prod_rec$"101100101" + agricultor_prod_rec$quantCulturas))


# Área + quantidade de culturas
summary(lm(agricultor_prod_rec$receita~ agricultor_prod_rec$quantCulturas+ agricultor_prod_rec$area_plantada))

# Combinação de culturas + área + quantidade de culturas.
reg5AreaQuantCulturas <- lm(agricultor_prod_rec$receita~agricultor_prod_rec$"101100100" +agricultor_prod_rec$"101000100"+
                              agricultor_prod_rec$"111100100"+agricultor_prod_rec$"101001100"+agricultor_prod_rec$"101100000"
                            +agricultor_prod_rec$"101101100" +agricultor_prod_rec$"111101100"+agricultor_prod_rec$"101100101" + 
                              agricultor_prod_rec$area_plantada + agricultor_prod_rec$quantCulturas)


summary(reg5AreaQuantCulturas)

stepAreaQuant <- stepAIC(reg5AreaQuantCulturas, direction="both")
stepAreaQuant$anova

summary(lm(agricultor_prod_rec$receita ~ agricultor_prod_rec$"101000100" + 
             agricultor_prod_rec$"101001100" + agricultor_prod_rec$"111101100" + 
             agricultor_prod_rec$area_plantada + agricultor_prod_rec$quantCulturas))
