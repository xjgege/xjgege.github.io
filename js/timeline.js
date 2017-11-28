// Timeline Visualization
Timeline = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data;
	this.displayData = _data;

	this.initVis();
};

Timeline.prototype.initVis = function() {
	var vis = this;

	vis.margin = { top: 40, right: 0, bottom: 0, left: 60 };

	vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
		vis.height = 150 - vis.margin.top - vis.margin.bottom;

	// SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement).append("svg")
		.attr("width", vis.width + vis.margin.left + vis.margin.right)
		.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		.append("g")
		.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	vis.x = d3.time.scale()
		.range([0, vis.width]);

	vis.y = d3.scale.linear()
        .domain([10, 60])
        .range([10, vis.height - 20]);

	vis.xAxis = d3.svg.axis()
		.scale(vis.x)
		.orient("top");

    vis.names = d3.scale.ordinal()
        .domain(["Paintings", "Prints", "Drawings", "Photographs",  "Sculpture", "Other"])
        .rangeRoundBands([10, vis.height]);

    vis.yAxis = d3.svg.axis()
        .scale(vis.names)
        .orient("left");

	vis.focus = vis.svg.append("g")
        .style("display", "none");

	vis.svg.append("g")
		.attr("class", "x-axis axis")
		.attr("transform", "translate(15, 0)");

	vis.svg.append("g")
        .attr("class", "y-axis axis")
        .attr("transform", "translate(15, -10)");

	var line = vis.svg.select("g")
		.append("line")
		.attr("class", "line")
		.style("opacity", 0);

	vis.cValue = function(d) { 
		    if (d.classification == "Vessels") {
                return "Other";
            }
            else if (d.classification == "Artists' Tools") {
                return "Other";
            }
            else if (d.classification == "Multiples") {
                return "Other";
            }
            else if (d.classification == "Books") {
                return "Other";
            }
            else if (d.classification == "Textile Arts") {
                return "Other";
            }
            else if (d.classification == "Medals and Medallions") {
                return "Other";
            }
            else if (d.classification == "Furnitures") {
                return "Other";
            }
            else {
                return d.classification;
            };
	};

	// TO-DO: Initialize brush component
	// Initialize brush component
	var brush = d3.svg.brush()
		.x(vis.x)
		.on("brush", brushed);

	vis.brush = brush;

	// TO-DO: Append brush component here
	vis.svg.append("g")
		.attr("class", "brush")
		.call(brush)
		.selectAll("rect")
		.attr("y", -6)
		.attr("transform", "translate(0, 0)")
		.attr("height", vis.height);

	vis.wrangleData();
};

Timeline.prototype.wrangleData = function() {
	var vis = this;

	var buttons = document.getElementsByName("timeBtn");
	var selection;
	for (var i = 0, length = buttons.length; i < length; i++) {
    	if (buttons[i].checked) {
        	selection = buttons[i].value;
        	break;
    	}
	}

	console.log(selection);

	vis.displayData = vis.data;

	vis.displayData.sort(function(a,b) {
		return (a.dateend - b.dateend);
	});

	if (selection == "Paintings") {
        vis.svg.select("line").remove();
		vis.displayData = vis.displayData.filter(function(d) {
			return d.classification == "Paintings";
		});    
    }
    else if (selection == "Prints") {
        vis.svg.select("line").remove();
		vis.displayData = vis.displayData.filter(function(d) {
			return d.classification == "Prints";
		}); 
    }
    else if (selection == "Drawings") {
        vis.svg.select("line").remove();
		vis.displayData = vis.displayData.filter(function(d) {
			return d.classification == "Drawings";
		}); 
    }
    else if (selection == "Photographs") {
        vis.svg.select("line").remove();
		vis.displayData = vis.displayData.filter(function(d) {
			return d.classification == "Photographs";
		}); 
    }
    else if (selection == "Sculpture") {
        vis.svg.select("line").remove();
		vis.displayData = vis.displayData.filter(function(d) {
			return d.classification == "Sculpture";
		}); 
    }
	else if (selection == "Other") {
        vis.svg.select("line").remove();
        vis.displayData = vis.displayData.filter(function(d) {
            return (d.classification == "Vessels" || 
                d.classification == "Artists' Tools" || 
                d.classification == "Multiples" || 
                d.classification == "Books" || 
                d.classification == "Textile Arts" ||
                d.classification == "Medals and Medallions" ||
                d.classification == "Furnitures");
        }); 
    }
    else {
		vis.displayData = vis.data;
    }

	vis.x.domain(d3.extent(vis.displayData, function (d) {
		return d.dateend;
	}));

    vis.updateVis();

};

