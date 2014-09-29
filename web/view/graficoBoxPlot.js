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
	if (valores.length == 0){
		return;
	}

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
