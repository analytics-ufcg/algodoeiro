// var ddwSelector = $("#dropdown_tecnicas_produtividade_tecnicas");

$(document).ready(function() {
    // seletores das Divs
    var selectorRegiaoTecnica = $("#dropdown_regiao_produtividade_tecnicas");
    var selectorAgricultorTecnica = $("#dropdown_agricultor_produtividade_tecnicas");
    var selectorAnoTecnica = $("#dropdown_ano_produtividade_tecnicas");


    var idRegiaoAtual, idAgricultorAtual;
    inicializaDropdown();
    
    // listener dropdown região
    selectorRegiaoTecnica.on("select2-selecting", function(idRegiao) { 
        idRegiaoAtual = idRegiao.val;
        onRegiaoChangeTecnica(idRegiao.val);             
    });
    
    // listener dropdown agricultor
    selectorAgricultorTecnica.on("select2-selecting", function(idAgricultor){
        idAgricultorAtual = idAgricultor.val;
        idRegiaoAtual = selectorRegiaoTecnica.select2("val");
        onAgricultorChangeTecnica(idAgricultor.val, idRegiaoAtual);
    });

    // listener dropdown ano
    selectorAnoTecnica.on("select2-selecting", function(idAno){
        idRegiaoAtual = selectorRegiaoTecnica.select2("val");
        idAgricultorAtual = selectorAgricultorTecnica.select2("val");

        onAnoChangeTecnica(idRegiaoAtual, idAgricultorAtual, idAno.val);
    });

    // listener dropdown tecnicas
    selectorAnoTecnica.on("select2-selecting", function(idAno){
        idRegiaoAtual = selectorRegiaoTecnica.select2("val");
        idAgricultorAtual = selectorAgricultorTecnica.select2("val");

        onTecnicaChange(idRegiaoAtual, idAgricultorAtual, idAno.val, tecnicas);
    });

    function inicializaDropdown() {
        //  var tecnicas = getTecnicas()
        var regiao = getRegioes();
        dropdownRegiao(selectorRegiaoTecnica); // inicializa dropdowns (metodos de dropdown.js)
        onRegiaoChangeTecnica(1); // Inicializa cadeia de mudanças (Regiao -> Agricultor -> Ano)
    }


    // teste getTecnicas()
    getTecnicas(1, 2011);
});

function onRegiaoChangeTecnica(idRegiao) {
    var selectorAgricultorTecnica = $("#dropdown_agricultor_produtividade_tecnicas");
    var agricultoresDaRegiao = getProdutores(idRegiao);
    
    // clear dropdown nomeAgricultor dropdown
    selectorAgricultorTecnica.select2("data", null);

    // populate nomeAgricultor dropdown
    dropdownAgricultor(agricultoresDaRegiao, selectorAgricultorTecnica);  // Metodo de dropdown.js
    
    // inicializa dropdown agricultor, com primeiro agricultor da regiao
    onAgricultorChangeTecnica(agricultoresDaRegiao[0].id,idRegiao);
}

function onAgricultorChangeTecnica(idAgricultor, idRegiao) {
    var selectorAnoTecnica = $("#dropdown_ano_produtividade_tecnicas");
    var anos = getAnosProduzidos(idAgricultor);

    selectorAnoTecnica.select2("data", null); // clear dropdown ano

    // populate dropdown Anos
    dropdownAno(anos, selectorAnoTecnica); // Metodo de dropdown.js
    
    var idAnoAtual = selectorAnoTecnica.select2("val");

    onAnoChangeTecnica(idRegiao, idAgricultor, idAnoAtual);
}

function onAnoChangeTecnica(idRegiaoAtual, idAgricultorAtual, idAno) {
    // popula dropdown tecnicas
    var selectorTecnicas = $("#dropdown_tecnicas_produtividade_tecnicas");
    var tecnicas = getTecnicas(idAgricultorAtual, idAno);
    dropdownTecnicas(tecnicas, selectorTecnicas);

    onTecnicaChange(idRegiaoAtual, idAgricultorAtual, idAno);
}

function onTecnicaChange(idRegiaoAtual, idAgricultorAtual, idAno, tecnicas) {
    


    function filtraAgricultores(tecnicas) {

    }
}
