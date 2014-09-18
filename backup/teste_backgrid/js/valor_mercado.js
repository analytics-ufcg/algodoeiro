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

	function getRegiaoSelecionada() {
		return $("#dropdown option:selected").val();
	}

	var DeleteCell = Backgrid.Cell.extend({
	    template: _.template("<a href=\"#\"><span class=\"glyphicon glyphicon-trash\"></span></a>"),
	    events: {
	      "click": "deleteRow"
	    },
	    deleteRow: function (e) {
	      	e.preventDefault();
	      	var cultura = this.model;
	    	this.$el.html(this.template()).confirmModal({
	    		confirmTitle : 'Confirma remoção',
	    		confirmMessage : 'Realmente você deseja remover essa cultura?',
	    		confirmOk : 'Confirma',
	    		confirmCancel : 'Cancela',
	    		confirmDirection : 'rtl',
	    		confirmStyle : 'primary',
	    		// 	CRIAR REMOVECULTURA
				confirmCallback : function removeCultura(cultura){
					$.ajax({
						type: 'post',
						contentType: "application/json; charset=utf-8",
						scriptCharset: "utf-8" ,
						url: REST_SERVER + '/removeCultura/' + getRegiaoSelecionada(),
						data: JSON.stringify(agricultor),
						dataType: 'json',
						success: function(){
						    atualizar_regiao(getRegiaoSelecionada());
						},
						error: function(){
						   alert('failure');
						}
					});
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

	var cultura = Backbone.Model.extend({
	  initialize: function () {
	    Backbone.Model.prototype.initialize.apply(this, arguments);
	    this.on("change", function (model, options) {
		   	var newModel = model.toJSON();

		    if (options && options.save === false) return;
		    model.save(newModel, {
		       	error: function() { 
		       		alert("Não foi possível realizar a alteração.");
		      		atualizar_regiao(getRegiaoSelecionada());

		        },
		        success: function() {
		        },
		        wait: true
	        });

	        
		  });
	    }
	});

	atualizar_regiao(getRegiaoSelecionada());

	function atualizar_regiao(regiao_selecionada) {
		var Culturas = Backbone.Collection.extend({
			model : Cultura,
			//url : "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor_e"
			// ver essa url
			url : REST_SERVER + "/culturas_e/" + regiao_selecionada
		});

		var culturas = new Culturas();
		culturas.fetch({
			reset : true
		});
		// ver essa url
		var lista_cultura = readJSON(REST_SERVER + "/culturas_e/" + regiao_selecionada);
		
		atualizar_regiao_form(regiao_selecionada);
		resetarForm();

		var columns = [{
				cell: DeleteCell
			}, {
				name : "id", 
				label : "Id", 
				editable : false, 
				cell : Backgrid.IntegerCell.extend({
					orderSeparator : ''
				}),
				renderable: false
			}, {
				name : "cultura_valor_mercado",
				label : "Cultura",
				cell : Backgrid.SelectCell.extend({
			      // It's possible to render an option group or use a
			      // function to provide option values too.
			      optionValues: lista_cultura["cultura"]
			    })
			}, {
				name : "valor_mercado",
				label : "Valor de Mercado",
				cell : "string" 
			}, {
				name : "ano_valor_mercado",
				label : "Ano ",
				cell : "string"
		    })
		}];

		grid = new Backgrid.Grid({
			columns : columns,
			collection : culturas
		});

		grid.render().sort("cultura_valor_mercado", "ascending");

		$("#tabela_valores_mercado").empty();
		$("#tabela_valores_mercado").append(grid.el);

	}
	
    $("#limpar_campos").click(function () {
    	$("#novo_valor_mercado_form").data('bootstrapValidator').resetForm();
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
	$('#novo_valor_mercado_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            valor_mercado: {
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
        var cultura_valor_mercado_val = $('input[name="cultura_valor_mercado"]').val();
        var ano_valor_mercado_val = $('input[name="ano_valor_mercado"]').val();
        var regiao_val = getRegiaoSelecionada();
        var valor_mercado_val = $('input[name="valor_mercado"]').val();

        // grid.insertRow({cultura_valor_mercado: cultura_valor_mercado_val, ano_valor_mercado: ano_valor_mercado_val, variedade_algodao: variedade_algodao_val, id_comunidade: comunidade_val, regiao: regiao_val});


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
			url: REST_SERVER + '/adicionarCultura/' + regiao_val,
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