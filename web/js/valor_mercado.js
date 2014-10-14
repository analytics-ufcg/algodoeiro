var grid;

var REST_SERVER = 'http://analytics.lsd.ufcg.edu.br/algodoeiro_rest';

$(document).ready(function() {

	function getRegiaoSelecionada() {
		return $("#dropdown option:selected").val();
	}

	function getAnoSelecionado() {
		return $("#dropdown_ano option:selected").val();
	}

	var DeleteCell = Backgrid.Cell.extend({
	    template: _.template("<a href=\"#\"><span class=\"glyphicon glyphicon-trash\"></span></a>"),
	    events: {
	      "click": "deleteRow"
	    },	    
	    deleteRow: function (e) {
	      	e.preventDefault();
	      	var mercado_value = this.model;
	      	if ($('#remove_valor_' + this.model.id).length < 1) {
	      		$("body").append('<button id="remove_valor_' + this.model.id + '" hidden="hidden">OK</button>');

	      		$('#remove_valor_' + this.model.id).confirmModal({
		    		confirmTitle : 'Confirma remoção',
		    		confirmMessage : 'Realmente você deseja remover esse valor de mercado?',
		    		confirmOk : 'Confirma',
		    		confirmCancel : 'Cancela',
		    		confirmDirection : 'rtl',
		    		confirmStyle : 'primary',
					confirmCallback : function (){
						$.ajax({
							type: 'post',
							contentType: "application/json; charset=utf-8",
							scriptCharset: "utf-8" ,
							url: REST_SERVER + '/removeValorMercado/' + getRegiaoSelecionada() +'/'+ getAnoSelecionado(),
							data: JSON.stringify(mercado_value),
							dataType: 'json',
							success: function(){
							   atualizar_regiao(getRegiaoSelecionada(), getAnoSelecionado());
							},
							error: function(){
							   alert('failure');
							}
						});
					}
    			});
	      	}

    		$('#remove_valor_' + this.model.id).trigger( "click" );
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
	var ano_selecionado = getAnoSelecionado();


	$('#dropdown').change(function(data) {
		regiao_selecionada = getRegiaoSelecionada();
		ano_selecionado = getAnoSelecionado();
		atualizar_regiao(regiao_selecionada, ano_selecionado);
	});

	function vm_atualiza_dropdown_ano(){
		var ano_mercado_value = readJSON(REST_SERVER + "/lista_ano_e");
		$('#dropdown_ano').empty();

		$.each(ano_mercado_value.ano, function(index, value) {
		     $('#dropdown_ano').append($('<option>').text(value[0]).attr('value', value[1]));
		});
		if($('#dropdown_ano').length > 0){
			var options = $('#dropdown_ano')[0];
			if(options.length > 0){
				$(options[options.length - 1]).attr('selected',true);
			}
		}

	}
	vm_atualiza_dropdown_ano();


	$('#dropdown_ano').change(function(data) {
		regiao_selecionada = getRegiaoSelecionada();
		ano_selecionado = getAnoSelecionado();
		atualizar_regiao(regiao_selecionada, ano_selecionado);
	});

	var lista_valor_mercado = readJSON(REST_SERVER + "/cultura_e");

	$.each(lista_valor_mercado.cultura, function(index, value) {
	    $('select[name="cultura_valor_mercado"]').append($('<option>').text(value[0]).attr('value', value[1]));
	});


	var Valor_Mercado = Backbone.Model.extend({
	  initialize: function () {
	    Backbone.Model.prototype.initialize.apply(this, arguments);
	    this.on("change", function (model, options) {
		   	var newModel = model.toJSON();

		    if (options && options.save === false) return;
		    model.save(newModel, {
		       	error: function() { 
		       		alert("Não foi possível realizar a alteração.");
		      		atualizar_regiao(getRegiaoSelecionada(), getAnoSelecionado());

		        },
		        success: function() {
		        },
		        wait: true
	        });

	        
		  });
	    }
	});

	atualizar_regiao(getRegiaoSelecionada(), getAnoSelecionado());

	function atualizar_regiao(regiao_sel, ano_sel) {
		var Culturas = Backbone.Collection.extend({
			model : Valor_Mercado,
			url : REST_SERVER + "/valor_mercado/" + regiao_sel + "/" + ano_sel
		});

		var culturas = new Culturas();
		culturas.fetch({
			reset : true
		});
		resetarForm();

		var lista_cultura = readJSON(REST_SERVER + "/cultura_e");
		var lista_ano = readJSON(REST_SERVER + "/lista_ano_e");

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
				name : "id_cultura",
				label : "Cultura",
				cell : Backgrid.SelectCell.extend({
			      // It's possible to render an option group or use a
			      // function to provide option values too.
			      optionValues: lista_cultura["cultura"]
			    })
			}, {
				name : "valor_mercado",
				label : "Valor de Mercado (R$)",
				cell : "number" 
			}, {
				name : "ano",
				label : "Ano",
				editable : false, 
				cell : Backgrid.SelectCell.extend({
		      // It's possible to render an option group or use a
		      // function to provide option values too.
		      optionValues: lista_ano["ano"]
		    })
		    }];

		grid = new Backgrid.Grid({
			columns : columns,
			collection : culturas
		});

		grid.render().sort("id_cultura", "ascending");

		$("#tabela_valores_mercado").empty();
		$("#tabela_valores_mercado").append(grid.el);

	}
	
    $("#limpar_campos").click(function () {
    	$("#novo_valor_mercado_form").data('bootstrapValidator').resetForm();
    });


	function resetarForm() {
        $("#limpar_campos").trigger( "click" );
	}

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
            		notEmpty: {}
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
        var ano_valor_mercado_val = getAnoSelecionado();
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
			url: REST_SERVER + '/adicionarValorMercado/' + regiao_val + "/" + ano_valor_mercado_val,
			data: JSON.stringify(send_data),
			dataType: 'json',
			success: function(){
			    atualizar_regiao(regiao_val, ano_valor_mercado_val);
			},
			error: function(){
			   	alert('Valor dessa cultura já está cadastrado.');
			   	resetarForm();
			}
		});

    });

});