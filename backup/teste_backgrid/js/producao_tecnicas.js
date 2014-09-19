var grid;

var REST_SERVER = 'http://localhost:5001';

function readJSON(url){
	var dataframe;

	$.ajax({
        url : url,
        type : 'GET',
        async: false,
        dataType : 'json',
        success: function(data) { 
        	console.log("success ajax!");
        	dataframe = data;
         },                                                                                                                                                                                       
       error: function(xhr, status, error) {
          var err = eval("(" + xhr.responseText + ")");
          console.log(err.Message);
        }
    });

	return dataframe;
}

$(document).ready(function() {
	$('#btnAdicionarAno').confirmModal({
		    		confirmTitle : 'Confirmação',
		    		confirmMessage : 'Você deseja adicionar um novo ano?',
		    		confirmOk : 'Confirma',
		    		confirmCancel : 'Cancela',
		    		confirmDirection : 'rtl',
		    		confirmStyle : 'primary',
					confirmCallback : function () {
						$.ajax({
							url: REST_SERVER + "/adicionarAno",
							}).done(function(data) {
								atualizarDropdownAno();
							});
					}
    			});

	function getRegiaoSelecionada() {
		return $("#dropdownRegiao option:selected").val();
	}

	function getAnoSelecionado() {
		return $("#dropdownAno option:selected").val();
	}

	var regiao = readJSON(REST_SERVER + "/regioes");
	$.each(regiao, function(index, value) {
	     $('#dropdownRegiao').append($('<option>').text(value.regiao).attr('value', value.id));
	});

	var ano;
	function atualizarDropdownAno() {
		ano = readJSON(REST_SERVER + "/lista_ano_e");
		$('#dropdownAno').empty();
		$.each(ano.ano, function(index, value) {
		     $('#dropdownAno').append($('<option>').text(value[0]).attr('value', value[1]));
		});
	}

	atualizarDropdownAno();

	var regiao_selecionada = getRegiaoSelecionada();
	var ano_selecionado = getAnoSelecionado();

	$('#dropdownRegiao').change(function(data) {
		regiao_selecionada = getRegiaoSelecionada();
		atualizar_grid(regiao_selecionada, ano_selecionado);
	});

	$('#dropdownAno').change(function(data) {
		ano_selecionado = getAnoSelecionado();
		atualizar_grid(regiao_selecionada, ano_selecionado);
	});

	var ProducaoTecnicas = Backbone.Model.extend({});

	atualizar_grid(regiao_selecionada, ano_selecionado);

	function atualizar_grid(regiao_selecionada, ano_selecionado) {
		var ProducoesTecnicas = Backbone.Collection.extend({
			model : ProducaoTecnicas,
			//url : "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor_e"
			url : REST_SERVER + "/producao_tecnica_agricultor/" + regiao_selecionada + "/" + ano_selecionado
		});

		var producoesTecnicas = new ProducoesTecnicas();
		
		producoesTecnicas.fetch({
			reset : true
		});

		var comunidade = readJSON(REST_SERVER + "/comunidades_e/" + regiao_selecionada);
		
		var columns = [
		{
			name : "id", 
			label : "Id", 
			editable : false, 
			cell : Backgrid.IntegerCell.extend({
				orderSeparator : ''
			}),
			renderable: false
		}, {
			name : "nome",
			label : "Nome",
			cell : "string",
			editable : false
		},  {
			name : "teve_tecnicas",
			label : "Técnicas",
			cell : "boolean",
			editable : false
		}, {
			name : "teve_producao",
			label : "Produção",
			cell : "boolean",
			editable : false
		}];

		grid = new Backgrid.Grid({
			columns : columns,
			collection : producoesTecnicas
		});

		grid.render().sort("nome", "ascending");

		$("#tabela_producoes_tecnicas").empty();
		$("#tabela_producoes_tecnicas").append(grid.el);

	}
});