COPY Producao(id_agricultor,id_cultura, area_plantada, quantidade_produzida, data_plantio format 'DD/MM/YYYY') FROM LOCAL '/home/andryw/algodoeiro/src/R/TABELA_PRODUCAO.csv' WITH DELIMITER ',';

COPY Atividade(atividade, unidade) FROM LOCAL '/home/celio/Desenvolvimento/algodoeiro/src/dados/Atividades.csv' WITH DELIMITER ',' SKIP 1;

COPY Custo(id_atividade, id_regiao,quantidade,valor_unitario, area) FROM LOCAL '/home/celio/Desenvolvimento/algodoeiro/src/dados/Custos.csv' WITH DELIMITER ',';

COPY Tecnica_Adotada(id_agricultor,ano,id_tecnica) FROM LOCAL '/home/celio/Desenvolvimento/algodoeiro/src/dados/Tecnicas_adotadas.csv' WITH DELIMITER ',';


DROP TABLE Producao;

CREATE TABLE Producao(id auto_increment, id_agricultor INT, id_cultura INT, area_plantada FLOAT, quantidade_produzida FLOAT, data_plantio DATE, PRIMARY KEY (id), FOREIGN KEY (id_agricultor) REFERENCES Agricultor,  FOREIGN KEY (id_cultura) REFERENCES Cultura (id));

COPY Producao(id_agricultor,id_cultura, area_plantada, quantidade_produzida, data_plantio format 'DD/MM/YYYY') FROM LOCAL '/home/andryw/algodoeiro/src/dados/TABELA_PRODUCAO.csv' WITH DELIMITER ',';
