
// old century query string as of 11.14.16
var century = '&q=century:20th%20century,21st%20century,19th%20century,18th%20century';

// Main JS file
var allData = [];
var myGallery = [];

var map;
var timeline;
var timeline_brushed;
var gallery;
var red;
var orange;
var yellow;
var green;
var blue;

loadData();
createGallery();

function loadData() {
    var proxy = 'http://api.harvardartmuseums.org/object?apikey=9257ca00-a202-11e6-9c4e-5b7c6cef1537';

    var url = '&hasimage=1&color=any&title=*&person=any&medium=any&size=100';

    var century = '&yearmade=1800-2100&century=any';

    var list = [];

    d3.json("data/artGeo.json", function(collection) {
        console.log(collection);
    });


    function createPages() {
        for (var i = 0; i <= 59; i++) {
          list[i] = $.getJSON(proxy + url + '&page=' + (i + 1) + century);
        }

        return list;
    }

    createPages();

    for (var i = 0; i <= 59; i++) {
        $.when(list[i]).done(function(p) {
            allData = allData.concat(p.records);
            if (allData.length > 5999) {
                createVis();
            }
        });
    }

}

function updateTimeline() {
    timeline.wrangleData();
    timeline_brushed.wrangleData();
}

function check(id) {
    if (myGallery.length > 0) {
        var decide = myGallery.filter(function(d) {
            return d.id == id;
        });

        if (decide.length == 0) {
            addToGallery(id);
        }
        else {
            console.log("no go");
        }
    }
    else {
        addToGallery(id);
    }
}

function addToGallery(id) {
    var galleryPiece = allData.filter(function(d) {
        return d.id == id;
    });

    myGallery = myGallery.concat(galleryPiece);
    console.log(myGallery);

    function truncate(string){
        if (string.length > 10)
            return string.substring(0,10)+'...';
        else
            return string;
    }

    var gallery = $("#mygallery");
    gallery.append("<li><a onclick='onClick(" + galleryPiece[0].id + ")'><i class='fa fa-fw fa-tag'></i><span class='badge'>"
    + galleryPiece[0].classification + "</span>" + truncate(galleryPiece[0].title) + "</a></li>");

    var count = $("#count");
    var value = myGallery.length;
    count.html(value);

    createGallery();
}

function onClick(id) {
    function findPiece(e) {
        var something = allData.filter(function(d) {
            return d.id == e;
        });

        return something;
    }

    var object = findPiece(id);

    if (object.length > 0){

        var objectContent = "<table style='width: auto;'><tr><th>Artist: </th><td class='alnleft'>" + object[0].people[0].displayname
            + "</td></tr><tr><th>Year: </th><td class='alnleft'>" + object[0].datebegin
            + "</td></tr><tr><th>Medium: </th><td class='alnleft'>" + object[0].classification
            + "</td></tr><tr><th>Category: </th><td class='alnleft'>" + object[0].division
            + "</td></tr></tr></table>";

        if (object[0].images.length > 0){
            swal({
                    title: object[0].title,
                    text:  objectContent,
                    // "Artist: " object[0].people[0].displayname ,
                    imageUrl: object[0].images[0].baseimageurl,
                    html: true,
                })
        }

        else{
            swal({
                    title: object[0].title,
                    text: objectContent,
                    imageUrl: "img/noimage.jpg",
                    html: true,
                    closeOnConfirm: true
                })
        }
    } else {
        console.log("here");
        swal({
            title: "Sorry! No info to display.",
            imageUrl: "img/noimage.jpg"
        });
    }
}

function createVis() {

    function convertHex(hex) {
          // console.log(hex); 
          hex = hex.replace('#','');
          r = parseInt(hex.substring(0,2), 16);
          g = parseInt(hex.substring(2,4), 16);
          b = parseInt(hex.substring(4,6), 16);

          result = [r, g, b];
          return result;
    }

    function rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
          h = s = 0; // achromatic
        } else {
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }

          h /= 6;
        }

        return [ h, s, l ];
    }

    allData.forEach(function(d) {
        d.dateend = new Date(d.dateend, 0);
        var colorObjects = d.colors;
        for (i = 0; i < colorObjects.length; i++) {
            var rgb = convertHex(d.colors[i].color);
            var hsl = rgbToHsl(rgb[0],rgb[1],rgb[2]);
            d.colors[i].color = [d.colors[i].color,hsl];
        }
    });

    //TO DO: instantiate visualization
    timeline = new Timeline("timeline", allData);
    timeline_brushed = new Brushed("timeline_brushed", allData);
    red = new ColorVis("Red", allData);
    orange = new ColorVis("Orange", allData);
    yellow = new ColorVis("Yellow", allData);
    green = new ColorVis("Green", allData);
    blue = new ColorVis("Blue", allData);
    map = new Map("map", allData); // put map last since it has the most console.log issues

    updateTimeline();

}

function createGallery() {
    if (myGallery.length > 0) {
        var items = [];

        myGallery.forEach(function(d) {
            if (d.images.length > 0) {
                items.push({
                    src: d.images[0].baseimageurl,
                    title: d.title
                });
            }
            else {
                items.push({
                    src: "img/noimage.jpg",
                    title: d.title
                })
            }
        });

        $(".testPopup").magnificPopup({
            items: items,
            gallery:{
                enabled:true,
                tPrev: $(this).data('prev-text'),
                tNext: $(this).data('next-text')
            },
            type: 'image'
        });
    }
    else {
        $(".testPopup").magnificPopup({ items: {
            src: '<div class="white-popup">You have nothing in your gallery at the moment!</div>',
            type: 'inline',
            midClick: true
        }
        });
    }
}

function brushed() {
    // TO-DO: React to 'brushed' event
    // Set new domain if brush (user selection) is not empty
    timeline_brushed.x.domain(
        timeline.brush.empty() ? timeline.x.domain() : timeline.brush.extent()
    );

    timeline_brushed.wrangleData();
}







