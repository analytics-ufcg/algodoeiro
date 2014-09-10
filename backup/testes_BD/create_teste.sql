CREATE TABLE Agricultor2(id auto_increment, nome_agricultor VARCHAR(50), sexo VARCHAR(1), ano_adesao INT, PRIMARY KEY (id));
CREATE TABLE Tecnicas2(id auto_increment, nome_tecnica VARCHAR(50), PRIMARY KEY (id));
CREATE TABLE Producao2(id auto_increment, id_agricultor INT, id_cultura INT, area_plantada FLOAT, quantidade_produzida FLOAT, data_plantio DATE, PRIMARY KEY (id), FOREIGN KEY (id_agricultor) REFERENCES Agricultor2);
