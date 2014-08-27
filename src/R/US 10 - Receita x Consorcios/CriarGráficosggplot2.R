require(gridExtra)
install.packages("gridExtra")
png("combinações culturas x rentabilidade.png",width=1000, height = 400)
par(mfrow=c(1,3)) 

plot(agricultor_prod_rec$"101000100", agricultor_prod_rec$receita, xlab="Algodão, Feijão e Milho", ylab="Rentabilidade (receita / ha)")
abline(lm(agricultor_prod_rec$receita~ agricultor_prod_rec$"101000100"))

plot(agricultor_prod_rec$"101001100", agricultor_prod_rec$receita, xlab="Algodão, Feijão, Melancia e Milho", ylab="Rentabilidade (receita / ha)")
abline(lm(agricultor_prod_rec$receita~ agricultor_prod_rec$"101001100"))

plot(agricultor_prod_rec$"111101100", agricultor_prod_rec$receita, xlab="Algodão, Amendoim, Feijão, Gergilim, Melancia e Milho", ylab="Rentabilidade (receita / ha)")
abline(lm(agricultor_prod_rec$receita~ agricultor_prod_rec$"111101100"))
dev.off()


par(mfrow=c(1,2)) 
plot(agricultor_prod_rec$area_plantada, agricultor_prod_rec$receita, xlab="Área", ylab="Rentabilidade (receita / ha)")
abline(lm(agricultor_prod_rec$receita~ agricultor_prod_rec$area_plantada))

plot(agricultor_prod_rec$quantCulturas, agricultor_prod_rec$receita, xlab="Quantidade de culturas", ylab="Rentabilidade (receita / ha)")
abline(lm(agricultor_prod_rec$receita~ agricultor_prod_rec$quantCulturas))



tema = theme(axis.text  = element_text(face="bold", size=14),
             axis.title = element_text(face="bold", size=14))
escala = scale_x_continuous(breaks=c(0,1)) 

plot1 = ggplot(agricultor_prod_rec, aes(x=agricultor_prod_rec$"101000100", y=agricultor_prod_rec$receita)) +
  geom_point(shape=1) + escala +
  geom_smooth(method=lm,   
              se=FALSE) +  xlab("Algodão, Feijão \n e Milho") +  ylab("Rentabilidade (receita / ha)") + tema

plot2 = ggplot(agricultor_prod_rec, aes(x=agricultor_prod_rec$"101001100", y=agricultor_prod_rec$receita)) +
  geom_point(shape=1) + escala +
  geom_smooth(method=lm,   
              se=FALSE) +  xlab("Algodão, Feijão, \n Melancia e Milho") +  ylab("Rentabilidade (receita / ha)") + tema

plot3 = ggplot(agricultor_prod_rec, aes(x=agricultor_prod_rec$"111101100", y=agricultor_prod_rec$receita)) +
  geom_point(shape=1) + escala +
  geom_smooth(method=lm,   
              se=FALSE) +  xlab("Algodão, Amendoim, \n Feijão, Gergilim, \n Melancia e Milho") +  ylab("Rentabilidade (receita / ha)") + tema


  
png("combinacao.png",width = 1000,height=400)
grid.arrange(plot1,plot2,plot3,ncol=3)
dev.off()

png("area e #culturas X rentabilidade.png",width = 800,height=400)
area = ggplot(agricultor_prod_rec, aes(x=agricultor_prod_rec$area_plantada, y=agricultor_prod_rec$receita)) +
  geom_point(shape=1) + 
  geom_smooth(method=lm,   
              se=FALSE) +  xlab("Área (ha)") +  ylab("Rentabilidade (receita / ha)") + tema

quant = ggplot(agricultor_prod_rec, aes(x=agricultor_prod_rec$quantCulturas, y=agricultor_prod_rec$receita)) +
  geom_point(shape=1) + 
  geom_smooth(method=lm,   
              se=FALSE) +  xlab("Quantidade de Culturas do Consórcio") +  ylab("Rentabilidade (receita / ha)") + tema
grid.arrange(area,quant,ncol=2)
dev.off()
