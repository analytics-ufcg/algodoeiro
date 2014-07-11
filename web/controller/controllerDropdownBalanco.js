// Inicializa ao carregar a pagina
$(document).ready(function() {
    contDdpBalanco_inicializaDropdown();
    
    // listener dropdown ano
    $("#dropdown_ano_balanco").on("select2-selecting", function(idAno){
        contDdpBalanco_onAnoChange(idAno.val);
    });

});



function contDdpBalanco_inicializaDropdown(){
    // Inicializa dropdowns
    //DEIXAR AUTOMATICO



    var opcoesBalanco = ["receita", "lucro"];
    // Popula DropDown
    var selectRegioes = d3.select("#droplist_tipo_balanco").append("select").attr("id", "select_tipo_balanco")
    .on("change", function() {
     var valorAtual = this.options[this.selectedIndex].value;
        var idAnoAtual = $("#dropdown_ano_balanco").select2("val");
        contDdpBalanco_onAnoChange(idAnoAtual);

     })
    .selectAll("option").data(opcoesBalanco).enter().append("option").attr("value", function(d) {
        return d;
    }).text(function(d) {
        return d;
    });

    //Remove qualquer gráfico que já exista na seção
    d3.select("#custo_regiao").selectAll("svg").remove();
    //graficoBalanco("#custo_regiao", custos, receita, regioes);


    var anos = [{id:2010,ano:"2010"},{id:2011,ano:"2011"}];
    ddwBalanco(anos);
    var idAnoAtual = $("#dropdown_ano_balanco").select2("val");
    contDdpBalanco_onAnoChange(idAnoAtual);
}


function contDdpBalanco_onAnoChange(idAno) {
    var tipoBalanco = $("#droplist_tipo_balanco option:selected").val();
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
