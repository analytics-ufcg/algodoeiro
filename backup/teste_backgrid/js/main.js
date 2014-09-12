var grid;

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

	function getRegiaoSelecionadaForm() {
		return $('select[name="regiao"] option:selected').val();
	}

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
				url: 'http://localhost:5001/removeAgricultor/' + getRegiaoSelecionadaForm(),
				data: JSON.stringify(modelo),
				dataType: 'json',
				success: function(){
			       atualizar_regiao(getRegiaoSelecionadaForm());
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

	var regiao = readJSON("http://localhost:5001/regioes");

	$.each(regiao, function(index, value) {
	     $('#dropdown').append($('<option>').text(value.regiao).attr('value', value.id));
	});

	$.each(regiao, function(index, value) {
	     $('select[name="regiao"]').append($('<option>').text(value.regiao).attr('value', value.id));
	});

	var regiao_selecionada = getRegiaoSelecionada();
	var regiao_selecionada_form = getRegiaoSelecionadaForm();

	$('#dropdown').change(function(data) {
		regiao_selecionada = getRegiaoSelecionada();
		atualizar_regiao(regiao_selecionada);
	});

	$('select[name="regiao"]').change(function(data) {
		regiao_selecionada_form = getRegiaoSelecionadaForm();
		atualizar_regiao_form(regiao_selecionada_form);
	});

	var Agricultor = Backbone.Model.extend({
	  initialize: function () {
	    Backbone.Model.prototype.initialize.apply(this, arguments);
	    this.on("change", function (model, options) {
		   	var newModel = model.toJSON();

		    if (options && options.save === false) return;
		    
		    if (newModel.nome_agricultor === "") {
		    	alert("Nome do agricultor não pode ser vazio.");

		    	var nome_anterior = model.previous("nome_agricultor");
		    	model.set({nome_agricultor : nome_anterior});
		    } else if(newModel.variedade_algodao === "") {
		    	alert("Variedade do algodão não pode ser vazio.");

		    	var variedade_anterior = model.previous("variedade_algodao");
		    	model.set({variedade_algodao : variedade_anterior});
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
	atualizar_regiao_form(getRegiaoSelecionadaForm());

	function atualizar_regiao(regiao_selecionada) {
		var Agricultores = Backbone.Collection.extend({
			model : Agricultor,
			//url : "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor_e"
			url : "http://localhost:5001/agricultor_e/" + regiao_selecionada
		});

		var agricultores = new Agricultores();
		agricultores.fetch({
			reset : true
		});

		var comunidade = readJSON("http://localhost:5001/comunidades_e/" + regiao_selecionada);
		
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
		atualizar_regiao_form(getRegiaoSelecionadaForm());
    });

	function resetarForm() {
        $("#limpar_campos").trigger( "click" );
	}

	function atualizar_regiao_form(regiao_selecionada_form) {
		var comunidades = readJSON("http://localhost:5001/comunidades_e/" + regiao_selecionada_form);

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
        var regiao_val = getRegiaoSelecionadaForm();
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
			url: 'http://localhost:5001/adicionaAgricultor/' + regiao_val,
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