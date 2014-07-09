// Inicializa ao carregar a pagina
$(document).ready(function() {
    var idRegiaoAtual;
    inicializaDropdown();
    
    // listener dropdown região
    $("#dropdown_regiao").on("select2-selecting", function(idRegiao) { 
        idRegiaoAtual = idRegiao.val;
        onRegiaoChange(idRegiao.val);             
    });
    
    // listener dropdown agricultor
    $("#dropdown_agricultor").on("select2-selecting", function(idAgricultor){
        onAgricultorChange(idAgricultor.val, idRegiaoAtual);
    });
    
});

function inicializaDropdown(){
    // Inicializa dropdowns
    dropdownRegiao();
    dropdownAgricultor(1); // Inicializa dropdown com agricultores da região 1
    
    // lock dropdown agricultor
    $("#dropdown_agricultor").select2("enable", false);

    // hide info agricultor
    $("#info_agricultor").addClass("hidden");
}

function onRegiaoChange(idRegiao) {
    var agricultoresDaRegiao = getAgricultoresComProducaoNaRegiao(idRegiao);
    // populate nomeAgricultor dropdown
    dropdownAgricultor(agricultoresDaRegiao);  // VIEW
    
    // clear data
    clearDropdown();
    
    // unlock agricultor dropdown
    $("#dropdown_agricultor").select2("enable", true);
}

function clearDropdown() {
    // clear data dropdown agricultor
    $("#dropdown_agricultor").select2("data", null);
    hideAgricultorInfo();
}

function onAgricultorChange(idAgricultor, idRegiao) {
    plotaGraficoProducaoAgricultor(idAgricultor, idRegiao); // VIEW
    showAgricultorInfo();
}

function showAgricultorInfo() {
    $("#info_agricultor").removeClass("hidden");
    $("#info_agricultor").addClass("visible");
}

function hideAgricultorInfo() {
    $("#info_agricultor").removeClass("visible");
    $("#info_agricultor").addClass("hidden");
}

function getAgricultoresComProducaoNaRegiao(idRegiao) {
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