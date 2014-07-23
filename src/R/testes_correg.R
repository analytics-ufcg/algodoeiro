
# testes correlação

library(GGally)
library(ggplot2)

  
#     Roteiro
# Ter uma visão geral das relações entre as culturas
# Regressão utilizando stepwise das culturas
# Regressão binária
# Regressão binária + stepwise
# Inferência da área baseada em pesquisas
colnames(producao_por_cultura)[2] <- "Algodao"
colnames(producao_por_cultura)[12] <- "MilhoVerde" 
colnames(producao_por_cultura)[15] <- "SorgoForragem"
drops <- c( "Pluma","Caroço", "Guandu", "Fava", "Pepino", "MilhoVerde")
pairs_producao <- producao_por_cultura[,!(names(producao_por_cultura) %in% drops)]

ggpairs(data=pairs_producao, # data.frame with variables
        upper=list(params=list(corSize=9)), axisLabels='show',
        lower=list(continuous="smooth", params=c(colour="blue")),
        columns=2:9, # columns to plot, default to all.
        title="Pairs", # title of the plot
        na.rm = TRUE)



