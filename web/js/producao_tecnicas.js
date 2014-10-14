var grid;

var REST_SERVER = 'http://analytics.lsd.ufcg.edu.br/algodoeiro_rest';
var EDIT_CELL = 'editProdTec.html';

$(document).ready(function() {
	var EditCell = Backgrid.Cell.extend({
	    template: _.template("<a href=\"#\"><span class=\"glyphicon glyphicon-pencil\"></span></a>"),
	    events: {
	      "click": "editButton"
	    },
	    editButton: function (e) {
	      	e.preventDefault();
	      	var id = this.model.id;
	      	var nome = this.model.get("nome");
	      	var ano = getAnoSelecionado();
	      	
	      	window.location.href= EDIT_CELL + '?id=' + id + '&ano=' + ano + '&nome=' + nome;
	    },
	    render: function () {
	      this.$el.html(this.template());
	      this.delegateEvents();
	      return this;
	    }
	});

	var TemDadosCell = Backgrid.BooleanCell.extend({
	  render: function () {
	    this.$el.empty();
	    var model = this.model, column = this.column;
	    var editable = Backgrid.callByNeed(column.editable(), column, model);

   	    if (this.formatter.fromRaw(model.get(column.get("name")), model)) {
   	    	this.$el.append("<a><span class=\"glyphicon glyphicon-ok\"></span></a>");
   	    }

	    this.delegateEvents();
	    return this;
	  }

	});

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

		if($('#dropdownAno').length > 0){
			var options = $('#dropdownAno')[0];
			if(options.length > 0){
				$(options[options.length - 1]).attr('selected',true);
			}
		}
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
			cell : TemDadosCell,
			editable : false
		}, {
			name : "teve_producao",
			label : "Produção",
			cell : TemDadosCell,
			editable : false
		}, {
			cell: EditCell
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