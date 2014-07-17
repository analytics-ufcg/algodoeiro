// Inicializa ao carregar a pagina
$(document).ready(function() {
    var idRegiaoAtual, idAgricultorAtual;
    inicializaDropdown();
    
    // listener dropdown região
    $("#dropdown_regiao").on("select2-selecting", function(idRegiao) { 
        idRegiaoAtual = idRegiao.val;
        onRegiaoChangeProducao(idRegiao.val);             
    });
    
    // listener dropdown agricultor
    $("#dropdown_agricultor").on("select2-selecting", function(idAgricultor){
        idAgricultorAtual = idAgricultor.val;
        idRegiaoAtual = $("#dropdown_regiao").select2("val");
        onAgricultorChangeProducao(idAgricultor.val, idRegiaoAtual);
    });

    // listener dropdown agricultor
    $("#dropdown_ano").on("select2-selecting", function(idAno){
        idRegiaoAtual = $("#dropdown_regiao").select2("val");
        idAgricultorAtual = $("#dropdown_agricultor").select2("val");

        onAnoChangeProducao(idRegiaoAtual, idAgricultorAtual, idAno.val);
    });

    function inicializaDropdown(){
        var selectorRegiao = $("#dropdown_regiao"); // jquery selector para div dropdown regiao
        dropdownRegiao(selectorRegiao); // Metodo de dropdown.js
        onRegiaoChangeProducao(1);
    }
});

function onRegiaoChangeProducao(idRegiao) {
    var selectorAgricultor = $("#dropdown_agricultor");
    var agricultoresDaRegiao = getProdutores(idRegiao);
    
    // clear dropdown nomeAgricultor dropdown
    selectorAgricultor.select2("data", null);

    // populate nomeAgricultor dropdown
    dropdownAgricultor(agricultoresDaRegiao, selectorAgricultor);  // Metodo de dropdown.js
    
    // inicializa dropdown agricultor, com primeiro agricultor da regiao
    onAgricultorChangeProducao(agricultoresDaRegiao[0].id,idRegiao);
}

function onAgricultorChangeProducao(idAgricultor, idRegiao) {
    var selectorAno = $("#dropdown_ano");
    //plotaGraficoProducaoAgricultor(idAgricultor, idRegiao, ano); // VIEW
    var anos = getAnosProduzidos(idAgricultor);

    selectorAno.select2("data", null); // clear dropdown ano

    dropdownAno(anos, selectorAno); // Metodo de dropdown.js

    var idAnoAtual = selectorAno.select2("val");

    onAnoChangeProducao(idRegiao, idAgricultor, idAnoAtual);

}

function onAnoChangeProducao(idRegiaoAtual, idAgricultorAtual, idAno) {
    plotaGraficoProducaoAgricultor(idAgricultorAtual, idRegiaoAtual, idAno); // VIEW/mainView
}