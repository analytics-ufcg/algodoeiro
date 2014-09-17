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
	$('#modelo').confirmModal({
	    confirmTitle : 'Confirma remoção',
	    confirmMessage : 'Realmente você deseja remover essa atividade?',
	    confirmOk : 'Custom yes',
	    confirmCancel : 'Cutom cancel',
	    confirmDirection : 'rtl',
	    confirmStyle : 'primary',
	    confirmCallback : function(){console.log("confirmou")}
    });

	function getRegiaoSelecionada() {
		return $("#dropdown option:selected").val();
	}

	// carrega dropdown com anos
	var lista_anos = readJSON(REST_SERVER + "/lista_ano_e");

	$.each(lista_anos.ano_atividade, function(index, value) {
	    $('select[name="ano_atividade"]').append($('<option>').text(value[0]).attr('value', value[1]));
	});

	var lista_atividades = readJSON(REST_SERVER + "/atividade_e");

	$.each(lista_atividades.atividade, function(index, value) {
	    $('select[name="atividade_custo"]').append($('<option>').text(value[0]).attr('value', value[1]));
	});

	var DeleteCell = Backgrid.Cell.extend({
	    template: _.template("<span class=\"glyphicon glyphicon-trash\"></span>"),
	    events: {
	      "click": "deleteRow"
	    },
	    deleteRow: function (e) {
	      e.preventDefault();
	      var modelo = this.model;
	      console.log(JSON.stringify(modelo))
	      $.ajax({
				type: 'delete',
				contentType: "application/json; charset=utf-8",
				scriptCharset: "utf-8" ,
				url: REST_SERVER + '/removeAtividade/' + getRegiaoSelecionada(),
				data: JSON.stringify(modelo),
				dataType: 'json',
				success: function(){
			       atualizar_regiao(getRegiaoSelecionada());
				},
				error: function(){
				   alert('failure');
				}
			});
	    },
	    render: function () {
	      this.$el.html(this.template());
	      this.delegateEvents();
	      return this;
	    }
	});

	var regiao = readJSON(REST_SERVER + "/regioes");

	$.each(regiao, function(index, value) {
	     $('#dropdown').append($('<option>').text(value.regiao).attr('value', value.id));
	});

	var regiao_selecionada = getRegiaoSelecionada();

	$('#dropdown').change(function(data) {
		regiao_selecionada = getRegiaoSelecionada();
		atualizar_regiao(regiao_selecionada);
	});

	var Atividade = Backbone.Model.extend({
	  initialize: function () {
	    Backbone.Model.prototype.initialize.apply(this, arguments);
	    this.on("change", function (model, options) {
		   	var newModel = model.toJSON();

		    if (options && options.save === false) return;
		    
		    if (newModel.quantidade_atividade === null) {
		    	alert("A quantidade não pode ser vazia.");

		    	var quantidade_atividade_anterior = model.previous("quantidade_atividade");
		    	model.set({quantidade_atividade : quantidade_atividade_anterior});
		    } else if(newModel.valor_atividade === null) {
		    	alert("O valor da atividade não pode ser vazio.");

		    	var valor_atividade_anterior = model.previous("valor_atividade");
		    	model.set({valor_atividade : valor_atividade_anterior});
		    } else {
		    	model.save(newModel, {
		        	error: function() { 
		        		alert("Não foi possível realizar a alteração.");
		        	},
		        	success: function() {
		        	},
		        	wait: true
	        	});
		    }

	        
		  });
	    }
	});

	atualizar_regiao(getRegiaoSelecionada());

	function atualizar_regiao(regiao_selecionada) {
		var Atividades = Backbone.Collection.extend({
			model : Atividade,
			//url : "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor_e"
			url : REST_SERVER + "/custos_atividade_e/" + regiao_selecionada
		});

		var atividades = new Atividades();
		atividades.fetch({
			reset : true
		});

		var lista_atividade = readJSON(REST_SERVER + "/atividade_e");
		var lista_ano = readJSON(REST_SERVER + "/lista_ano_e");


		var columns = [{
			cell: DeleteCell
		}, {
			name : "id_atividade",
			label : "Atividade",
			cell : Backgrid.SelectCell.extend({
		      // It's possible to render an option group or use a
		      // function to provide option values too.
		      optionValues: lista_atividade["atividade"]
		    })
		}, {
			name : "quantidade_atividade",
			label : "Quantidade",
			cell : "string" 
		}, {
			name : "valor_atividade",
			label : "Valor",
			cell : "string"
		}, {
			name : "ano_atividade",
			label : "Ano",
			cell: Backgrid.SelectCell.extend({
		      // It's possible to render an option group or use a
		      // function to provide option values too.
		      optionValues: lista_ano["ano_atividade"]
		    })
		}];

		grid = new Backgrid.Grid({
			columns : columns,
			collection : atividades
		});

		grid.render().sort("id_atividade", "descending");

		$("#tabela_custo_regiao").empty();
		$("#tabela_custo_regiao").append(grid.el);

	}
	
    $("#limpar_campos").click(function () {
    	$("#nova_atividade_form").data('bootstrapValidator').resetForm();
		atualizar_regiao(getRegiaoSelecionada);
    });

	function resetarForm() {
        $("#limpar_campos").trigger( "click" );
	}



	// Render the grid and attach the root to your HTML document
	//$("#example-1-result").append(grid.render().el);

	// Fetch some countries from the url
	//territories.fetch({reset: true});
	// var nova_linha;

	// $("#acrescentar").click(function() {
	// 	nova_linha = grid.insertRow({nova_linha: "true"});
	// });
	$('#nova_atividade_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            quantidade_atividade: {
                validators: {
                	integer: {
                    }
                }
            },
            valor_atividade: {
            	validators: {
            		min: 0.0
            	}
            }
        }
    })
    .on('success.form.bv', function(e) {
    	function ConvertFormToJSON(form){
		    var array = jQuery(form).serializeArray();
		    var json = {};
		    
		    jQuery.each(array, function() {
		        json[this.name] = this.value || '';
		    });
		    
		    return json;
		}

        e.preventDefault();
        // verificar se pode apagar
        // var nome_agricultor_val = $('input[name="nome_agricultor"]').val();
        // var sexo_val = $('input[name="sexo"]:checked').val();
        // var ano_adesao_val = $('input[name="ano_adesao"]').val();
        // var regiao_val = getRegiaoSelecionadaForm();
        // var comunidade_val = $('select[name="comunidade"] option:selected').val();
        // var variedade_algodao_val = $('input[name="variedade_algodao"]').val();

        // // grid.insertRow({nome_agricultor: nome_agricultor_val, sexo: sexo_val, ano_adesao: ano_adesao_val, variedade_algodao: variedade_algodao_val, id_comunidade: comunidade_val, regiao: regiao_val});



        // Get the form instance
        var $form = $(e.target);

        // Get the BootstrapValidator instance
        var bv = $form.data('bootstrapValidator');
        var send_data = ConvertFormToJSON($form);
        // Use Ajax to submit form data

		$.ajax({
			type: 'post',
			contentType: "application/json; charset=utf-8",
			scriptCharset: "utf-8" ,
			//adicionarAtividade
			url: REST_SERVER + '/adicionaAtividade/' + regiao_val,
			data: JSON.stringify(send_data),
			dataType: 'json',
			success: function(){
			   if (regiao_selecionada == regiao_val) {
			       atualizar_regiao(regiao_val);
			   }

	           resetarForm();
			},
			error: function(){
			   alert('failure');
			}
		});

//          $.post(, {nome_agricultor: nome_agricultor_val, sexo: sexo_val, ano_adesao: ano_adesao_val, variedade_algodao: variedade_algodao_val, id_comunidade: comunidade_val, regiao: regiao_val}, function(result) {
//              alert( "success" );
//          }, 'json')
//          .done(function() {
		// 	alert( "second success" );
		// })
		// .fail(function() {
		// alert( "error" );
		// })
		// .always(function() {
		// alert( "finished" );
		// });
    });

});