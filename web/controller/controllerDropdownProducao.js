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
    });

});

function inicializaDropdown(){
    var selectorRegiao = $("#dropdown_regiao"); // jquery selector para div dropdown regiao
    dropdownRegiao(selectorRegiao); // Metodo de dropdown.js
    onRegiaoChange(1); // inicializa dropdown regiao, com primeira regiao
}

function onRegiaoChange(idRegiao) {
    var selectorAgricultor = $("#dropdown_agricultor");
    var agricultoresDaRegiao = getProdutores(idRegiao);
    
    // clear dropdown nomeAgricultor dropdown
    selectorAgricultor.select2("data", null);

    // populate nomeAgricultor dropdown
    dropdownAgricultor(agricultoresDaRegiao, selectorAgricultor);  // Metodo de dropdown.js
    // inicializa dropdown agricultor, com primeiro agricultor da regiao
    onAgricultorChange(agricultoresDaRegiao[0].id,idRegiao);
}

function onAgricultorChange(idAgricultor, idRegiao) {
    var selectorAno = $("#dropdown_ano");
    //plotaGraficoProducaoAgricultor(idAgricultor, idRegiao, ano); // VIEW
    var anos = getAnosProduzidos(idAgricultor);

    selectorAno.select2("data", null); // clear dropdown ano

    dropdownAno(anos, selectorAno); // Metodo de dropdown.js

    var idAnoAtual = selectorAno.select2("val");

    onAnoChange(idRegiao, idAgricultor, idAnoAtual);

}

function onAnoChange(idRegiaoAtual, idAgricultorAtual, idAno) {
    plotaGraficoProducaoAgricultor(idAgricultorAtual, idRegiaoAtual, idAno); // VIEW/mainView
}