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
	      	var cultura_model = this.model;
	      	if ($('#remove_cultura_' + this.model.id).length < 1) {
	      		$("body").append('<button id="remove_cultura_' + this.model.id + '" hidden="hidden">OK</button>');

	      		$('#remove_cultura_' + this.model.id).confirmModal({
		    		confirmTitle : 'Confirma remoção',
		    		confirmMessage : 'Realmente você deseja remover essa cultura?',
		    		confirmOk : 'Confirma',
		    		confirmCancel : 'Cancela',
		    		confirmDirection : 'rtl',
		    		confirmStyle : 'primary',
					confirmCallback : function (){
						$.ajax({
							type: 'post',
							contentType: "application/json; charset=utf-8",
							scriptCharset: "utf-8" ,
							url: REST_SERVER + '/removeCultura',
							data: JSON.stringify(cultura_model),
							dataType: 'json',
							success: function(){
							   atualizar_grid();
							},
							error: function(){
							   alert('Não se pode remover esta cultura.');
							}
						});
					}
    			});
	      	}

    		$('#remove_cultura_' + this.model.id).trigger( "click" );
	    },
	    render: function () {
	      this.$el.html(this.template());
	      this.delegateEvents();
	      return this;
	    }
	});

	var AddCultura = Backbone.Model.extend({
	  initialize: function () {
	    Backbone.Model.prototype.initialize.apply(this, arguments);
	    this.on("change", function (model, options) {
		   	var newModel = model.toJSON();

		    if (options && options.save === false) return;
		    model.save(newModel, {
		       	error: function() { 
		       		alert("Não foi possível realizar a alteração.");
		      		atualizar_grid();

		        },
		        success: function() {
		        },
		        wait: true
	        });

	        
		  });
	    }
	});

	atualizar_grid();

	function atualizar_grid() {
		var AddCulturas = Backbone.Collection.extend({
			model : AddCultura,
			//url : "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor_e"
			url : REST_SERVER + "/addCulturas"
		});

		var adicionaCultura = new AddCulturas();
		adicionaCultura.fetch({
			reset : true
		});

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
			name : "nome_cultura",
			label : "Nome",
			cell : "string"
		}];

		grid = new Backgrid.Grid({
			columns : columns,
			collection : adicionaCultura
		});

		grid.render().sort("nome_cultura", "ascending");

		$("#tabela_add_Cultura").empty();
		$("#tabela_add_Cultura").append(grid.el);

	}
	
    $("#limpar_campos_culturas_add").click(function () {
    	$("#nova_add_cultura_form").data('bootstrapValidator').resetForm();
    });

	function resetarForm() {
        $("#limpar_campos_culturas_add").trigger( "click" );
	}

	$('#nova_add_cultura_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            nome_cultura_add: {
                validators: {
                    notEmpty: {},
                    stringLength: {
                        min: 3,
                        max: 60
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
        var nome_culturas_add_val = $('input[name="nome_cultura_add"]').val();

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
			url: REST_SERVER + '/adicionaCultura',
			data: JSON.stringify(send_data),
			dataType: 'json',
			success: function(){
			   	atualizar_grid();
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