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
	      	var agricultor = this.model;
	      	if ($('#remove_agricultor_' + this.model.id).length < 1) {
	      		$("body").append('<button id="remove_agricultor_' + this.model.id + '" hidden="hidden">OK</button>');

	      		$('#remove_agricultor_' + this.model.id).confirmModal({
		    		confirmTitle : 'Confirma remoção',
		    		confirmMessage : 'Realmente você deseja remover esse agricultor?',
		    		confirmOk : 'Confirma',
		    		confirmCancel : 'Cancela',
		    		confirmDirection : 'rtl',
		    		confirmStyle : 'primary',
					confirmCallback : function (){
						$.ajax({
							type: 'post',
							contentType: "application/json; charset=utf-8",
							scriptCharset: "utf-8" ,
							url: REST_SERVER + '/removeAgricultor/' + getRegiaoSelecionada(),
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
	      	}

    		$('#remove_agricultor_' + this.model.id).trigger( "click" );
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

	var Agricultor = Backbone.Model.extend({
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
		var Agricultores = Backbone.Collection.extend({
			model : Agricultor,
			//url : "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor_e"
			url : REST_SERVER + "/agricultor_e/" + regiao_selecionada
		});

		var agricultores = new Agricultores();
		agricultores.fetch({
			reset : true
		});

		var comunidade = readJSON(REST_SERVER + "/comunidades_e/" + regiao_selecionada);
		
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
			name : "nome_agricultor",
			label : "Nome",
			cell : "string"
		}, {
			name : "sexo",
			label : "Sexo",
			cell: Backgrid.SelectCell.extend({
		      // It's possible to render an option group or use a
		      // function to provide option values too.
		      optionValues: [["Masculino", "M"], ["Feminino", "F"]]
		    })
		}, {
			name : "ano_adesao",
			label : "Ano Adesão",
			cell : "string" 
		}, {
			name : "variedade_algodao",
			label : "Variedade Algodão",
			cell : "string"
		}, {
			name : "id_comunidade",
			label : "Comunidade",
			cell : Backgrid.SelectCell.extend({
		      // It's possible to render an option group or use a
		      // function to provide option values too.
		      optionValues: comunidade["comunidade"]
		    })
		}];

		grid = new Backgrid.Grid({
			columns : columns,
			collection : agricultores
		});

		grid.render().sort("nome_agricultor", "ascending");

		$("#tabela_agricultores").empty();
		$("#tabela_agricultores").append(grid.el);

	}
	
    $("#limpar_campos").click(function () {
    	$("#novo_agricultor_form").data('bootstrapValidator').resetForm();
		atualizar_regiao_form(getRegiaoSelecionada());
    });

	function resetarForm() {
        $("#limpar_campos").trigger( "click" );
	}

	function atualizar_regiao_form(regiao_selecionada) {
		var comunidades = readJSON(REST_SERVER + "/comunidades_e/" + regiao_selecionada);

		$('select[name="comunidade"]').html('');

		$.each(comunidades.comunidade, function(index, value) {
		    $('select[name="comunidade"]').append($('<option>').text(value[0]).attr('value', value[1]));
		});
	}

	// Render the grid and attach the root to your HTML document
	//$("#example-1-result").append(grid.render().el);

	// Fetch some countries from the url
	//territories.fetch({reset: true});
	// var nova_linha;

	// $("#acrescentar").click(function() {
	// 	nova_linha = grid.insertRow({nova_linha: "true"});
	// });
	$('#novo_agricultor_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            nome_agricultor: {
                validators: {
                    notEmpty: {},
                    stringLength: {
                        min: 3,
                        max: 250
                    },
                    regexp: {
                        regexp: /^[a-zA-Zà-úÀ-Ú ]+$/
                    }
                }
            },
            ano_adesao: {
                validators: {
                }
            },
            sexo: {
                validators: {
                    notEmpty: {}
                }
            },
            variedade_algodao: {
                validators: {
                    notEmpty: {},
                    stringLength: {
                        min: 3,
                        max: 50
                    },
                    regexp: {
                        regexp: /^[a-zA-Zà-úÀ-Ú ]+$/
                    }
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
        var nome_agricultor_val = $('input[name="nome_agricultor"]').val();
        var sexo_val = $('input[name="sexo"]:checked').val();
        var ano_adesao_val = $('input[name="ano_adesao"]').val();
        var regiao_val = getRegiaoSelecionada();
        var comunidade_val = $('select[name="comunidade"] option:selected').val();
        var variedade_algodao_val = $('input[name="variedade_algodao"]').val();

        // grid.insertRow({nome_agricultor: nome_agricultor_val, sexo: sexo_val, ano_adesao: ano_adesao_val, variedade_algodao: variedade_algodao_val, id_comunidade: comunidade_val, regiao: regiao_val});


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
			url: REST_SERVER + '/adicionaAgricultor/' + regiao_val,
			data: JSON.stringify(send_data),
			dataType: 'json',
			success: function(){
			   	atualizar_regiao(regiao_val);
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