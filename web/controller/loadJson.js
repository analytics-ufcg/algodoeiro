/*
    Cria metodos de acesso aos JSONs, todos sao requisitados apenas uma vez (na primeira vez),
    isso e feito para evitar multiplas requisicoes ao mesmo JSON.

*/
/*var receitaURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/receita/"; // Precisa adicionar o ano (isso é feito no metodo get)
var lucroURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/lucro/"; // Precisa adicionar o ano (isso é feito no metodo get)
var custosURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regiao/custo/total";
var regioesURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regioes";
var producaoRegiaoURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regiao/producao/"; // Precisa adicionar o ano (isso é feito no metodo get)
var anosURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/anos" // Anos que temos dados

var infoAgricultorURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/"; // Precisa adicionar o ano e o ID do agricultor 
var produAgricultoresURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/producao/";  // Precisa adicionar o ano (isso é feito no metodo get)
var produtividadeURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/produtividade/"; // Precisa adicionar o ano (isso é feito no metodo get)
var agricultoresURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultores";
var produtoresURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/produtores";
var produtoresAlgodaoURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/produtores/algodao";
var agricultoresCulturasURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/cultura/" // Precisa adicionar o ano (isso é feito no metodo get)

var mediaProducaoRegiaoURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regiao/producao/media/"; // Precisa adicionar o ano (isso é feito no metodo get)
var tecnicasURL = "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/tecnica/" // Precisa adicionar o ano (isso é feito no metodo get)
*/
var receitaURL = "http://0.0.0.0:5001/agricultor/receita/"; // Precisa adicionar o ano (isso é feito no metodo get)
var lucroURL = "http://0.0.0.0:5001/agricultor/lucro/"; // Precisa adicionar o ano (isso é feito no metodo get)
var custosURL = "http://0.0.0.0:5001/regiao/custo/total";
var regioesURL = "http://0.0.0.0:5001/regioes";
var producaoRegiaoURL = "http://0.0.0.0:5001/regiao/producao/"; // Precisa adicionar o ano (isso é feito no metodo get)
var anosURL = "http://0.0.0.0:5001/anos" // Anos que temos dados

var infoAgricultorURL = "http://0.0.0.0:5001/agricultor/"; // Precisa adicionar o ano e o ID do agricultor 
var produAgricultoresURL = "http://0.0.0.0:5001/agricultor/producao/";  // Precisa adicionar o ano (isso é feito no metodo get)
var produtividadeURL = "http://0.0.0.0:5001/agricultor/produtividade/"; // Precisa adicionar o ano (isso é feito no metodo get)
var agricultoresURL = "http://0.0.0.0:5001/agricultores";
var produtoresURL = "http://0.0.0.0:5001/produtores";
var produtoresAlgodaoURL = "http://0.0.0.0:5001/produtores/algodao";
var agricultoresCulturasURL = "http://0.0.0.0:5001/agricultor/cultura/" // Precisa adicionar o ano (isso é feito no metodo get)

var mediaProducaoRegiaoURL = "http://0.0.0.0:5001/regiao/producao/media/"; // Precisa adicionar o ano (isso é feito no metodo get)
var tecnicasURL = "http://0.0.0.0:5001/agricultor/tecnica/" // Precisa adicionar o ano (isso é feito no metodo get)
var loginURL = "http://0.0.0.0:5001/login/"


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
        agricultores = readJSON(agricultoresURL+ "/"+ usuarioLogin + "/" + passwordLogin);
    }
    
    return filtraAgricultoresRegiao(idRegiao, agricultores);
}

function getProdutores(idRegiao) {
    if(produtores == undefined) {
        produtores = readJSON(produtoresURL+ "/"+ usuarioLogin + "/" + passwordLogin);
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
        produtoresAlgodao = readJSON(produtoresAlgodaoURL+ "/"+ usuarioLogin + "/" + passwordLogin);
    }
    
    return filtraAgricultoresRegiao(idRegiao, produtoresAlgodao);
    
}

function getProdutorAlgodao() {
    if(produtoresAlgodao == undefined) {
        produtoresAlgodao = readJSON(produtoresAlgodaoURL+ "/"+ usuarioLogin + "/" + passwordLogin);
    }
    return produtoresAlgodao;
}

function getReceita(ano) {
    if(!_.has(receita, ano)) {
        receita[ano] = readJSON(receitaURL + ano+ "/"+ usuarioLogin + "/" + passwordLogin);
    }
    
    return receita[ano];
}

function getLucro(ano) {
    if(!_.has(lucro, ano)) {
        lucro[ano] = readJSON(lucroURL + ano+ "/"+ usuarioLogin + "/" + passwordLogin);
    }
    
    return lucro[ano];
}

function getProduAgricultores(ano) {
    if(!_.has(producaoAgricultores, ano)) {
        producaoAgricultores[ano] = readJSON(produAgricultoresURL + ano + "/"+ usuarioLogin + "/" + passwordLogin);
    }
    
    return producaoAgricultores[ano];    
}

function getProdutividade(ano) {
    if(!_.has(produtividade, ano)) {
        produtividade[ano] = readJSON(produtividadeURL + ano+ "/"+ usuarioLogin + "/" + passwordLogin);
    }
    
    return produtividade[ano]; 
}

function getAgricultoresCulturas(ano) {
    if(!_.has(agricultoresCulturas, ano)) {
        agricultoresCulturas[ano] = readJSON(agricultoresCulturasURL + ano+ "/"+ usuarioLogin + "/" + passwordLogin);
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
        tecnicas[ano] = readJSON(tecnicasURL+ano+ "/"+ usuarioLogin + "/" + passwordLogin);
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
    infoAgricultor = readJSON(infoAgricultorURL+id+"/"+ano+ "/"+ usuarioLogin + "/" + passwordLogin);

    return infoAgricultor;
}

function estaLogado(usuario, senha){
    logado = readJSON(loginURL + usuario + "/" + senha);

    return logado[0]["usuario"] == "True";
}