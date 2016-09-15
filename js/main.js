"use strict";

window.onload = function () {
    let svg = d3.select("svg"),
		webLinks = [],
    	webParticles = [],
		underlay = svg.append("g"),
		rect = underlay.selectAll("rect").data([1]),
		depth = 5,
    	segments = 20,
    	n = segments * depth, // Число точек
    	rSmall = 3,
		step = (2 * Math.PI) / segments,
		points = d3.range(n + 1), // Массив из 140 значений [0..140]
		height = window.innerHeight,
    	width = window.innerWidth,
    	radius = Math.min(width, height) / 2,
		origin = {
        	x: width / 2,
        	y: height / 2
    	},
		radiusStep = radius / n,
		web = d3.layout.force()
    		  .linkStrength(1.0)// Сила связи
    		  .friction(0.7)// Трение
    		  .linkDistance(10)// Расстояние, на котором действует сила связи
    		  .charge(-15)// Заряд
    		  .gravity(0.07)// Сила связи с центром картинки
    		  .theta(0.8)// Точность симуляции  
    		  .alpha(0.1)// Прогресс работы силового поля
    		  .on("tick", tick),// Вызывается на каждой итерации расчета симуляции
		drag = web.drag();

    rect.enter().append("rect").style("fill", "#454545");

    web.size([width, height]);

    rect.attr("width", width)
        .attr("height", height);

    points.forEach(function (p, i) {

        if (i !== points.length - 1) {

            let angle = i * step,
            	// Все время уменьшающийся радиус
				shrinkingRadius = radius - radiusStep * i,
				off = i + segments;

            webParticles.push({

                x: origin.x + Math.cos(angle) * shrinkingRadius,
                y: origin.y + Math.sin(angle) * shrinkingRadius,
                fixed: (i < segments) && (i % 3 == 0) // каждая третья, но только из первых 20.
                // Если fixed = true, точка не участвует в симуляции
            });

            if (i < points.length - 1 && i + 1 !== points.length - 1) {

	            webLinks.push({
	                source: i,
	                target: i + 1
	            });
            }

            if (off < n - 1) {
	             webLinks.push({
	                source: i,
	                target: off
	            });
         	}
            else {
            	webLinks.push({
                	source: i,
               		target: n - 1
            	});
            }  
        }
    });

    // Соединим первую точку и 19, последнюю для "первого круга" спирали
    webLinks.push({
        source: 0,
        target: segments - 1
    });

    
    let svgWebLinks = underlay.selectAll("line")
    				  		  .data(webLinks)
    				  		  .enter()
    				  		  .append("line"),
		svgWebNodes = underlay.selectAll("circle")
							  .data(webParticles)
							  .enter()
							  .append("circle")
        					  .attr("r", rSmall)
        					  .style("fill", "#fff")
        					  .call(drag);

    web.nodes(webParticles)
        .links(webLinks)
        .start();

    alert("По перетаскивай точки!");

    function tick() {
        svgWebLinks.attr('x1', function (d) {
            			return d.source.x
        			})
            		.attr('y1', function (d) {
            			return d.source.y
        			})
            		.attr('x2', function (d) {
            			return d.target.x
        			})
            		.attr('y2', function (d) {
            			return d.target.y
        			});
        svgWebNodes.attr("cx", function (d) {
            			return d.x
       				})
            		.attr("cy", function (d) {
            			return d.y
        			});
    }
}