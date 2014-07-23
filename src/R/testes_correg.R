
# testes correlação

library(GGally)
library(ggplot2)

  
#     Roteiro
# Ter uma visão geral das relações entre as culturas
# Regressão utilizando stepwise das culturas
# Regressão binária
# Regressão binária + stepwise
# Inferência da área baseada em pesquisas


ggpairs(data=producao_por_cultura, # data.frame with variables
        upper=list(params=list(corSize=6)), axisLabels='show',
        lower=list(continuous="smooth", params=c(colour="blue")),
        columns=3:11, # columns to plot, default to all.
        title="Pairs", # title of the plot
        na.rm = TRUE)



