// Inicializa ao carregar a pagina
$(document).ready(function() {
    var idRegiaoAtual;
    inicializaDropdownProdutividade();
    
    // listener dropdown região
    $("#dropdown_regiao_produtividade").on("select2-selecting", function(idRegiao) { 
        idRegiaoAtual = idRegiao.val;
        onRegiaoChangeProdutividade(idRegiao.val);             
    });
    
    // listener dropdown agricultor
    $("#dropdown_agricultor_produtividade").on("select2-selecting", function(idAgricultor){
        onAgricultorChangeProdutividade(idAgricultor.object.nome_agricultor, idAgricultor.val, idRegiaoAtual);
    });
    
});

function inicializaDropdownProdutividade(){
    // Inicializa dropdowns
    dropdownRegiaoProdutividade();
    dropdownAgricultorProdutividade(1); // Inicializa dropdown com agricultores da região 1
    
    // lock dropdown agricultor
    $("#dropdown_agricultor_produtividade").select2("enable", false);

    // hide info agricultor
    $("#info_agricultor_produtividade").addClass("hidden");
}

function onRegiaoChangeProdutividade(idRegiao) {
    var agricultoresDaRegiao = getAgricultoresComProducaoNaRegiaoProdutividade(idRegiao);
    // populate nomeAgricultor dropdown
    dropdownAgricultorProdutividade(agricultoresDaRegiao);  // VIEW
    
    // clear data
    clearDropdownProdutividade();
    
    // unlock agricultor dropdown
    $("#dropdown_agricultor_produtividade").select2("enable", true);
}

function clearDropdownProdutividade() {
    // clear data dropdown agricultor
    $("#dropdown_agricultor_produtividade").select2("data", null);
    hideAgricultorInfoProdutividade();
}

function onAgricultorChangeProdutividade(nomeAgricultor, idAgricultor, idRegiao) {
    graph4(nomeAgricultor, idAgricultor, idRegiao); // VIEW
    showAgricultorInfoProdutividade();
}

function showAgricultorInfoProdutividade() {
    $("#info_agricultor_produtividade").removeClass("hidden");
    $("#info_agricultor_produtividade").addClass("visible");
}

function hideAgricultorInfoProdutividade() {
    $("#info_agricultor_produtividade").removeClass("visible");
    $("#info_agricultor_produtividade").addClass("hidden");
}

function getAgricultoresComProducaoNaRegiaoProdutividade(idRegiao) {
    var agricultores = getAgricultores();    
    
    var agricultoresDaRegiao = _.filter(agricultores, function(agricultor) {
        return idRegiao == agricultor.id_regiao;
    });
    
    // Seria legal se o JSON retornar-se os agricultores COM produção...
    var produ_agricultores = getProduAgricultores();
    
    // remove agricultores com producao < 0
    function removeProduMenorQueZero() {
        produ_agricultores = _.filter(produ_agricultores, function(produ) {
            return produ.producao > 0;
        });

        agricultoresDaRegiao = _.filter(agricultoresDaRegiao, function(agricultor) {
            return _.contains(_.pluck(produ_agricultores, 'id_agricultor'), agricultor.id);
        });
    }
    
    removeProduMenorQueZero();
    
    return agricultoresDaRegiao;
}