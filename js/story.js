// adapted from http://jsfiddle.net/c5YVX/8/

var start_val = 0,
    duration = 5000,
    end_val = [6000];

var qSVG = d3.select("#story").append("svg").attr("width", 500).attr("height", 200);

qSVG.selectAll(".txt")
    .data(end_val)
    .enter()
    .append("text")
    .text(start_val)
    .attr("class", "txt")
    .attr("x", 90)
    .attr("y", 150)
    .transition()
    .duration(3000)
        .tween("text", function(d) {
            var i = d3.interpolate(this.textContent, d),
                prec = (d + "").split("."),
                round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;

            return function(t) {
                this.textContent = Math.round(i(t) * round) / round;
            };
        });