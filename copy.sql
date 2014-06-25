COPY Producao(id_agricultor,id_cultura, area_plantada, quantidade_produzida, data_plantio format 'DD/MM/YYYY') FROM LOCAL '/home/andryw/algodoeiro/src/R/TABELA_PRODUCAO.csv' WITH DELIMITER ',';

COPY Atividade(id_atividade,atividade) FROM LOCAL '/home/tales/development/algodoeiro/src/dados/Atividades.csv' WITH DELIMITER ',';

COPY Custo(id_atividade, id_regiao, quantidade, valor_unitario, total) FROM LOCAL '/home/tales/development/algodoeiro/src/dados/Custos.csv' WITH DELIMITER ',';
