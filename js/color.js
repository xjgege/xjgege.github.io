// Color Visualization

ColorVis = function(_parentElement, _data){
  this.parentElement = _parentElement;
  this.data = _data;
  this.displayData = _data;

  this.initVis();
};

ColorVis.prototype.initVis = function() {
  var vis = this;

  // TO DO
  vis.margin = { top: 0, right: 60, bottom: 60, left: 20 };

  vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
    vis.height = 350 - vis.margin.top - vis.margin.bottom;

  vis.tooltip = d3.select("#" + vis.parentElement).append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  // SVG drawing area
  vis.svg = d3.select("#" + vis.parentElement).append("svg")
    .attr("width", vis.width + vis.margin.left + vis.margin.right)
    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

  vis.wrangleColorData();
};

ColorVis.prototype.wrangleColorData = function() {
  var vis = this;

  vis.col = vis.data.filter(function(d) {
    var colorObjects = d.colors;
    for (i = 0; i < colorObjects.length; i++) {
      if (d.colors[i].hue == vis.parentElement) {
        return d;
      }
    }
  });

  vis.col.sort(function(a,b) {
    var c1 = a.colors;
    var c2 = b.colors;
    for (i = 0; i < c1.length; i++) {
      if (a.colors[i].hue == vis.parentElement) {
        for (j = 0; j < c2.length; j++) {
          if (b.colors[j].hue == vis.parentElement) {
            return (a.colors[i].color[1][2] - b.colors[j].color[1][2]);
          }
        }
      }
    }
  });

  vis.filtered = vis.col.filter(function(d) {
    if (d.classification == "Paintings" || d.classification == "Drawings") {
      return d;
    }
  });

  vis.updateVis();  
};

