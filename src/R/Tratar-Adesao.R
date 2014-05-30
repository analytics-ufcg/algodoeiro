adesaoApodi <- read.csv("Agricultor-Apodi.csv")
#adesaoCariri = read.csv("Agricultor-Cariri.csv")

#Comunidade com nome T.Vermalha sendo trocado por T.Vermelha.
#adesaoCariri$Comunidade[adesaoCariri$Comunidade == "T.Vermalha"] = "T.Vermelha"

# Removendo nomes duplicados comparando o Nome, Comunidade e o Ano de Adesao
agricultoresApodi <- data.frame(unique(adesaoApodi[c("Agricultor.a","Comunidade", "AnoAdesao", "Sexo", "Cidade", "Regiao", "VariedadeAlgodao")]))
#agricultoresCariri = data.frame(unique(adesaoCariri[c("Agricultor.a","Comunidade", "AnoAdesao", "Sexo")]))

# Ordenando os Agricultores por comunidade e Nome para encontrar mais facilmente a inconsistencia dos dados.
agricultoresApodi <- data.frame(agricultoresApodi[order(agricultoresApodi$Comunidade, agricultoresApodi$Agricultor.a),])
#agricultoresCariri = data.frame(agricultoresCariri[order(agricultoresCariri$Comunidade, agricultoresCariri$Agricultor.a),])

#agricultoresApodi <- data.frame(unique(adesaoApodi[c("Agricultor.a","Comunidade", "AnoAdesao", "Sexo")]))

# Cariri
# Marilene Pereira Almeida e Marilene Pereira Almeida / P.A Mandacaru / ano de adesão diferente // Excluido direto no CSV
# Ajeitar na mao Pessoas com Sexo Vazio // José Dimas(remover) / José Nildo Neto / Manuel Juvenal

write.csv(agricultoresApodi, "Agricultor-Apodi-Tratado.csv", row.names = F)
#write.csv(agricultoresCariri, "Agricultor-Cariri-Tratado.csv", row.names = F)