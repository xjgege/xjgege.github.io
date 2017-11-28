/**
 * Created by mariamclaughlin on 12/5/16.
 */
// Top Timeline Visualization that results from the brushing of the bottom timeline visualization
Brushed = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;

    this.initVis();
};

Brushed.prototype.initVis = function() {
    var vis = this;

    vis.margin = { top: 2, right: 0, bottom: 60, left: 60 };

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
        vis.height = 450 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.x = d3.time.scale()
        .range([0, vis.width])
        .domain(d3.extent(vis.data, function(d) { return d.dateend; }));

    vis.xAxis = d3.svg.axis()
        .scale(vis.x)
        .orient("top");

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(15, 35)");

    vis.svg.select(".x-axis").call(vis.xAxis);

    vis.g = vis.svg.append('g')
         .attr('transform', 'translate(15, 32)');

    vis.circles = vis.g.append('g')
        .attr("transform", "translate(0, 5)");

    vis.dots = vis.circles.selectAll(".dot").data(vis.data);

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

    vis.wrangleData();
};

Brushed.prototype.wrangleData = function() {
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

    vis.updateVis();

    // vis.displayData = vis.data;
    // // TO DO
    // var selectBox = document.getElementById("selectBoxMedium");
    // var selection = selectBox.options[selectBox.selectedIndex].value;

    // console.log(selection);

    // vis.displayData = vis.data;

    // if (selection == "all") {
    //     vis.displayData = vis.data;
    // }
    // else if (selection == "Paintings") {
    //     vis.svg.select("line").remove();
    //     vis.displayData = vis.displayData.filter(function(d) {
    //         return d.classification == "Paintings";
    //     });    
    // }
    // else if (selection == "Prints") {
    //     vis.svg.select("line").remove();
    //     vis.displayData = vis.displayData.filter(function(d) {
    //         return d.classification == "Prints";
    //     }); 
    // }
    // else if (selection == "Drawings") {
    //     vis.svg.select("line").remove();
    //     vis.displayData = vis.displayData.filter(function(d) {
    //         return d.classification == "Drawings";
    //     }); 
    // }
    // else if (selection == "Photographs") {
    //     vis.svg.select("line").remove();
    //     vis.displayData = vis.displayData.filter(function(d) {
    //         return d.classification == "Photographs";
    //     }); 
    // }
    // else if (selection == "Sculpture") {
    //     vis.svg.select("line").remove();
    //     vis.displayData = vis.displayData.filter(function(d) {
    //         return d.classification == "Sculpture";
    //     }); 
    // }
    // else {
    //     vis.svg.select("line").remove();
    //     vis.displayData = vis.displayData.filter(function(d) {
    //         return (d.classification == "Vessels" || 
    //             d.classification == "Artists' Tools" || 
    //             d.classification == "Multiples" || 
    //             d.classification == "Books" || 
    //             d.classification == "Textile Arts" ||
    //             d.classification == "Medals and Medallions" ||
    //             d.classification == "Furnitures");
    //     }); 
    // }

    // vis.updateVis();
};

Brushed.prototype.updateVis = function() {
    var vis = this;

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var formatTime = d3.time.format("%Y");

    vis.timeArray = [0,1];

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

    vis.dot = vis.circles.selectAll('.dot').data(vis.displayData);

    vis.dot.enter().append("circle").attr("class", "dot");

    vis.dot.exit().remove();

    vis.dot.style("opacity", 0.7)
        .attr("r", 2)
        .attr("cx", function(d) {
            return vis.x(d.dateend);
        })
        .attr("cy", function(d) {

            if (vis.timeArray[0] == 0) {
                vis.timeArray[0] = d.dateend;
                return (2 * vis.timeArray[1]);
            }
            else if (vis.timeArray[0] >= d.dateend) {
                vis.timeArray[1] = vis.timeArray[1] + 1;
                return (2 * vis.timeArray[1]);
            }
            else {
                vis.timeArray[0] = d.dateend;
                vis.timeArray[1] = 1;
                return (2 * vis.timeArray[1]);
            }

        })
        .style("fill", function(d) {
            return color(vis.cValue(d));
        })
        .on("mouseover", function(d) {
            d3.select(this).attr("r", 5).style("opacity", 1);
            tooltip.transition()
                .duration(200)
                .style("opacity", .9)
                .style("background", "white")
                .style("border-radius", "2px");
            tooltip.html(d.title + "<br/>" + formatTime(d.dateend) + " " + d.classification)
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            d3.select(this).attr("r", 2).style("opacity", 0.7);
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function(d) {
            console.log(d.datebegin);
            if (d != null) {
                console.log(d.division);
                var objectContent = "<table><tr><th>Artist: </th><td class='alnleft'>" + d.people[0].displayname 
                    + "</td></tr><tr><th>Year: </th><td class='alnleft'>" + d.datebegin 
                    + "</td></tr><tr><th>Medium: </th><td class='alnleft'>" + d.classification
                    + "</td></tr><tr><th>Category: </th><td class='alnleft'>" + d.division
                    + "</td></tr></tr></table>";
                if (d.images.length > 0) {
                    swal({
                        title: d.title,
                        text:  objectContent,
                        // "Artist: " object[0].people[0].displayname ,
                        imageUrl: d.images[0].baseimageurl,
                        html: true,
                        showCancelButton: true,
                        confirmButtonColor: "#8CD4F5",
                        confirmButtonText: "Add to Gallery",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: false
                    },
                        function(){
                            addToGallery(d.id);
                            swal("Added to Gallery!", "This piece has been added to your gallery.", "success");
                        });
                }
                else {
                    swal({
                        title: d.title,
                        text: objectContent,
                        imageUrl: "img/noimage.jpg",
                        html: true,
                        showCancelButton: true,
                        confirmButtonColor: "#8CD4F5",
                        confirmButtonText: "Add to Gallery",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: false
                    },
                        function(){
                            addToGallery(d.id);
                            swal("Added to Gallery!", "This piece has been added to your gallery.", "success");
                        });
                }
            }
            if(d.length == 0) {
                swal({
                    title: "Sorry! No info to display.",
                    imageUrl: "img/noimage.jpg"
                });
            }

        });

    // Define the clipping region
    vis.svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", vis.width)
        .attr("height", vis.height);

    vis.circles
        .datum(vis.displayData)
        .attr("d", vis.dot)
        .attr("clip-path", "url(#clip)");

    // Call axis functions with the new domain
    vis.svg.select(".x-axis").call(vis.xAxis);
    // vis.svg.select(".y-axis").call(vis.yAxis);

};