Timeline.prototype.updateVis = function() {
	var vis = this;

	console.log(vis.displayData.length);

	// Call axis functions with the new domain
	vis.svg.select(".x-axis").call(vis.xAxis);
	vis.svg.select(".y-axis").call(vis.yAxis);

	var tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	var cValue = function(d) { return d.classification;};

	function color(c) {
        if (c == "Paintings") {
            return "#91219E";
        }
        else if (c == "Prints") {
            return "#6EB5C0";
        }
        else if (c == "Drawings") {
            return "#89DA59";
        }
        else if (c == "Photographs") {
            return "F18D9E";
        }
        else if (c == "Sculpture") {
            return "F0810F";
        }
        else {
            return "#CF3721";
        }
	}

	var formatTime = d3.time.format("%Y");

	vis.timeArray = [0,1];

	// vis.svg.selectAll('.brush').remove();	

	vis.dot = vis.svg.selectAll('.dot').data(vis.displayData);

	vis.dot.enter().append("circle").attr("class", "dot");

	vis.dot.exit().remove();

	vis.dot.style("opacity", 0.5)
		.attr("r", 4)
		.attr("cx", function(d) {
			return 15 + vis.x(d.dateend);
		})
		.attr("cy", function(d) {

            if (d.classification == "Paintings") {
                return vis.y(12);
            }
            else if (d.classification == "Prints") {
                return vis.y(22);
            }
            else if (d.classification == "Drawings") {
                return vis.y(31);
            }
            else if (d.classification == "Photographs") {
                return vis.y(40);
            }
            else if (d.classification == "Sculpture") {
                return vis.y(50);
            }
            else if (d.classification == "Vessels") {
                return vis.y(60);
            }
            else if (d.classification == "Artists' Tools") {
                return vis.y(60);
            }
            else if (d.classification == "Multiples") {
                return vis.y(60);
            }
            else if (d.classification == "Books") {
                return vis.y(60);
            }
            else if (d.classification == "Textile Arts") {
                return vis.y(60);
            }
            else if (d.classification == "Medals and Medallions") {
                return vis.y(60);
            }
            else if (d.classification == "Furnitures") {
                return vis.y(60);
            }
            else {
                return vis.y(130);
            }
		})
		.style("fill", function(d) {
			return color(vis.cValue(d));
		})
		.on("mouseover", function(d) {
			tooltip.transition()
				.duration(200)
				.style("opacity", .9)
				.style("background", "white")
				.style("border-radius", "2px");
			tooltip.html(formatTime(d.dateend))
				.style("left", (d3.event.pageX + 5) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(d) {
			tooltip.transition()
				.duration(500)
				.style("opacity", 0);
		})
		.on("click", onclick)


	// information on click 
	var infoTable = d3.select("#timecard");
		infoTable.append("h2").attr("id", "title");
		infoTable.append("div")
			.data(vis.displayData)
			.attr("id", "stats")
			.attr("class", "table");

	// onclick update info on table
	function onclick(d){

		console.log(d);

	    vis.focus.append("line")
	        .attr("class", "x")
	        .style("stroke", "black")
			.on("click", function(d) {
				vis.svg.select("line").remove();

				vis.focus.append("line")
					.attr("class", "line")
					.style("stroke", "black")
					.attr("y1", 0)
					.attr("y2", function () {
						if (d.classification == "Paintings") {
							return 10;
						}
						else if (d.classification == "Prints") {
							return 20;
						}
						else if (d.classification == "Drawings") {
							return 30;
						}
						else if (d.classification == "Photographs") {
							return 40;
						}
						else if (d.classification == "Sculpture") {
							return 50;
						}
						else if (d.classification == "Vessels") {
							return 60;
						}
						else if (d.classification == "Artists' Tools") {
							return 70;
						}
						else if (d.classification == "Multiples") {
							return 80;
						}
						else if (d.classification == "Books") {
							return 90;
						}
						else if (d.classification == "Textile Arts") {
							return 100;
						}
						else if (d.classification == "Medals and Medallions") {
							return 110;
						}
						else if (d.classification == "Furnitures") {
							return 120;
						}
						else {
							return 130;
						}
					})
					.attr("x1", vis.x(d.dateend))
					.attr("x2", vis.x(d.dateend));
		});

			vis.focus.style("display", null);

	}
};
