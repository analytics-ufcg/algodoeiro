COPY Producao(id_agricultor,id_cultura, area_plantada, quantidade_produzida, data_plantio format 'DD/MM/YYYY') FROM LOCAL '/home/andryw/algodoeiro/src/R/TABELA_PRODUCAO.csv' WITH DELIMITER ',';

COPY Atividade(atividade, unidade) FROM LOCAL '/home/celio/Desenvolvimento/algodoeiro/src/dados/Atividades.csv' WITH DELIMITER ',' SKIP 1;

COPY Tecnica_Adotada(id_agricultor,ano,id_tecnica) FROM LOCAL '/home/celio/Desenvolvimento/algodoeiro/src/dados/Tecnicas_adotadas.csv' WITH DELIMITER ',';

COPY Producao(id_agricultor,id_cultura, area_plantada, quantidade_produzida, data_plantio format 'DD/MM/YYYY') FROM LOCAL '/home/andryw/algodoeiro/src/dados/TABELA_PRODUCAO.csv' WITH DELIMITER ',';

COPY Ano(ano_producao) FROM LOCAL '/home/celio/Desenvolvimento/algodoeiro/src/dados/Anos.csv' WITH DELIMITER ',' SKIP 1;

COPY Certificacao(nome_certificacao, nome_simplificado_certificacao) FROM LOCAL '/home/celio/Desenvolvimento/algodoeiro/src/dados/Certificacao.csv' WITH DELIMITER ',' SKIP 1;

COPY Agricultor_Certificacao(id_agricultor,ano_producao,id_certificacao) FROM LOCAL '/home/celio/Desenvolvimento/algodoeiro/src/dados/Agricultores_com_Certificacao.csv' WITH DELIMITER ',' SKIP 1;
