CREATE TABLE Regiao(id auto_increment, nome_regiao VARCHAR(10), PRIMARY KEY (id));

CREATE TABLE Comunidade(id auto_increment, nome_comunidade VARCHAR(50), nome_cidade VARCHAR(50), id_regiao INT, PRIMARY KEY (id), FOREIGN KEY (id_regiao) REFERENCES Regiao (id));

CREATE TABLE Agricultor(id auto_increment, nome_agricultor, sexo VARCHAR(1), id_comunidade INT, ano_adesao INT, variedade_algodao,PRIMARY KEY (id), FOREIGN KEY (id_comunidade) REFERENCES Comunidade (id));

CREATE TABLE Cultura(id auto_increment, nome_cultura VARCHAR(20), PRIMARY KEY (id));

CREATE TABLE Producao(id auto_increment, id_agricultor INT, id_cultura INT, area_plantada FLOAT, quantidade_produzida FLOAT, data_plantio DATE, PRIMARY KEY (id), FOREIGN KEY (id_agricultor) REFERENCES Agricultor,  FOREIGN KEY (id_cultura) REFERENCES Cultura (id))

COPY Producao(id_agricultor,id_cultura, area_plantada, quantidade_produzida, data_plantio format 'DD/MM/YYYY') FROM LOCAL '/home/andryw/algodoeiro/src/R/TABELA_PRODUCAO.csv' WITH DELIMITER ',';


