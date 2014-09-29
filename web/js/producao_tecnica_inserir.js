var grid_producao;
var grid_tecnica;
var grid_certificado;

var REST_SERVER = 'http://analytics.lsd.ufcg.edu.br/algodoeiro_rest';

var dadosAgricultor = parseURLParams(document.URL);

$(document).ready(function() {
	$("#titulo_prod_tec").append(dadosAgricultor.nome);

	var Producao = Backbone.Model.extend({
	  initialize: function () {
	    Backbone.Model.prototype.initialize.apply(this, arguments);
	    this.on("change", function (model, options) {
		   	var newModel = model.toJSON();
		   	if (newModel["area"] == null || newModel["data"] == null){
		   		newModel["area"] = $('#area_atividade').val();
		   		newModel["data"] = $('#data_calendario').val();

		   	}
		   	
		    if (options && options.save === false) return;
		    if (_.keys(model.changed).length > 1) return;
		    
		    model.save(newModel, {
		       	error: function() { 
		       		alert("Não foi possível realizar a alteração.");
		       		atualizar_producao();
		        },
		        success: function() {
		        	atualizar_producao();
		        },
		        wait: true
	        });

	        
		  });
	    }
	});

	var Tecnica = Backbone.Model.extend({
	  initialize: function () {
	    Backbone.Model.prototype.initialize.apply(this, arguments);
	    this.on("change", function (model, options) {
		   	var newModel = model.toJSON();

		    if (options && options.save === false) return;

		    model.save(newModel, {
		       	error: function() { 
		       		alert("Não foi possível realizar a alteração.");
		       		atualizar_tecnica();
		        },
		        success: function() {
		        	atualizar_tecnica();

		        },
		        wait: true
	        });

	        
		  });
	    }
	});

	var Certificacao_model = Backbone.Model.extend({
	  initialize: function () {
	    Backbone.Model.prototype.initialize.apply(this, arguments);
	    this.on("change", function (model, options) {
		   	var newModel = model.toJSON();

		    if (options && options.save === false) return;

		    model.save(newModel, {
		       	error: function() { 
		       		alert("Não foi possível realizar a alteração.");
		       		atualizar_certificados();
		        },
		        success: function() {
		        	atualizar_certificados();

		        },
		        wait: true
	        });

	        
		  });
	    }
	});

	atualizar_producao();
	atualizar_tecnica();
	atualizar_certificados();

	function atualizar_producao() {

		function funcao(a){
			for(i = 0; i < a.length; i++){
				if (a.at(i).get('area')!= null){
					return a.at(i);
				}
			}
			return undefined;
		}

		var Producoes = Backbone.Collection.extend({
			model : Producao,
			url : REST_SERVER + "/producao_tec_e/"+dadosAgricultor.id+"/"+dadosAgricultor.ano
		});

		var producoes = new Producoes();
		producoes.fetch({
			reset : true,
			async : false
		});

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
			name : "id_producao", 
			label : "Id Cultura", 
			editable : false, 
			cell : Backgrid.IntegerCell.extend({
				orderSeparator : ''
			}),
			renderable: false
		}, {
			name : "nome_cultura",
			label : "Nome",
			cell : "string",
			editable : false 

		}, {
			name : "quantidade_produzida",
			label : "Produção",
			cell : "number"
		}, {
			name : "area",
			label : "Área",
			cell : "string",
			editable : false 

		}, {
			name : "data",
			label : "Data",
			cell : "string",
			editable : false 

		}];

		grid_producao = new Backgrid.Grid({
			columns : columns,
			collection : producoes
		});

		grid_producao.render().sort("nome_cultura", "ascending");

		var found = funcao(producoes);
/*		var found = _.find(producoes,function(item){
					console.log(item.get('area'));
		       		return item.get('area') != null;
				});*/


		if (!(typeof found === "undefined")){
			$("#area_atividade").val(found.get('area'));
			$("#data_calendario").val(found.get('data'));

		}else{
			if($("#area_atividade").val()==''){
				$("#area_atividade").val(1);

			}
			if($("#data_calendario").val()==''){
				$("#data_calendario").val(dadosAgricultor.ano+"-01-01");

			}

		}
		$("#tabela_producaoes").empty();
		$("#tabela_producaoes").append(grid_producao.el);

	}

	$('#area_atividade').change("input", function(){	
		
		$.ajax({
			type: 'post',
			contentType: "application/json; charset=utf-8",
			scriptCharset: "utf-8" ,
			// criar adicionaAgricultor
			url: REST_SERVER + '/editaAreaProducao/'+dadosAgricultor.id+"/"+dadosAgricultor.ano,
			data: JSON.stringify({"area_plantada": $('#area_atividade').val()}),
			dataType: 'json',
			success: function(){
			   	atualizar_producao();
			},
			error: function(){
			   alert('failure');
			}
		});
	});

	$('#data_calendario').change("input", function(){	
		$.ajax({
			type: 'post',
			contentType: "application/json; charset=utf-8",
			scriptCharset: "utf-8" ,
			// criar adicionaAgricultor
			url: REST_SERVER + '/editaDataProducao/'+dadosAgricultor.id+"/"+dadosAgricultor.ano,
			data: JSON.stringify({"data": $('#data_calendario').val()}),
			dataType: 'json',
			success: function(){
			   	atualizar_producao();
			},
			error: function(){
			   alert('failure');
			}
		});
	});


	$("#data_calendario").datepicker({
	    language: "pt-BR",
	    format: 'yyyy-mm-dd',
	    startDate: dadosAgricultor.ano+"-01-01",
	    endDate: dadosAgricultor.ano+"-12-31",
	    startView:0
	});


	
	function atualizar_tecnica() {
		var Tecnicas = Backbone.Collection.extend({
			model : Tecnica,
			url : REST_SERVER + "/tecnica_e/"+dadosAgricultor.id+"/"+dadosAgricultor.ano
		});

		var tecnicas = new Tecnicas();
		tecnicas.fetch({
			reset : true
		});

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
			name : "id_tecnica_adotada", 
			label : "Id Tecnica Adotada", 
			editable : false, 
			cell : Backgrid.IntegerCell.extend({
				orderSeparator : ''
			}),
			renderable: false
		}, {
			name : "nome_tecnica",
			label : "Nome",
			cell : "string",
			editable : false 

		}, {
			name : "utilizou",
			label : "Utilizou",
			cell : "boolean"
		}];

		grid_tecnica = new Backgrid.Grid({
			columns : columns,
			collection : tecnicas
		});

		grid_tecnica.render().sort("nome_tecnica", "ascending");


		$("#tabela_tecnicas").empty();
		$("#tabela_tecnicas").append(grid_tecnica.el);

	}

	function atualizar_certificados() {
		var Certificacoes = Backbone.Collection.extend({
			model : Certificacao_model,
			url : REST_SERVER + "/certificados_e/"+dadosAgricultor.id+"/"+dadosAgricultor.ano
		});

		var certifi = new Certificacoes();
		certifi.fetch({
			reset : true
		});

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
			name : "id_certificacao_adotada", 
			label : "Id Certificação Adotada", 
			editable : false, 
			cell : Backgrid.IntegerCell.extend({
				orderSeparator : ''
			}),
			renderable: false
		}, {
			name : "nome_certificacao",
			label : "Nome",
			cell : "string",
			editable : false 

		}, {
			name : "utilizou",
			label : "Utilizou",
			cell : "boolean"
		}];

		grid_certificado = new Backgrid.Grid({
			columns : columns,
			collection : certifi
		});

		grid_certificado.render().sort("nome_certificacao", "ascending");

		$("#tabela_certificados").empty();
		$("#tabela_certificados").append(grid_certificado.el);

	}

});