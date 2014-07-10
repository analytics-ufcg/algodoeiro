// Inicializa ao carregar a pagina
$(document).ready(function() {
    var idRegiaoAtual, idAgricultorAtual;
    inicializaDropdown();
    
    // listener dropdown região
    $("#dropdown_regiao").on("select2-selecting", function(idRegiao) { 
        idRegiaoAtual = idRegiao.val;
        onRegiaoChange(idRegiao.val);             
    });
    
    // listener dropdown agricultor
    $("#dropdown_agricultor").on("select2-selecting", function(idAgricultor){
        idAgricultorAtual = idAgricultor.val;
        idRegiaoAtual = $("#dropdown_regiao").select2("val");
        onAgricultorChange(idAgricultor.val, idRegiaoAtual);
    });

    // listener dropdown agricultor
    $("#dropdown_ano").on("select2-selecting", function(idAno){
        idRegiaoAtual = $("#dropdown_regiao").select2("val");
        idAgricultorAtual = $("#dropdown_agricultor").select2("val");

        onAnoChange(idRegiaoAtual, idAgricultorAtual, idAno.val);
    })

});

function inicializaDropdown(){
    // Inicializa dropdowns
    dropdownRegiao();
    onRegiaoChange(1);
    //dropdownAgricultor(1); // Inicializa dropdown com agricultores da região 1
    //dropdownAno(1);  // inicializa dropdown com id_agricultor = 1

    
    // lock dropdown agricultor
    //$("#dropdown_agricultor").select2("enable", false);

    // hide info agricultor
    //$("#info_agricultor").addClass("hidden");
}

function onRegiaoChange(idRegiao) {
    var agricultoresDaRegiao = getProdutores(idRegiao);
    
    // clear data nomeAgricultor dropdown
    clearDropdown();
    // populate nomeAgricultor dropdown
    dropdownAgricultor(agricultoresDaRegiao);  // VIEW
    onAgricultorChange(agricultoresDaRegiao[0].id,idRegiao);
    // // unlock agricultor dropdown
    // $("#dropdown_agricultor").select2("enable", true);
}

function onAgricultorChange(idAgricultor, idRegiao) {
    //plotaGraficoProducaoAgricultor(idAgricultor, idRegiao, ano); // VIEW
    var anos = getAnosProduzidos(idAgricultor);

    $("#dropdown_ano").select2("data", null); // clear dropdown ano

    dropdownAno(anos);
    onAnoChange(idRegiao, idAgricultor, anos[0].id);

}

function onAnoChange(idRegiaoAtual, idAgricultorAtual, idAno) {

    plotaGraficoProducaoAgricultor(idAgricultorAtual, idRegiaoAtual, idAno); // VIEW
    showAgricultorInfo();

}

function clearDropdown() {
    // clear data dropdown agricultor
    $("#dropdown_agricultor").select2("data", null);
    hideAgricultorInfo();
}

function showAgricultorInfo() {
    $("#info_agricultor").removeClass("hidden");
    $("#info_agricultor").addClass("blick");
}

function hideAgricultorInfo() {
    $("#info_agricultor").removeClass("visible");
    $("#info_agricultor").addClass("hidden");
}