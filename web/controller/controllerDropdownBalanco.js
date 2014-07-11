// Inicializa ao carregar a pagina
$(document).ready(function() {
    contDdpBalanco_inicializaDropdown();
    
    $("#dropdown_balanco").on("select2-selecting", function(idBalanco){
        contDdpBalanco_onTipoBalancoChange(idBalanco.val);
    });

    // listener dropdown ano
    $("#dropdown_ano_balanco").on("select2-selecting", function(idAno){
        var tipoBalanco = $("#dropdown_balanco").select2("val");

        contDdpBalanco_onAnoChange(idAno.val,tipoBalanco);
    });

});



function contDdpBalanco_inicializaDropdown(){
    // Inicializa dropdowns
    //DEIXAR AUTOMATICO



    var opcoesBalanco = [{id:"receita",tipo:"receita"},{id:"lucro",tipo:"lucro"}];
    ddwBalanco_tiposBalanco(opcoesBalanco);
    
    //Remove qualquer gráfico que já exista na seção
    d3.select("#custo_regiao").selectAll("svg").remove();


    var anos = [{id:2010,ano:"2010"},{id:2011,ano:"2011"}];
    ddwBalanco_anos(anos);
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
    var receita = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/receita/" + idAno);
    var lucro = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/lucro/" + idAno);
    var custos = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regiao/custo/total");
    var regioes = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regioes");

     if (tipoBalanco == "receita") {
         d3.select("#custo_regiao").selectAll("svg").remove();

         graficoBalanco("#custo_regiao", custos, receita, regioes);
     } else {
         d3.select("#custo_regiao").selectAll("svg").remove();

         graficoLucro("#custo_regiao", lucro, regioes);

     }
    //graph2(idAno); // VIEW/mainView
}
