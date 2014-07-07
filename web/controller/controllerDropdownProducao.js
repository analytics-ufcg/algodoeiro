// Inicializa ao carregar a pagina
$(document).ready(function() {
    inicializaDropdown();
    
    // listener dropdown região
    $("#dropdown_regiao").on("select2-selecting", function(idRegiao) { 
        onRegiaoChange(idRegiao.val);             
    });
    
    // listener dropdown agricultor
    $("#dropdown_agricultor").on("select2-selecting", function(idAgricultor){
        onAgricultorChange(idAgricultor.val, idRegiao);
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
    // populate nomeAgricultor dropdown
    dropdownAgricultor(idRegiao);  // VIEW
    
    // unlock agricultor dropdown
    $("#dropdown_agricultor").select2("enable", true);
}

function onAgricultorChange(idAgricultor, idRegiao) {
    plotaGraficoProducaoAgricultor(idAgricultor, idRegiao); // VIEW
    // Show agricultor info
    $("#info_agricultor").removeClass("hidden");
    $("#info_agricultor").addClass("visible");
}