
# analise de regressao

library(GGally)
library(ggplot2)


# Roteiro

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


pairs(data=pairs_producao,
      lower.panel=panel.smooth,
      upper.panel=panel.cor,
      na.rm=TRUE)