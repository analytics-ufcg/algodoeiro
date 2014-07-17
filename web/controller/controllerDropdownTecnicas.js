// var ddwSelector = $("#dropdown_tecnicas_produtividade_tecnicas");

$(document).ready(function() {
    // seletores das Divs
    var selectorAgricultorTecnica = $("#dropdown_agricultor_produtividade_tecnicas");
    var selectorAnoTecnica = $("#dropdown_ano_produtividade_tecnicas");


    var idAgricultorAtual;
    inicializaDropdown();
    
    // listener dropdown agricultor
    selectorAgricultorTecnica.on("select2-selecting", function(idAgricultor){
        idAgricultorAtual = idAgricultor.val;
        onAgricultorChangeTecnica(idAgricultor.val);
    });

    // listener dropdown ano
    selectorAnoTecnica.on("select2-selecting", function(idAno){
        idAgricultorAtual = selectorAgricultorTecnica.select2("val");

        onAnoChangeTecnica(idAgricultorAtual, idAno.val);
    });

    // listener dropdown tecnicas
    selectorAnoTecnica.on("select2-selecting", function(idAno){
        idAgricultorAtual = selectorAgricultorTecnica.select2("val");

        onTecnicaChange(idAgricultorAtual, idAno.val, tecnicas);
    });

    function inicializaDropdown() {
        var agricultores = getAllProdutores();
        dropdownAgricultor(agricultores, selectorAgricultorTecnica); // inicializa dropdown agricultor (metodos de dropdown.js)
        onAgricultorChangeTecnica(1); // Inicializa cadeia de mudanças (Regiao -> Agricultor -> Ano)
    }
});

function onAgricultorChangeTecnica(idAgricultor) {
    var selectorAnoTecnica = $("#dropdown_ano_produtividade_tecnicas");
    var anos = getAnosProduzidos(idAgricultor);

    selectorAnoTecnica.select2("data", null); // clear dropdown ano
    cleanTecnicas(); // limpa dropdown de tecnicas

    // populate dropdown Anos
    dropdownAno(anos, selectorAnoTecnica); // Metodo de dropdown.js
    
    var idAnoAtual = selectorAnoTecnica.select2("val");

    onAnoChangeTecnica(idAgricultor, idAnoAtual);
}

function onAnoChangeTecnica(idAgricultorAtual, idAno) {
    // popula dropdown tecnicas
    var selectorTecnicas = $("#dropdown_tecnicas_produtividade_tecnicas");
    var tecnicas = getTecnicasAgricultor(idAgricultorAtual, idAno).tecnicas; // so a lista com as tecnicas
    dropdownTecnicas(tecnicas, selectorTecnicas);

    cleanTecnicas(); // limpa dropdown de tecnicas
    onTecnicaChange(idAgricultorAtual, idAno);
}

function onTecnicaChange(idAgricultorAtual, idAno, tecnicas) {
    


    function filtraAgricultores(tecnicas) {

    }
}

function cleanTecnicas() {
    var selectorTecnicas = $("#dropdown_tecnicas_produtividade_tecnicas");
    selectorTecnicas.select2("data", null);
}