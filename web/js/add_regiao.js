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
	      	var regiao = this.model;
	      	if ($('#remove_regiao' + this.model.id).length < 1) {
	      		$("body").append('<button id="remove_regiao' + this.model.id + '" hidden="hidden">OK</button>');

	      		$('#remove_regiao' + this.model.id).confirmModal({
		    		confirmTitle : 'Confirma remoção',
		    		confirmMessage : 'Realmente você deseja remover essa região?',
		    		confirmOk : 'Confirma',
		    		confirmCancel : 'Cancela',
		    		confirmDirection : 'rtl',
		    		confirmStyle : 'primary',
					confirmCallback : function (){
						$.ajax({
							type: 'post',
							contentType: "application/json; charset=utf-8",
							scriptCharset: "utf-8" ,
							//criar removeregiao
							url: REST_SERVER + '/removeRegiao',
							data: JSON.stringify(regiao),
							dataType: 'json',
							success: function(){
							   atualizar_grid_regiao();
							},
							error: function(){
							   alert('failure');
							}
						});
					}
    			});
	      	}

    		$('#remove_regiao' + this.model.id).trigger( "click" );
	    },
	    render: function () {
	      this.$el.html(this.template());
	      this.delegateEvents();
	      return this;
	    }
	});

	var AddRegiao = Backbone.Model.extend({
	  initialize: function () {
	    Backbone.Model.prototype.initialize.apply(this, arguments);
	    this.on("change", function (model, options) {
		   	var newModel = model.toJSON();

		    if (options && options.save === false) return;
		    model.save(newModel, {
		       	error: function() { 
		       		alert("Não foi possível realizar a alteração.");
		      		atualizar_grid_regiao();

		        },
		        success: function() {
		        },
		        wait: true
	        });

	        
		  });
	    }
	});

	atualizar_grid_regiao();

	function atualizar_grid_regiao() {

		var AddRegioes = Backbone.Collection.extend({
			model : AddRegiao,
			url : REST_SERVER + "/AddRegioes"
		});

		var adicionaRegiao = new AddRegioes();
		adicionaRegiao.fetch({
			reset : true
		});

		resetarFormRegiao();

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
			name : "nome_regiao",
			label : "Nome da Região",
			cell : "string"
		}];

		grid = new Backgrid.Grid({
			columns : columns,
			collection : adicionaRegiao
		});

		grid.render().sort("nome_regiao", "ascending");

		$("#tabela_add_Regiao").empty();
		$("#tabela_add_Regiao").append(grid.el);

	}
	
    $("#limpar_campos_regiao_add").click(function () {
    	$("#nova_add_regiao_form").data('bootstrapValidator').resetForm();
    });

	function resetarFormRegiao() {
        $("#limpar_campos_regiao_add").trigger( "click" );
	}

	$('#nova_add_regiao_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            nome_regiao_add: {
                validators: {
                    notEmpty: {},
                    stringLength: {
                        min: 3,
                        max: 250
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
        var nome_regiao_add_val = $('input[name="nome_regiao_add"]').val();

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
			// criar adicionaRegiao
			url: REST_SERVER + '/adicionaRegiao',
			data: JSON.stringify(send_data),
			dataType: 'json',
			success: function(){
			   	atualizar_grid_regiao();
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