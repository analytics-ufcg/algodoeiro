var grid;

var REST_SERVER = 'http://analytics.lsd.ufcg.edu.br/algodoeiro_rest';

$(document).ready(function() {

	function getRegiaoSelecionada() {
		return $("#dropdown option:selected").val();
	}
	// adicionado testar
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
	      	var custo = this.model;
	      	if ($('#remove_atividade_' + this.model.id).length < 1) {
	      		$("body").append('<button id="remove_atividade_' + this.model.id + '" hidden="hidden">OK</button>');

	      		$('#remove_atividade_' + this.model.id).confirmModal({
		    		confirmTitle : 'Confirma remoção',
		    		confirmMessage : 'Realmente você deseja remover essa atividade?',
		    		confirmOk : 'Confirma',
		    		confirmCancel : 'Cancela',
		    		confirmDirection : 'rtl',
		    		confirmStyle : 'primary',
					confirmCallback : function (){
						$.ajax({
							type: 'post',
							contentType: "application/json; charset=utf-8",
							scriptCharset: "utf-8" ,
							url: REST_SERVER + '/removeAtividade/' + getRegiaoSelecionada() +'/'+ getAnoSelecionado(),
							data: JSON.stringify(custo),
							dataType: 'json',
							success: function(){
							   atualizar_regiao(getRegiaoSelecionada(), getAnoSelecionado());
							},
							error: function(){
							   alert('Coloque uma data valida');
							}
						});
					}
    			});
	      	}

    		$('#remove_atividade_' + this.model.id).trigger( "click" );
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
	//adicionado testar
	var ano_custo = readJSON(REST_SERVER + "/lista_ano_e");

	$.each(ano_custo.ano, function(index, value) {
	     $('#dropdown_ano').append($('<option>').text(value[0]).attr('value', value[1]));
	});


	$('#dropdown_ano').change(function(data) {
		regiao_selecionada = getRegiaoSelecionada();
		ano_selecionado = getAnoSelecionado();
		atualizar_regiao(regiao_selecionada, ano_selecionado);
	});



	// carrega dropdown com anos

	var lista_atividades = readJSON(REST_SERVER + "/atividade_e");

	$.each(lista_atividades.atividade, function(index, value) {
	    $('select[name="atividade_custo"]').append($('<option>').text(value[0]).attr('value', value[1]));
	});



	var Atividade = Backbone.Model.extend({
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
		var Atividades = Backbone.Collection.extend({
			model : Atividade,
			//url : "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor_e"
			url : REST_SERVER + "/custos_atividade_e/" + regiao_sel + "/" + ano_sel
		});

		var atividades = new Atividades();
		atividades.fetch({
			reset : true
		});
		resetarForm();

		var lista_atividade = readJSON(REST_SERVER + "/atividade_e");
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
		},{
			name : "id_atividade",
			label : "Atividade",
			cell : Backgrid.SelectCell.extend({
		      // It's possible to render an option group or use a
		      // function to provide option values too.
		      optionValues: lista_atividade["atividade"]
		    })
		}, {
			name : "quantidade_atividade",
			label : "Quantidade Utilizada",
			cell : "number" 
		}, {
			name : "valor_unitario",
			label : "Valor Unitario(R$)",
			cell : "number"
		}, {
			name : "ano",
			label : "Ano",
			editable : false, 
			cell: Backgrid.SelectCell.extend({
		      // It's possible to render an option group or use a
		      // function to provide option values too.
		      optionValues: lista_ano["ano"]
		    })
		}, {
			name : "area", 
			label : "Area", 
			editable : false, 
			cell : "number",
			renderable: true
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
    });

	function resetarForm() {
        $("#limpar_campos").trigger( "click" );
	}


	$('#area_atividade').change("input", function(){
		var area_val = $('#area_atividade').val();

		$.ajax({
			type: 'post',
			contentType: "application/json; charset=utf-8",
			scriptCharset: "utf-8" ,
			url: REST_SERVER + '/updateAreaAtividade/' + getRegiaoSelecionada() +'/'+ getAnoSelecionado(),
			data: JSON.stringify({"area": area_val}),
			dataType: 'json',
			success: function(){
			    atualizar_regiao(getRegiaoSelecionada(), getAnoSelecionado());
			},
			error: function(){
			    alert('failure');
			}
		});
	});


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
                	notEmpty: {}

                }
            },
            valor_atividade: {
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
        var atividade_custo_val = $('select[name="atividade_custo"]').val();
        var quantidade_atividade_val = $('input[name="quantidade_atividade"]').val();
        var valor_atividade_val = $('input[name="valor_atividade"]').val();
        var regiao_val = getRegiaoSelecionada();
        var ano_atividade_val = getAnoSelecionado();

        // adiciona no grid mas não no bd
        //grid.insertRow({id_atividade: atividade_custo_val, quantidade_atividade: quantidade_atividade_val, valor_atividade: valor_atividade_val,ano_atividade: ano_atividade_val, regiao: regiao_val});



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
			// CRIAR ADICIONAATIVIDADE
			url: REST_SERVER + '/adicionaAtividade/' + regiao_val +'/'+ ano_atividade_val,
			data: JSON.stringify(send_data),
			dataType: 'json',
			success: function(){
			    atualizar_regiao(regiao_val, ano_atividade_val);
			},
			error: function(){
			   alert('Já existe o valor dessa atividade cadastrado.');
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