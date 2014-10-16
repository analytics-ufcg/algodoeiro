var grid;

var REST_SERVER = 'http://analytics.lsd.ufcg.edu.br/algodoeiro_rest';

$(document).ready(function() {

	var DeleteCell = Backgrid.Cell.extend({
	    template: _.template("<a href=\"#\"><span class=\"glyphicon glyphicon-trash\"></span></a>"),
	    events: {
	      "click": "deleteRow"
	    },
	    deleteRow: function (e) {
	      	e.preventDefault();
	      	var comunidade_model = this.model;
	      	if ($('#remove_comunidade_' + this.model.id).length < 1) {
	      		$("body").append('<button id="remove_comunidade_' + this.model.id + '" hidden="hidden">OK</button>');

	      		$('#remove_comunidade_' + this.model.id).confirmModal({
		    		confirmTitle : 'Confirma remoção',
		    		confirmMessage : 'Realmente você deseja remover essa comunidade?',
		    		confirmOk : 'Confirma',
		    		confirmCancel : 'Cancela',
		    		confirmDirection : 'rtl',
		    		confirmStyle : 'primary',
					confirmCallback : function (){
						$.ajax({
							type: 'post',
							contentType: "application/json; charset=utf-8",
							scriptCharset: "utf-8" ,
							url: REST_SERVER + '/removeComunidade',
							data: JSON.stringify(comunidade_model),
							dataType: 'json',
							success: function(){
							   atualizar_grid_comunidade();
							},
							error: function(){
							   alert('failure');
							}
						});
					}
    			});
	      	}

    		$('#remove_comunidade_' + this.model.id).trigger( "click" );
	    },
	    render: function () {
	      this.$el.html(this.template());
	      this.delegateEvents();
	      return this;
	    }
	});

	var Comunidade_com = Backbone.Model.extend({
	  initialize: function () {
	    Backbone.Model.prototype.initialize.apply(this, arguments);
	    this.on("change", function (model, options) {
		   	var newModel = model.toJSON();

		    if (options && options.save === false) return;
		    model.save(newModel, {
		       	error: function() { 
		       		alert("Não foi possível realizar a alteração.");
		      		atualizar_grid_comunidade();

		        },
		        success: function() {
		        },
		        wait: true
	        });

	        
		  });
	    }
	});

	atualizar_grid_comunidade();

	function atualizar_grid_comunidade() {
		var Comunidades = Backbone.Collection.extend({
			model : Comunidade_com,
			//url : "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor_e"
			url : REST_SERVER + "/addComunidade_e"
		});

		var comunidades_var = new Comunidades();
		comunidades_var.fetch({
			reset : true
		});

		var regiao = readJSON(REST_SERVER + "/regiao_e");
		
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
			name : "nome_comunidade",
			label : "Nome da Comunidade",
			cell : "string"
		}, {
			name : "nome_cidade",
			label : "Nome da Cidade",
			cell : "string" 
		}, {
			name : "id_regiao",
			label : "Regiao",
			cell : Backgrid.SelectCell.extend({
		      // It's possible to render an option group or use a
		      // function to provide option values too.
		      optionValues: regiao["regiao"]
		    })
		}];

		grid = new Backgrid.Grid({
			columns : columns,
			collection : comunidades_var
		});

		grid.render().sort("nome_comunidade", "ascending");

		$("#tabela_add_comunidade").empty();
		$("#tabela_add_comunidade").append(grid.el);

	}
	
    $("#limpar_campos_add_comunidade").click(function () {
    	$("#nova_comunidade_form").data('bootstrapValidator').resetForm();
    });

	function resetarForm() {
        $("#limpar_campos_add_comunidade").trigger( "click" );
	}


	var regiao = readJSON(REST_SERVER + "/regiao_e");

	$('select[name="regiao_com"]').html('');

	$.each(regiao.regiao, function(index, value) {
        $('select[name="regiao_com"]').append($('<option>').text(value[0]).attr('value', value[1]));
	});


	// Render the grid and attach the root to your HTML document
	//$("#example-1-result").append(grid.render().el);

	// Fetch some countries from the url
	//territories.fetch({reset: true});
	// var nova_linha;

	// $("#acrescentar").click(function() {
	// 	nova_linha = grid.insertRow({nova_linha: "true"});
	// });
	$('#nova_comunidade_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            nome_comunidade: {
                validators: {
                    notEmpty: {},
                    stringLength: {
                        min: 3,
                        max: 50
                    },
                    regexp: {
                        regexp: /^[a-zA-Zà-úÀ-Ú0-9 ]+$/
                    }
                }
            },
            nome_cidade: {
                validators: {
                    notEmpty: {},
                    stringLength: {
                        min: 3,
                        max: 50
                    },
                    regexp: {
                        regexp: /^[a-zA-Zà-úÀ-Ú0-9 ]+$/
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
        var nome_comunidade_val = $('input[name="nome_comunidade"]').val();
        var nome_cidade_val = $('input[name="nome_cidade"]').val();
        var regiao_val = $('select[name="regiao_com"] option:selected').val();

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
			url: REST_SERVER + '/adicionaComunidade',
			data: JSON.stringify(send_data),
			dataType: 'json',
			success: function(){
			   	atualizar_grid_comunidade();
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