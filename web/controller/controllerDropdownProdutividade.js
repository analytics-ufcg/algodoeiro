// Inicializa ao carregar a pagina
$(document).ready(function() {
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
    

});

function inicializaDropdownProdutividade() {
    // Inicializa dropdowns
    dropdownRegiaoProdutividade();
    onRegiaoChangeProdutividade(1);
    // Inicializa dropdown com agricultores da região 1

    // lock dropdown agricultor
    //$("#dropdown_agricultor_produtividade").select2("enable", false);

    // hide info agricultor
    //$("#info_agricultor_produtividade").addClass("hidden");
}

function onRegiaoChangeProdutividade(idRegiao) {
    var agricultoresDaRegiao = getProdutores(idRegiao);

    // clear data
    clearDropdownProdutividade();

    // populate nomeAgricultor dropdown
    dropdownAgricultorProdutividade(agricultoresDaRegiao);
    // VIEW
    onAgricultorChangeProdutividade(agricultoresDaRegiao[0].id, idRegiao);

    // unlock agricultor dropdown
    //$("#dropdown_agricultor_produtividade").select2("enable", true);
}

function onAgricultorChangeProdutividade(idAgricultor, idRegiao) {
    var anos = getAnosProduzidos(idAgricultor);

    $("#dropdown_ano_produtividade").select2("data", null);
    // clear dropdown ano

    dropdownAnoProdutividade(anos);
    onAnoChangeProdutividade(idRegiao, idAgricultor, anos[0].id);

}

function onAnoChangeProdutividade(idRegiaoAtual, idAgricultorAtual, idAno) {

    graph4(idAgricultorAtual, idRegiaoAtual, idAno);
    // VIEW
    showAgricultorInfoProdutividade();

}

function clearDropdownProdutividade() {
    // clear data dropdown agricultor
    $("#dropdown_agricultor_produtividade").select2("data", null);
    hideAgricultorInfoProdutividade();
}

function showAgricultorInfoProdutividade() {
    $("#info_agricultor_produtividade").removeClass("hidden");
    $("#info_agricultor_produtividade").addClass("visible");
}

function hideAgricultorInfoProdutividade() {
    $("#info_agricultor_produtividade").removeClass("visible");
    $("#info_agricultor_produtividade").addClass("hidden");
}