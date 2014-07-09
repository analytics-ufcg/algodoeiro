/*
    Cria metodos de acesso aos JSONs, todos sao requisitados apenas uma vez (na primeira vez),
    isso e feito para evitar multiplas requisicoes ao mesmo JSON.

*/
var receitaURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/receita/2011";
var lucroURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/lucro/2011";
var custosURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regiao/custo/total";
var regioesURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regioes";

var produAgricultores2011URL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/producao/2011";
var produAgricultores2010URL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/producao/2010";

var agricultoresURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultores";
var mediaProducaoRegiaoURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regiao/producao/media/";


// Inicializa variaveis
var receita, lucro, custos, regioes, produAgricultores2010, produAgricultores2011, agricultores;
var mediasProducaoRegiao = {};
function getReceita() {
    if(receita == undefined) {
        receita = readJSON(receitaURL);
    }
    
    return receita;
}

function setReceita(novaUrlReceita) {
    receitaURL = novaUrlReceita;
    // carregamos o novo Json ja que provavelmente o mesmo va ser usado
    receita = readJSON(receitaURL);
}

function getLucro() {
    if(lucro == undefined) {
        lucro = readJSON(lucroURL);
    }
    
    return lucro;
}

function setLucro(novaUrlLucro) {
    lucroURL = novaUrlLucro;
    lucro = readJSON(lucroURL);
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

function getProduAgricultores(ano) {
    switch(ano) {
        case 2010:
            if(produAgricultores2010 == undefined) {
                produAgricultores2010 = readJSON(produAgricultores2010URL);
            }
            produAgricultores = produAgricultores2010;
            break;
        case 2011:
            if(produAgricultores2011 == undefined) {
                produAgricultores2011 = readJSON(produAgricultores2011URL);
            }
            produAgricultores = produAgricultores2011;    
            break;
    }
    
    return produAgricultores;
}

function setProduAgricultores(novaUrlProduAgricultores) {
    produAgricultoresURL = novaUrlProduAgricultores;
    readJSON (produAgricultoresURL);
}

function getAgricultores(idRegiao) {
    if(agricultores == undefined) {
        agricultores = readJSON(agricultoresURL);
    }
    
    return filtraAgricultoresRegiao(idRegiao, agricultores);

    function filtraAgricultoresRegiao(idRegiao, agricultores) {
        var agricultoresDaRegiao = _.filter(agricultores, function(agricultor) {
            return idRegiao == agricultor.id_regiao;
        });

        return agricultoresDaRegiao;
    }
}

function getMediaProducaoRegiao(ano) {
    if(!_.has(mediasProducaoRegiao,ano)) {
        mediasProducaoRegiao[ano] = readJSON(mediaProducaoRegiaoURL+ano);
    }
    
    return mediasProducaoRegiao[ano];
}

function setMediaProducaoRegiao(novaUrlMediaProducaoRegiao) {
    mediaProducaoRegiaoURL = novaUrlMediaProducaoRegiao;
    readJSON(mediaProducaoRegiaoURL);
}