// Inicializa ao carregar a pagina
/*$(document).ready(function() {
    contDdpBalanco_inicializaDropdown();
    
    $("#dropdown_balanco").on("select2-selecting", function(idBalanco){
        contDdpBalanco_onTipoBalancoChange(idBalanco.val);
    });

    // listener dropdown ano
    $("#dropdown_ano_balanco").on("select2-selecting", function(idAno){
        var tipoBalanco = $("#dropdown_balanco").select2("val");

        contDdpBalanco_onAnoChange(idAno.val,tipoBalanco);
    });

});*/

function loadDropDownBalanco(){
    contDdpBalanco_inicializaDropdown();
    
    $("#dropdown_balanco").on("select2-selecting", function(idBalanco){
        contDdpBalanco_onTipoBalancoChange(idBalanco.val);
    });

    // listener dropdown ano
    $("#dropdown_ano_balanco").on("select2-selecting", function(idAno){
        var tipoBalanco = $("#dropdown_balanco").select2("val");

        contDdpBalanco_onAnoChange(idAno.val,tipoBalanco);
    });
}

function contDdpBalanco_inicializaDropdown(){
    // Inicializa dropdowns
    //DEIXAR AUTOMATICO



    var opcoesBalanco = [{id:"receita",tipo:"receita"},{id:"lucro",tipo:"lucro"}];
    ddwBalanco_tiposBalanco(opcoesBalanco);
    
    //Remove qualquer gráfico que já exista na seção
    d3.select("#custo_regiao").selectAll("svg").remove();


    var anos = getAnos();
    var selectorAno = $("#dropdown_ano_balanco");
    dropdownAno(anos, selectorAno);
    var idAnoAtual = $("#dropdown_ano_balanco").select2("val");
    var tipoBalanco = $("#dropdown_balanco").select2("val");

    contDdpBalanco_onAnoChange(idAnoAtual,tipoBalanco);
}


function contDdpBalanco_onTipoBalancoChange(idBalanco) {
    var idAnoAtual = $("#dropdown_ano_balanco").select2("val");
    contDdpBalanco_onAnoChange(idAnoAtual,idBalanco);
}


function contDdpBalanco_onAnoChange(idAno,tipoBalanco) {

    //var tipoBalanco = $("#dropdown_balanco").select2("val");

   // var tipoBalanco = $("#dropdown_balanco option:selected").val();
    var receita = getReceita(idAno);
    var lucro = getLucro(idAno);
    var custos = getCustos(idAno);
    var regioes = getRegioes();

    if (_.size(receita)>0) { // Testa se existe receita no dado ano passado
        $("#custo_regiao").html("");

        if (tipoBalanco == "receita") {
            d3.select("#custo_regiao").selectAll("svg").remove();

            graficoReceita("#custo_regiao", custos, receita, regioes);
        } else {
            d3.select("#custo_regiao").selectAll("svg").remove();

            graficoLucro("#custo_regiao", lucro, regioes);

        }
    }else{
        $("#custo_regiao").html("Ano sem receita. Ou não existe produção ou não existem valores de venda das culturas.");

    };
    
    //graficoProducaoRegiaoAbsoluto(idAno); // VIEW/mainView
}
