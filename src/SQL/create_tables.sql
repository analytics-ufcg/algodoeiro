CREATE TABLE Regiao(id auto_increment, nome_regiao VARCHAR(10), PRIMARY KEY (id));

CREATE TABLE Comunidade(id auto_increment, nome_comunidade VARCHAR(50), nome_cidade VARCHAR(50), id_regiao INT, PRIMARY KEY (id), FOREIGN KEY (id_regiao) REFERENCES Regiao (id));

CREATE TABLE Agricultor(id auto_increment, nome_agricultor VARCHAR(100), sexo VARCHAR(1), id_comunidade INT, ano_adesao INT, variedade_algodao VARCHAR(50),PRIMARY KEY (id), FOREIGN KEY (id_comunidade) REFERENCES Comunidade (id));

CREATE TABLE Cultura(id auto_increment, nome_cultura VARCHAR(20), PRIMARY KEY (id));

CREATE TABLE Plantio(id auto_increment, id_agricultor INT, area_plantada FLOAT, data_plantio DATE, PRIMARY KEY (id), FOREIGN KEY (id_agricultor) REFERENCES Agricultor (id));

CREATE TABLE Producao(id auto_increment, id_cultura INT, id_plantio INT, quantidade_produzida FLOAT, PRIMARY KEY (id), FOREIGN KEY (id_cultura) REFERENCES Cultura (id), FOREIGN KEY (id_plantio) REFERENCES Plantio (id));
