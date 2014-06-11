
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
           error: function(xhr, status, error) {
              var err = eval("(" + xhr.responseText + ")");
              console.log(err.Message);
            }
        });

        return dataframe;
}

function readCSV(url){
        var dataframe;

        $.ajax({
            url : url,
            type : 'GET',
            async: false,
            dataType : 'text',
            success: function(data) { 
                console.log("success csv!");
                dataframe = data;
             },                                                                                                                                                                                       
           error: function(xhr, status, error) {
              var err = eval("(" + xhr.responseText + ")");
              console.log(err.Message);
            }
        });

        return dataframe;
}



//////////////////////////////////////##################
// var agricultores = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultores");
// //redefine_options_select_list($("#menu_agricultores"),_.pluck(agricultores, 'nome_agricultor'));
// nomes = _.pluck(agricultores, 'nome_agricultor');
// nomes = ['2010','2011','2012']
// var seletor = d3.select("#menu_agricultores");
// var finala = seletor.
//     append("select").
//     selectAll("option").
//     data(nomes).
//     enter().
//     append("option")
//     .attr("value", function(d){return d;})
//     .text(function(d){return d;});

// finala.text(function(d) { 
//         return d.nome_agricultor; 
//     });
    //  var yrslct = new Date().getFullYear();
    // function range(a,b,c,d){d=[];c=b-a+1;while(c--)d[c]=a++;return d};

    // var dpyrs = range(1869,yrslct);

    // var selectUI = d3.select("#droplist")
    //       .append("select")
    //       .attr("id","yrselect")
    //       .selectAll("option")
    //       .data(d3.values(dpyrs))
    //       .enter()
    //       .append("option")
    //       .attr("value", function(d){return d;})
    //       .text(function(d){return d;});