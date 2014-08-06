function criaJitter(node, dataAux, padding, radius, eixoX, eixoY, parametroEixoX, parametroEixoY, width, height, grafico){

	var force = d3.layout.force().nodes(dataAux).size([width, height]).on("tick", tick).charge(-1).gravity(0).chargeDistance(20);

	force.start();
	force.resume();

	function tick(e) {
		node.each(moveTowardDataPosition(e.alpha));

		//if (checkbox.node().checked) node.each(collide(e.alpha));
		node.each(collide(e.alpha));
		node.attr("cx", function(d) {
			return d.x;
		});
		// .attr("cy", function(d) { return d.y; });
	}

	function moveTowardDataPosition(alpha) {
		return function(d) {
			if (grafico == "ProdutividadeTecnicas"){
				d.x += ((width + 15) / 2 - d.x) * 0.05 * alpha;
			} else {
				d.x += (eixoX(d[parametroEixoX]) - d.x) * 0.05 * alpha;
			}
			d.y += (eixoY(d[parametroEixoY]) - d.y) * 0.1 * alpha;
		};
	}

	// Resolve collisions between nodes.
	function collide(alpha) {
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

}