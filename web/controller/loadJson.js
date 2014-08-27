/*
    Cria metodos de acesso aos JSONs, todos sao requisitados apenas uma vez (na primeira vez),
    isso e feito para evitar multiplas requisicoes ao mesmo JSON.

*/
var receitaURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/receita/"; // Precisa adicionar o ano (isso é feito no metodo get)
var lucroURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/lucro/"; // Precisa adicionar o ano (isso é feito no metodo get)
var custosURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regiao/custo/total";
var regioesURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regioes";
var producaoRegiaoURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regiao/producao/"; // Precisa adicionar o ano (isso é feito no metodo get)
var anosURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/anos" // Anos que temos dados

var infoAgricultorURL = "http://0.0.0.0:5001/agricultor/"; // Precisa adicionar o ano e o ID do agricultor 
var produAgricultoresURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/producao/";  // Precisa adicionar o ano (isso é feito no metodo get)
var produtividadeURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/produtividade/"; // Precisa adicionar o ano (isso é feito no metodo get)
var agricultoresURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultores";
var produtoresURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/produtores";
var produtoresAlgodaoURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/produtores/algodao";
var agricultoresCulturasURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/cultura/" // Precisa adicionar o ano (isso é feito no metodo get)

var mediaProducaoRegiaoURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regiao/producao/media/"; // Precisa adicionar o ano (isso é feito no metodo get)
var tecnicasURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/tecnica/" // Precisa adicionar o ano (isso é feito no metodo get)

/*
 * Inicializa variaveis, que irão armazenar os JSONs 
 */ 

var custos, regioes, agricultores, produtores, produtoresAlgodao, producaoRegiao, anos, infoAgricultor;
var receita = {};
var lucro = {};
var producaoAgricultores = {};
var produtividade = {};
var mediasProducaoRegiao = {};
var tecnicas = {};
var agricultoresCulturas = {};

function getCustos() {
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

function getAnos() {
    if(anos == undefined) {
        anos = readJSON(anosURL);
    }
    
    return anos;
}

function getProducaoRegiao(ano){
    producaoRegiao = readJSON(producaoRegiaoURL + ano)
    return producaoRegiao;
}

function filtraAgricultoresRegiao(idRegiao, agricultores) {
    var agricultoresDaRegiao = _.filter(agricultores, function(agricultor) {
        return idRegiao == agricultor.id_regiao;
    });

    return agricultoresDaRegiao;
}
    
function getAgricultores(idRegiao) {
    if(agricultores == undefined) {
        agricultores = readJSON(agricultoresURL);
    }
    
    return filtraAgricultoresRegiao(idRegiao, agricultores);
}

function getProdutores(idRegiao) {
    if(produtores == undefined) {
        produtores = readJSON(produtoresURL);
    }
    
    return filtraAgricultoresRegiao(idRegiao, produtores);
}

function getAllProdutores() {
    if(produtores == undefined) {
        produtores = readJSON(produtoresURL);
    }

    return produtores;
}

function getProdutoresAlgodao(idRegiao) {
    if(produtoresAlgodao == undefined) {
        produtoresAlgodao = readJSON(produtoresAlgodaoURL);
    }
    
    return filtraAgricultoresRegiao(idRegiao, produtoresAlgodao);
    
}

function getProdutorAlgodao() {
    if(produtoresAlgodao == undefined) {
        produtoresAlgodao = readJSON(produtoresAlgodaoURL);
    }
    return produtoresAlgodao;
}

function getReceita(ano) {
    if(!_.has(receita, ano)) {
        receita[ano] = readJSON(receitaURL + ano);
    }
    
    return receita[ano];
}

function getLucro(ano) {
    if(!_.has(lucro, ano)) {
        lucro[ano] = readJSON(lucroURL + ano);
    }
    
    return lucro[ano];
}

function getProduAgricultores(ano) {
    if(!_.has(producaoAgricultores, ano)) {
        producaoAgricultores[ano] = readJSON(produAgricultoresURL + ano);
    }
    
    return producaoAgricultores[ano];    
}

function getProdutividade(ano) {
    if(!_.has(produtividade, ano)) {
        produtividade[ano] = readJSON(produtividadeURL + ano);
    }
    
    return produtividade[ano]; 
}

function getAgricultoresCulturas(ano) {
    if(!_.has(agricultoresCulturas, ano)) {
        agricultoresCulturas[ano] = readJSON(agricultoresCulturasURL + ano);
    }
    
    return agricultoresCulturas[ano];
}

function getMediaProducaoRegiao(ano) {
    if(!_.has(mediasProducaoRegiao,ano)) {
        mediasProducaoRegiao[ano] = readJSON(mediaProducaoRegiaoURL + ano);
    }
    
    return mediasProducaoRegiao[ano];
}

function setMediaProducaoRegiao(novaUrlMediaProducaoRegiao) {
    mediaProducaoRegiaoURL = novaUrlMediaProducaoRegiao;
    readJSON(mediaProducaoRegiaoURL);
}

function getTecnicasAgricultor(idAgricultor, ano){
    if(!_.has(tecnicas,ano)) {
        tecnicas[ano] = readJSON(tecnicasURL+ano);
    }

    // filtra por agricultor
    var tecnicasAgricultor = _.find(tecnicas[ano], function (agricultores) {
        return agricultores.id_agricultor == idAgricultor;
    });
    // Se o agricultor não tiver nenhuma tecnica retorna vazio.
    if (tecnicasAgricultor == undefined){
        tecnicasAgricultor = {};
    }
    return(tecnicasAgricultor);
}

function getTecnicas(ano) {
    if(!_.has(tecnicas,ano)) {
        tecnicas[ano] = readJSON(tecnicasURL+ano);
    }

    return tecnicas[ano];
}

function getInfoAgricultor(id, ano){
    infoAgricultor = readJSON(infoAgricultorURL+id+"/"+ano);

    return infoAgricultor;
}