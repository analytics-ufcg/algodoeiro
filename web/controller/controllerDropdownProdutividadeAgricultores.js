// Inicializa ao carregar a pagina
/*$(document).ready(function() {
    var idRegiaoAtual, idAgricultorAtual;
    inicializaDropdownProdutividade();

    
    // listener dropdown região
    $("#dropdown_regiao_produtividade").on("select2-selecting", function(idRegiao) {
        idRegiaoAtual = idRegiao.val;
        onRegiaoChangeProdutividade(idRegiao.val);
    });

    // listener dropdown agricultor
    $("#dropdown_agricultor_produtividade").on("select2-selecting", function(idAgricultor) {
        idAgricultorAtual = idAgricultor.val;
        idRegiaoAtual = $("#dropdown_regiao").select2("val");
        onAgricultorChangeProdutividade(idAgricultor.val, idRegiaoAtual);
    });

    // listener dropdown agricultor
    $("#dropdown_ano_produtividade").on("select2-selecting", function(idAno) {
        idRegiaoAtual = $("#dropdown_regiao_produtividade").select2("val");
        idAgricultorAtual = $("#dropdown_agricultor_produtividade").select2("val");

        onAnoChangeProdutividade(idRegiaoAtual, idAgricultorAtual, idAno.val);
    });
    
    function inicializaDropdownProdutividade() {
        var selectorRegiao = $("#dropdown_regiao_produtividade"); // jquery selector para div dropdown regiao
        // Inicializa dropdowns
        dropdownRegiao(selectorRegiao);
        onRegiaoChangeProdutividade(1);
    }
});*/
/*
function loadDropDownProdutividadeAgricultores(){
    var idRegiaoAtual, idAgricultorAtual;
    inicializaDropdownProdutividade();

    
    // listener dropdown região
    $("#dropdown_regiao_produtividade").on("select2-selecting", function(idRegiao) {
        idRegiaoAtual = idRegiao.val;
        onRegiaoChangeProdutividade(idRegiao.val);
    });

    // listener dropdown agricultor
    $("#dropdown_agricultor_produtividade").on("select2-selecting", function(idAgricultor) {
        idAgricultorAtual = idAgricultor.val;
        idRegiaoAtual = $("#dropdown_regiao").select2("val");
        onAgricultorChangeProdutividade(idAgricultor.val, idRegiaoAtual);
    });

    // listener dropdown agricultor
    $("#dropdown_ano_produtividade").on("select2-selecting", function(idAno) {
        idRegiaoAtual = $("#dropdown_regiao_produtividade").select2("val");
        idAgricultorAtual = $("#dropdown_agricultor_produtividade").select2("val");

        onAnoChangeProdutividade(idRegiaoAtual, idAgricultorAtual, idAno.val);
    });
    
    function inicializaDropdownProdutividade() {
        var selectorRegiao = $("#dropdown_regiao_produtividade"); // jquery selector para div dropdown regiao
        // Inicializa dropdowns
        dropdownRegiao(selectorRegiao);
        onRegiaoChangeProdutividade(1);
    }
}

function onRegiaoChangeProdutividade(idRegiao) {
    var selectorAgricultor = $("#dropdown_agricultor_produtividade") // jquery selector para div dropdown agricultor
    var agricultoresDaRegiao = getProdutoresAlgodao(idRegiao);

    // clear data dropdown agricultor
    selectorAgricultor.select2("data", null);

    // populate nomeAgricultor dropdown
    dropdownAgricultor(agricultoresDaRegiao, selectorAgricultor);
    // VIEW
    //var idAgricultor = selectorAgricultor.select2("val");

    onAgricultorChangeProdutividade(agricultoresDaRegiao[0].id, idRegiao);
}

function onAgricultorChangeProdutividade(idAgricultor, idRegiao) {
    var selectorAno = $("#dropdown_ano_produtividade"); // jquery selector para div dropdown ano
    var anos = getAnosProduzidos(idAgricultor);

    // clear dropdown ano
    selectorAno.select2("data", null);
    
    dropdownAno(anos, selectorAno);

    var idAnoAtual = selectorAno.select2("val");
    onAnoChangeProdutividade(idRegiao, idAgricultor, idAnoAtual);
}

function onAnoChangeProdutividade(idRegiaoAtual, idAgricultorAtual, idAno) {
    plotGraficoProdutividadeRegiao(idAgricultorAtual, idRegiaoAtual, idAno); // VIEW
}
*/





function loadDropDownProdutividadeAgricultores(){
    var idAgricultorAtual, idAnoAtual;
    inicializaDropdownProdutividade();

    // listener dropdown agricultor
    $("#dropdown_agricultor_produtividade").on("select2-selecting", function(idAgricultor) {
        idAgricultorAtual = idAgricultor.val;
        onAgricultorChangeProdutividade(idAgricultorAtual);
    });

    // listener dropdown agricultor
    $("#dropdown_ano_produtividade").on("select2-selecting", function(idAno) {
        idAgricultorAtual = $("#dropdown_agricultor_produtividade").select2("val");

        onAnoChangeProdutividade(idAgricultorAtual, idAno.val);
    });
    
}

function inicializaDropdownProdutividade() {
    var selectorAgricultor = $("#dropdown_agricultor_produtividade") // jquery selector para div dropdown agricultor
    var agricultores = getProdutorAlgodao();

    // clear data dropdown agricultor
    selectorAgricultor.select2("data", null);

    // populate nomeAgricultor dropdown
    dropdownAgricultor(agricultores, selectorAgricultor);
    // VIEW
    //var idAgricultor = selectorAgricultor.select2("val");

    onAgricultorChangeProdutividade(agricultores[0].id);
}

function onAgricultorChangeProdutividade(idAgricultor) {
    var selectorAno = $("#dropdown_ano_produtividade"); // jquery selector para div dropdown ano
    var anos = getAnosProduzidos(idAgricultor);

    // clear dropdown ano
    selectorAno.select2("data", null);
    
    dropdownAno(anos, selectorAno);

    var idAnoAtual = selectorAno.select2("val");
    onAnoChangeProdutividade(idAgricultor, idAnoAtual);
}

function onAnoChangeProdutividade(idAgricultorAtual, idAno) {
    plotGraficoProdutividadeRegiao(idAgricultorAtual, idAno); // VIEW
}