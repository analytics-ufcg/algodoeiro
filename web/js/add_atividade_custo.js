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

function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") {
        return;
    }

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=");
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) {
            parms[n] = [];
        }

        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}

$(document).ready(function() {

	var dadosURL = parseURLParams(document.URL);

	var DeleteCell = Backgrid.Cell.extend({
	    template: _.template("<a href=\"#\"><span class=\"glyphicon glyphicon-trash\"></span></a>"),
	    events: {
	      "click": "deleteRow"
	    },
	    deleteRow: function (e) {
	      	e.preventDefault();
	      	var atividade_custo = this.model;
	      	if ($('#remove_atividade_custo' + this.model.id).length < 1) {
	      		$("body").append('<button id="remove_atividade_custo' + this.model.id + '" hidden="hidden">OK</button>');

	      		$('#remove_atividade_custo' + this.model.id).confirmModal({
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
							// criar removeAtividadeCusto
							url: REST_SERVER + '/removeAtividadeCusto' ,
							data: JSON.stringify(atividade_custo),
							dataType: 'json',
							success: function(){
							   atualizar_grid_atividade_custo();
							},
							error: function(){
							   alert('failure');
							}
						});
					}
    			});
	      	}

    		$('#remove_atividade_custo' + this.model.id).trigger( "click" );
	    },
	    render: function () {
	      this.$el.html(this.template());
	      this.delegateEvents();
	      return this;
	    }
	});

	var AtividadeCusto = Backbone.Model.extend({
	  initialize: function () {
	    Backbone.Model.prototype.initialize.apply(this, arguments);
	    this.on("change", function (model, options) {
		   	var newModel = model.toJSON();

		    if (options && options.save === false) return;
		    model.save(newModel, {
		       	error: function() { 
		       		alert("Não foi possível realizar a alteração.");
		      		atualizar_grid_atividade_custo();

		        },
		        success: function() {
		        },
		        wait: true
	        });

	        
		  });
	    }
	});

	atualizar_grid_atividade_custo();

	function atualizar_grid_atividade_custo() {
		var AtividadesCusto = Backbone.Collection.extend({
			model : AtividadeCusto,
			//url : "http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor_e"
			url : REST_SERVER + "/addAtividade_e" 
		});

		var atividade = new AtividadesCusto();
		atividade.fetch({
			reset : true
		});

		resetarFormAtividadeCusto();

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
			name : "nome_atividade_custo",
			label : "Nome da Atividade",
			cell : "string"
		},{
			name : "unidade_atividade_custo",
			label : "Unidade",
			cell : "string"
		}];

		grid = new Backgrid.Grid({
			columns : columns,
			collection : atividade
		});

		grid.render().sort("nome_atividade_custo", "ascending");

		$("#tabela_atividade_custo").empty();
		$("#tabela_atividade_custo").append(grid.el);

	}
	
    $("#limpar_campos_atividade").click(function () {
    	$("#nova_atividade_form_add").data('bootstrapValidator').resetForm();
    });

	function resetarFormAtividadeCusto() {
        $("#limpar_campos_atividade").trigger( "click" );
	}

	// Render the grid and attach the root to your HTML document
	//$("#example-1-result").append(grid.render().el);

	// Fetch some countries from the url
	//territories.fetch({reset: true});
	// var nova_linha;

	// $("#acrescentar").click(function() {
	// 	nova_linha = grid.insertRow({nova_linha: "true"});
	// });
	$('#nova_atividade_form_add').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            nome_atividade_custo_add: {
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
        var nome_atividade_custo_add_val = $('input[name="nome_atividade_custo_add"]').val();
        var unidade_atividade_custo_add_val = $('input[name="unidade_atividade_custo_add"]').val();
        // grid.insertRow({nome_atividade_custo_add: nome_atividade_custo_add_val, sexo: sexo_val, ano_adesao: ano_adesao_val, variedade_algodao: variedade_algodao_val, id_comunidade: comunidade_val, regiao: regiao_val});


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
			// criar adicionaAgricultor
			url: REST_SERVER + '/adicionaAtividadeCusto',
			data: JSON.stringify(send_data),
			dataType: 'json',
			success: function(){
			   	atualizar_grid_atividade_custo();
			},
			error: function(){
			   alert('failure');
			}
		});
    });

	if (typeof(dadosURL) !== 'undefined') {
		if (typeof(dadosURL.add) !== 'undefined') {
			$('#myModal_atividade_add').modal('show');
		}
	}

});