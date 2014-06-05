
function redefine_options_select_list(select_list, options){
	$.each(options, function(key, value) {   
	     select_list
	     	.append($("<option></option>")
	        .attr("value", value)
	        .text(value)); 
	});
}

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
            error: function() { console.log('error ajax!'); },
        });

        return dataframe;
}


//////////////////////////////////////##################
var agricultores = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro/agricultores");
redefine_options_select_list($("#menu_agricultores"),_.pluck(agricultores, 'nome_agricultor'));