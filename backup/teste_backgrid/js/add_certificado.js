var grid;

var REST_SERVER = 'http://analytics.lsd.ufcg.edu.br/algodoeiro_rest';

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

	var DeleteCell = Backgrid.Cell.extend({
	    template: _.template("<a href=\"#\"><span class=\"glyphicon glyphicon-trash\"></span></a>"),
	    events: {
	      "click": "deleteRow"
	    },
	    deleteRow: function (e) {
	      	e.preventDefault();
	      	var certificado = this.model;
	      	if ($('#remove_certificado' + this.model.id).length < 1) {
	      		$("body").append('<button id="remove_certificado' + this.model.id + '" hidden="hidden">OK</button>');

	      		$('#remove_certificado' + this.model.id).confirmModal({
		    		confirmTitle : 'Confirma remoção',
		    		confirmMessage : 'Realmente você deseja remover esse certificado?',
		    		confirmOk : 'Confirma',
		    		confirmCancel : 'Cancela',
		    		confirmDirection : 'rtl',
		    		confirmStyle : 'primary',
					confirmCallback : function (){
						$.ajax({
							type: 'post',
							contentType: "application/json; charset=utf-8",
							scriptCharset: "utf-8" ,
							url: REST_SERVER + '/removeCertificado',
							data: JSON.stringify(certificado),
							dataType: 'json',
							success: function(){
							   atualizar_grid_certificado();
							},
							error: function(){
							   alert('failure');
							}
						});
					}
    			});
	      	}

    		$('#remove_certificado' + this.model.id).trigger( "click" );
	    },
	    render: function () {
	      this.$el.html(this.template());
	      this.delegateEvents();
	      return this;
	    }
	});

	var AddCertificado = Backbone.Model.extend({
	  initialize: function () {
	    Backbone.Model.prototype.initialize.apply(this, arguments);
	    this.on("change", function (model, options) {
		   	var newModel = model.toJSON();

		    if (options && options.save === false) return;
		    model.save(newModel, {
		       	error: function() { 
		       		alert("Não foi possível realizar a alteração.");
		      		atualizar_grid_certificado();

		        },
		        success: function() {
		        },
		        wait: true
	        });

	        
		  });
	    }
	});

	atualizar_grid_certificado();

	function atualizar_grid_certificado() {
		var AddCertificados = Backbone.Collection.extend({
			model : AddCertificado,
			//url : "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor_e"
			url : REST_SERVER + "/AddCertificados"
		});

		var adicionaCertificado = new AddCertificados();
		adicionaCertificado.fetch({
			reset : true
		});

		resetarFormCertificado();

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
			name : "nome_certificacao",
			label : "Nome da Certificação",
			cell : "string"
		}, {
			name : "nome_simplificado_certificacao",
			label : "Nome Simplificado da Certificação",
			cell : "string"
		}];

		grid = new Backgrid.Grid({
			columns : columns,
			collection : adicionaCertificado
		});

		grid.render().sort("nome_certificacao", "ascending");

		$("#tabela_add_Certificado").empty();
		$("#tabela_add_Certificado").append(grid.el);

	}
	
    $("#limpar_campos_certificados_add").click(function () {
    	$("#nova_add_certificado_form").data('bootstrapValidator').resetForm();
    });

	function resetarFormCertificado() {
        $("#limpar_campos_certificados_add").trigger( "click" );
	}

	$('#nova_add_certificado_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            nome_certificado_add: {
                validators: {
                    notEmpty: {},
                    stringLength: {
                        min: 3,
                        max: 60
                    }
                }
            }, nome_simplificado_certificacao_add: {
                validators: {
                    notEmpty: {},
                    stringLength: {
                        min: 1,
                        max: 20
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
        var nome_certificado_add_val = $('input[name="nome_certificado_add"]').val();
        var nome_simplificado_certificacao_add_val = $('input[name="nome_simplificado_certificacao_add"]').val();

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
			url: REST_SERVER + '/adicionaCertificado',
			data: JSON.stringify(send_data),
			dataType: 'json',
			success: function(){
			   	atualizar_grid_certificado();
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