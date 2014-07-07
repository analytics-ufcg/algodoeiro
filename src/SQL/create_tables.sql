CREATE TABLE Regiao(id auto_increment, nome_regiao VARCHAR(10), PRIMARY KEY (id));

CREATE TABLE Comunidade(id auto_increment, nome_comunidade VARCHAR(50), nome_cidade VARCHAR(50), id_regiao INT, PRIMARY KEY (id), FOREIGN KEY (id_regiao) REFERENCES Regiao (id));

CREATE TABLE Agricultor(id auto_increment, nome_agricultor, sexo VARCHAR(1), id_comunidade INT, ano_adesao INT, variedade_algodao,PRIMARY KEY (id), FOREIGN KEY (id_comunidade) REFERENCES Comunidade (id));

CREATE TABLE Cultura(id auto_increment, nome_cultura VARCHAR(100), PRIMARY KEY (id));

CREATE TABLE Producao(id auto_increment, id_agricultor INT, id_cultura INT, area_plantada FLOAT, quantidade_produzida FLOAT, data_plantio DATE, PRIMARY KEY (id), FOREIGN KEY (id_agricultor) REFERENCES Agricultor,  FOREIGN KEY (id_cultura) REFERENCES Cultura (id))

CREATE TABLE Atividade(id auto_increment, atividade VARCHAR(40),unidade VARCHAR(10), PRIMARY KEY (id));

CREATE TABLE Custo(id auto_increment, id_atividade INT, id_regiao INT, quantidade FLOAT, valor_unitario FLOAT, area FLOAT, PRIMARY KEY (id), FOREIGN KEY (id_atividade) REFERENCES Atividade (id), FOREIGN KEY (id_regiao) REFERENCES Regiao (id));

CREATE TABLE Venda(id auto_increment, id_cultura INT, id_regiao INT, valor float, FOREIGN KEY (id_cultura) REFERENCES Cultura (id), FOREIGN KEY (id_regiao) REFERENCES Regiao (id))

CREATE TABLE Balanco(id auto_increment, id_agricultor INT, ano VARCHAR(15), receita_total float, custo_total float, lucro float, FOREIGN KEY (id_agricultor) REFERENCES Agricultor (id))

CREATE TABLE Tecnica(id auto_increment, nome_tecnica VARCHAR(60), PRIMARY KEY (id));

CREATE TABLE Tecnica_Adotada(id auto_increment, id_agricultor INT, ano INT, id_tecnica INT, PRIMARY KEY (id), FOREIGN KEY (id_agricultor) REFERENCES Agricultor (id), FOREIGN KEY (id_tecnica) REFERENCES Tecnica (id));
