function gra() {
	
	var data = [4, 8, 15, 16, 23, 42];

	d3.select("body").append("div").html("helu, baby!");
	
	d3.select("body")
	.append("svg")
	.attr("width", 50)
	.attr("height", 50)
	.append("circle")
	.attr("cx", 25)
	.attr("cy", 25)
	.attr("r", 25)
	.style("fill", "purple");	
}


