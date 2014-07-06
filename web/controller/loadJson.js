/*
    Cria metodos de acesso aos JSONs, todos sao requisitados apenas uma vez (na primeira vez),
    isso e feito para evitar multiplas requisicoes ao mesmo JSON.

*/


var receitaURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/receita/2011";
var lucroURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/lucro/2011";
var custosURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regiao/custo/total";
var regioesURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regioes";
var produAgricultoresURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/producao/2011";
var agricultoreURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultores";
var regioesURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regioes";
var mediaProducaoRegiao = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regiao/producao/media/2011";


// Inicializa variaveis
var receita, lucro, custos, regioes, produAgricultores, agricultores, mediaProducaoRegiao;

function getReceita() {
    if(receita == undefined) {
        receita = readJSON(receitaURL);
    }
    
    return receita;
}

function getLucro() {
    if(lucro == undefined) {
        lucro = readJSON(lucroURL);
    }
    
    return lucro;
}

function getLucro() {
    if(custos == undefined) {
        custos = readJSON(custosURL);
    }
    
    return custos;
}

function getRegioes() {
    if(regioes == undefined) {
        regioes = readJSON(regioesURL);
    }
    
    return regioes;
}

function getProduAgricultores() {
    if(produAgricultores == undefined) {
        produAgricultores = readJSON(produAgricultoresURL);
    }
    
    return produAgricultores;
}

function getAgricultores() {
    if(agricultores == undefined) {
        agricultores = readJSON(agricultoresURL);
    }
    
    return agricultores;
}

function getMediaProducaoRegiao() {
    if(mediaProducaoRegiao == undefined) {
        mediaProducaoRegiao = readJSON(mediaProducaoRegiaoURL);
    }
    
    return mediaProducaoRegiao;
}