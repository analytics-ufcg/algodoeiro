// Resolve collisions between nodes.
function collide(alpha, dataAux, padding, radius) {
	var quadtree = d3.geom.quadtree(dataAux);
	return function(d) {
		var r = d.radius + radius + padding, 
			nx1 = d.x - r, 
			nx2 = d.x + r, 
			ny1 = d.y - r, 
			ny2 = d.y + r;
		
		quadtree.visit(function(quad, x1, y1, x2, y2) {
			if (quad.point && (quad.point !== d)) {
				var x = d.x - quad.point.x,
					y = d.y - quad.point.y,
					l = Math.sqrt(x * x + y * y),
					//modifiquei para == em vez de !==
					r = d.radius + quad.point.radius + (d.color == quad.point.color) * padding;
				
				if (l < r) {
					l = (l - r) / l * alpha;
					d.x -= x *= l;
					/*d.y -= y *= l;*/
					quad.point.x += x;
					/*quad.point.y += y;*/
				}
			}
			return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
		});
	};
}



function colocaLegendaRegioes(color,svg, width){
	var legend = svg.selectAll(".legend").data(color.domain().sort()).enter().append("g").attr("class", "legend").attr("transform", function(d, i) {
		return "translate(0," + i * 20 + ")";
	});

	legend.append("rect").attr("x", width - 18).attr("width", 18).attr("height", 18).style("fill", color);

	legend.append("text").attr("x", width - 24).attr("y", 9).attr("dy", ".35em").style("text-anchor", "end").text(function(d) {
		return d;
	});

}

function tamanhoBoxPlot(tamanhoDaTela, numColunas){
	//exceção caso o numero de colunas seja 0
	if (numColunas == 0){
		return;
	} 

	// o tamanho do box plot será 2/3 do tamanhoDaTela/numeroDeColunas para que não se sobreponham.
	tamanho = (tamanhoDaTela / numColunas) * 0.66;

	// if para evitar que o box plot fique grande de mais
	if (tamanho > tamanhoDaTela * 0.12){
		return tamanhoDaTela * 0.12;
	}
	
	return tamanho;
}

//A funcao cria 1 box plot.
function criaBoxPlot(valores, svg, y, posicaoEixoX, widthRect){
	//Ordena os valores para que se possa pegar a mediana e quartis.
	valores = valores.sort(function(a, b) {
			return a - b;
		});

	var quartilSuperior = d3.quantile(valores, .75);

	var mediana = d3.quantile(valores, .5);

	var quartilInferior = d3.quantile(valores, .25);

	//define a altura do retangulo
	var heightRect = Math.abs(y(quartilSuperior) - y(quartilInferior));

	//define a largura do retangulo
	var widthRect = widthRect;

	//define a posição no eixo x que sera plotado o box plot
	var posicaoEixoX = posicaoEixoX - (widthRect / 2);

	//add rectangle
	svg.append("rect").attr("height", heightRect).attr("width", widthRect)
	.attr("x", posicaoEixoX).attr("y", y(quartilSuperior))
	.attr("fill", "white").attr("stroke", "black")
	.attr("stroke-width", 0.5).attr("fill", "transparent");

	//add line
	svg.append("line").attr("x1", posicaoEixoX).attr("y1", y(mediana))
	.attr("x2", widthRect + posicaoEixoX).attr("y2", y(mediana)).attr("stroke", "black").attr("stroke-width", 0.5);
}
