CREATE TABLE Regiao(id auto_increment, nome_regiao VARCHAR(10), PRIMARY KEY (id));

CREATE TABLE Comunidade(id auto_increment, nome_comunidade VARCHAR(50), nome_cidade VARCHAR(50), id_regiao INT, PRIMARY KEY (id), FOREIGN KEY (id_regiao) REFERENCES Regiao (id));

CREATE TABLE Agricultor(id auto_increment, nome_agricultor VARCHAR(250), sexo VARCHAR(1), id_comunidade INT, ano_adesao INT, variedade_algodao VARCHAR(30),PRIMARY KEY (id), FOREIGN KEY (id_comunidade) REFERENCES Comunidade (id));

CREATE TABLE Cultura(id auto_increment, nome_cultura VARCHAR(100), PRIMARY KEY (id));

CREATE TABLE Producao(id auto_increment, id_agricultor INT, id_cultura INT, area_plantada FLOAT, quantidade_produzida FLOAT, data_plantio DATE, PRIMARY KEY (id), FOREIGN KEY (id_agricultor) REFERENCES Agricultor,  FOREIGN KEY (id_cultura) REFERENCES Cultura (id));

CREATE TABLE Atividade(id auto_increment, atividade VARCHAR(40),unidade VARCHAR(10), PRIMARY KEY (id));

CREATE TABLE Ano(ano_producao INT, PRIMARY KEY (ano_producao));

CREATE TABLE Custo_Regiao(id auto_increment, id_atividade INT, id_regiao INT, quantidade FLOAT, valor_unitario FLOAT, area FLOAT,ano INT, PRIMARY KEY (id), FOREIGN KEY (id_atividade) REFERENCES Atividade (id), FOREIGN KEY (id_regiao) REFERENCES Regiao (id), FOREIGN KEY (ano) REFERENCES Ano (ano_producao));

CREATE TABLE Valor_Venda(id auto_increment, id_cultura INT, id_regiao INT, valor float, ano INT, FOREIGN KEY (id_cultura) REFERENCES Cultura (id), FOREIGN KEY (id_regiao) REFERENCES Regiao (id), FOREIGN KEY (ano) REFERENCES Ano (ano_producao));

CREATE TABLE Tecnica(id auto_increment, nome_tecnica VARCHAR(60), PRIMARY KEY (id));

CREATE TABLE Tecnica_Adotada(id auto_increment, id_agricultor INT, ano INT, id_tecnica INT, PRIMARY KEY (id), FOREIGN KEY (id_agricultor) REFERENCES Agricultor (id), FOREIGN KEY (id_tecnica) REFERENCES Tecnica (id));

CREATE TABLE Certificacao(id auto_increment, nome_certificacao VARCHAR(60), nome_simplificado_certificacao VARCHAR(20), PRIMARY KEY (id));

CREATE TABLE Agricultor_Certificacao(id auto_increment, id_agricultor INT,ano_producao INT,id_certificacao INT, PRIMARY KEY (id), FOREIGN KEY (id_agricultor) REFERENCES Agricultor (id), FOREIGN KEY (id_certificacao) REFERENCES Certificacao (id));