ColorVis.prototype.updateVis = function() {
  var vis = this;

  // $("#" + vis.parentElement + "Count").html(vis.filtered.length);
  (function() {
  d3.fisheye = {
    scale: function(scaleType) {
          return d3_fisheye_scale(scaleType(), 3, 0);
      },
    ordinal: function() {
        return d3_fisheye_scale_ordinal(d3.scale.ordinal(), 3, 0)
    },
    circular: function() {
        var radius = 200,
            distortion = 2,
            k0,
            k1,
            focus = [0, 0];

        function fisheye(d) {
            var dx = d.x - focus[0],
                dy = d.y - focus[1],
                dd = Math.sqrt(dx * dx + dy * dy);
            if (!dd || dd >= radius) return {x: d.x, y: d.y, z: 1};
            var k = k0 * (1 - Math.exp(-dd * k1)) / dd * .75 + .25;
            return {x: focus[0] + dx * k, y: focus[1] + dy * k, z: Math.min(k, 10)};
        }

        function rescale() {
            k0 = Math.exp(distortion);
            k0 = k0 / (k0 - 1) * radius;
            k1 = distortion / radius;
            return fisheye;
        }

        fisheye.radius = function(_) {
            if (!arguments.length) return radius;
            radius = +_;
            return rescale();
        };

        fisheye.distortion = function(_) {
            if (!arguments.length) return distortion;
            distortion = +_;
            return rescale();
        };

        fisheye.focus = function(_) {
            if (!arguments.length) return focus;
            focus = _;
            return fisheye;
        };

        return rescale();
    },
  };

    function d3_fisheye_scale(scale, d, a) {

      function fisheye(_) {
          var x = scale(_),
              left = x < a,
              range = d3.extent(scale.range()),
              min = range[0],
              max = range[1],
              m = left ? a - min : max - a;
          if (m == 0) m = max - min;
          return (left ? -1 : 1) * m * (d + 1) / (d + (m / Math.abs(x - a))) + a;
      }

      fisheye.distortion = function (_) {
          if (!arguments.length) return d;
          d = +_;
          return fisheye;
      };

      fisheye.focus = function (_) {
          if (!arguments.length) return a;
          a = +_;
          return fisheye;
      };

      fisheye.copy = function () {
          return d3_fisheye_scale(scale.copy(), d, a);
      };

      fisheye.nice = scale.nice;
      fisheye.ticks = scale.ticks;
      fisheye.tickFormat = scale.tickFormat;
      return d3.rebind(fisheye, scale, "domain", "range");
    };

    function d3_fisheye_scale_ordinal(scale, d, a) {

        function scale_factor(x) {
            var 
                left = x < a,
                range = scale.rangeExtent(),
                min = range[0],
                max = range[1],
                m = left ? a - min : max - a;

            if (m == 0) m = max - min;
            var factor = (left ? -1 : 1) * m * (d + 1) / (d + (m / Math.abs(x - a)));
            return factor + a;
        };

        function fisheye(_) {
            return scale_factor(scale(_));
        };

        fisheye.distortion = function (_) {
            if (!arguments.length) return d;
            d = +_;
            return fisheye;
        };

        fisheye.focus = function (_) {
            if (!arguments.length) return a;
            a = +_;
            return fisheye;
        };

        fisheye.copy = function () {
            return d3_fisheye_scale_ordinal(scale.copy(), d, a);
        };

        fisheye.rangeBand = function (_) {
            var band = scale.rangeBand(),
                x = scale(_),
                x1 = scale_factor(x),
                x2 = scale_factor(x + band);

            return Math.abs(x2 - x1);
        };

       
        fisheye.rangeRoundBands = function (x, padding, outerPadding) {
            var roundBands = arguments.length === 3 ? scale.rangeRoundBands(x, padding, outerPadding) : arguments.length === 2 ? scale.rangeRoundBands(x, padding) : scale.rangeRoundBands(x);
            fisheye.padding = padding * scale.rangeBand();
            fisheye.outerPadding = outerPadding;
            return fisheye;
        };

        return d3.rebind(fisheye, scale, "domain",  "rangeExtent", "range");
    };
        
})();

  var xScale = d3.fisheye.scale(d3.scale.linear).domain([0, 520]).range([0, vis.width]).focus(vis.width/2);

  var bar = vis.svg.selectAll("rect").data(vis.filtered);

  bar.enter().append("rect").attr("class", "bar");

  bar.exit().remove();

    bar.attr("x", function(d, index) {
          return index * vis.width / vis.filtered.length;
        })
        .attr("y", "40")
        .attr("width", function() {
          return vis.width / vis.filtered.length;
        })
        .attr("height", "350")
        .attr("stroke", "white")
        .attr("stroke-width", ".2")
        .attr("fill", function(d) {
          var colorObject = d.colors;
          for (i = 0; i < colorObject.length; i++) {
            if (d.colors[i].hue == vis.parentElement) {
              return d.colors[i].color[0];
            }
          }
        })
        .call(position);

  function position(bar) {
      bar.attr("x", function(d, index) {
          return xScale(index);
      });
      bar.attr("width", function(d, index) {
          return xScale(index+2) - xScale(index);
      })
  }

  vis.svg.on("mousemove", function() {
      var mouse = d3.mouse(this);
      xScale.distortion(7).focus(mouse[0]);

      bar.call(position);
  });

  bar.on("mouseover", function(d) {
    vis.tooltip.transition()
      .duration(200)
      .style("opacity", .9)
      .style("background", "white");
    vis.tooltip.html(d.title + "<br/>")
      .style("left", (d3.event.pageX + 5) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
  })
  .on("mouseout", function(d) {
    vis.tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  })
  .on("click", function(d) {
            // the height is cy
            console.log(d.datebegin);

            var imagesObject = d.images;
            if(imagesObject.length > 0) {
              $("#" + vis.parentElement + "Image").html("<img class='colorImage' src=" + imagesObject[0].baseimageurl + ">");
            }

            else{
              $("#" + vis.parentElement + "Image").html("<img class='colorImage' src=" + "/img/noimage.jpg" + ">");
            }
            $("#" + vis.parentElement + "Count").html(d.title);

            var infoTable = d3.select("#" + vis.parentElement + "Info");
            infoTable.append("div")
            .attr("id", "art" + vis.parentElement + "Info")
            .attr("class", "table");

              document.getElementById("art" + vis.parentElement + "Info").innerHTML
              = "<table><tr><th>Artist: </th><td class='alnleft'>" + d.people[0].displayname
              + "</td></tr><tr><th>Year: </th><td class='alnleft'>" + d.datebegin
              + "</td></tr><tr><th>Medium: </th><td class='alnleft'>" + d.classification
              + "</td></tr><tr><th>Category: </th><td class='alnleft'>" + d.division
              + "</td></tr></tr></table>" + "<a class = 'btn btn-info' id='added' type='button'> Add to Gallery </a>";

              $(document).on("click", "#added", function() {
                console.log(d.id);
                $(this).addClass('selected');
                $(this).text("Added!");
                check(d.id);
              });


          // // sweet alert for color (old)
          //   if (d != null){
          //       console.log(d.division);

          //     if (d.images.length > 0){
          //       swal({
          //           title: d.title,
          //                           text:  objectContent,
          //                           // "Artist: " object[0].people[0].displayname ,
          //                           imageUrl: d.images[0].baseimageurl,
          //                           html: true,
          //                           showCancelButton: true,
          //                           confirmButtonColor: "#8CD4F5",
          //                           confirmButtonText: "Add to Gallery",
          //                           cancelButtonText: "Cancel",
          //                           closeOnConfirm: false
          //                       },
          //                           function(){
          //                               addToGallery(d.id);
          //                               swal("Added to Gallery!", "This piece has been added to your gallery.", "success");
          //                           });
          //                   }

          //                   else{
          //                       swal({
          //                           title: d.title,
          //                           text: objectContent,
          //                           imageUrl: "img/noimage.jpg",
          //                           html: true,
          //                           showCancelButton: true,
          //                           confirmButtonColor: "#8CD4F5",
          //                           confirmButtonText: "Add to Gallery",
          //                           cancelButtonText: "Cancel",
          //                           closeOnConfirm: false
          //                       },
          //                           function(){
          //                               addToGallery(d.id);
          //                               swal("Added to Gallery!", "This piece has been added to your gallery.", "success");
          //                           });
          //                   }
          //               }

          //               if(d.length == 0){
          //                   swal({
          //                       title: "Sorry! No info to display.",
          //                       imageUrl: "img/noimage.jpg"
          //                   });
          //               }


  });


};