var grid_producao;
var grid_tecnica;
var grid_certificado;


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

function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") {
        return;
    }

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=");
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) {
            parms[n] = [];
        }

        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}

var dadosAgricultor = parseURLParams(document.URL);

//alert(dadosAgricultor.id);
//alert(dadosAgricultor.ano);

$(document).ready(function() {
	$("#titulo_prod_tec").append(dadosAgricultor.nome);

	var Producao = Backbone.Model.extend({
	  initialize: function () {
	    Backbone.Model.prototype.initialize.apply(this, arguments);
	    this.on("change", function (model, options) {
		   	var newModel = model.toJSON();
		   	if (newModel["area"] == null){
		   		newModel["area"] = $('#area_atividade').val();

		   	}
		   	if (newModel["data"] == null){
		   		newModel["data"] = $('#data_calendario').val();

		   	}
		   	 
		    if (options && options.save === false) return;

		    model.save(newModel, {
		       	error: function() { 
		       		alert("Não foi possível realizar a alteração.");
		       		atualizar_producao();
		        },
		        success: function() {
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
		var Producoes = Backbone.Collection.extend({
			model : Producao,
			//url : "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor_e"
			url : "http://0.0.0.0:5001/producao_tec_e/"+dadosAgricultor.id+"/"+dadosAgricultor.ano
		});

		var producoes = new Producoes();
		producoes.fetch({
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
		var found = producoes.find(function(item){
			console.log(item.get('area'));
       		return item.get('area') != null;
		});

		if (!(typeof found === "undefined")){
			$("#area_atividade").val(found.get('area'));
			$("#data_calendario").val(found.get('data'));

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
    format: 'yyyy/mm/dd',
    startDate: dadosAgricultor.ano+"/01/01",
    endDate: dadosAgricultor.ano+"/12/31",
	})

	function atualizar_tecnica() {
		var Tecnicas = Backbone.Collection.extend({
			model : Tecnica,
			//url : "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor_e"
			url : "http://0.0.0.0:5001/tecnica_e/"+dadosAgricultor.id+"/"+dadosAgricultor.ano
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
			//url : "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor_e"
			url : "http://0.0.0.0:5001/certificados_e/"+dadosAgricultor.id+"/"+dadosAgricultor.ano
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