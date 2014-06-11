#setwd("/home/celio/Desenvolvimento/dadosEmbrapa/CSVBD")
producaoCariri = read.csv("Producao-Cariri.csv",stringsAsFactors = FALSE)

producaoCariri[producaoCariri == "" | is.na(producaoCariri)] <- NA
  
write.csv(producaoCariri, "Producao-Cariri-Tratado.csv", row.names = F)


install.packages("reshape")
library("reshape")

#Coloca as Culturas e a producao em uma linha
producaoCaririBD <- melt(producaoCariri, id = c("Agricultor.a", "AreaPlantada","DataPlantio"))
producaoCaririBD <- rename(producaoCaririBD,c("variable" = "Cultura", "value" = "QuantidadeProduzida"))

#Remove os NA's das producoes
producaoCaririBD <- producaoCaririBD[complete.cases(producaoCaririBD),]

write.csv(producaoCaririBD, "Producao-Cariri-Tratado-Completo.csv", row.names = F)

