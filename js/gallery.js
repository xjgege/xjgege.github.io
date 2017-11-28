
Gallery = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;

    this.initVis();
};

Gallery.prototype.initVis = function() {
  console.log(this.data);
};

// var init = function() {
// 	if(typeof(Storage) !== "undefined") {
// 		if (!localStorage.readCount) {
// 			// if no local storage count found, initialize localStorage
// 		    localStorage.setItem("readCount", "0");
// 		    localStorage.setItem("healthCount", "100");
// 		    localStorage.setItem("expCount", "0");
// 		    localStorage.setItem("articles", JSON.stringify(articles));
// 		    localStorage.setItem("lastRead", "0");
// 	    } else {
// 	    	// else use locally stored data
// 			articles = JSON.parse(localStorage.articles);
// 			exp = localStorage.expCount;
// 			localStorage.readCount = '0';
//
// 			// calculate hours since last read article
// 			var hours = 1000 * 60 * 60; // 3,600,000
// 			var t = Date.now();
// 			if (localStorage.lastRead != 0) {
// 				// if it has been more than 24 hours, deduct health points
// 				if (Math.floor((t - localStorage.lastRead)/hours) > 24) {
// 					health = Number(localStorage.healthCount) - 25;
// 					health > 0 ? localStorage.healthCount = health : localStorage.healthCount = 0;
// 				} else {
// 					health = Number(localStorage.healthCount);
// 				};
// 			};
// 	    };
// 	};
//
// 	$('.tooltiptext').html('Health Count: ' + localStorage.healthCount + '<br /> Exp Count: '
// 		+ localStorage.expCount + '<br />You\'ve read ' + localStorage.readCount + ' articles.');
// };

