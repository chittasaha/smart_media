//utilities
var Utility = {
	getTotalMS : function(duration){
		return 1000 * (3600 * duration.hour  + 60 * duration.min + duration.sec);
	}
};

angular.module("mediaPlayer", ['ngSanitize'])
.config(function ($sceProvider) {
    // Completely disable SCE.  For demonstration purposes only!
    // Do not use in new projects.
    $sceProvider.enabled(false);
})
.factory('prService', ['$http', function($http){
	return {
		fetchRss : function(feed, callback){
		    $http.get('../../Service/GetFeedContent?url=' + feed.src).
				success(function (data) {
				    data = JSON.parse(data);
				    data = JSON.parse(data);
					var items = data.rss.channel.item;			
					for(var i=0; i<items.length; i++){
						var feedItem = new FeedItem();
						feedItem.title = items[i].title;
					    //feedItem.description = decodeURI(items[i].description);
						feedItem.description = items[i].description;
						var linkPos = feedItem.description.indexOf('<');
						if(linkPos >=0){
							feedItem.description = feedItem.description.substr(0, linkPos);
						}
						if(items[i].enclosure){
							//if(items[i].enclosure[0].$.type.indexOf('image') >=0){
							//	feedItem.image = items[i].enclosure[0].url;
						    //}
						    feedItem.image = items[i].enclosure.url;
						}
						else if(items[i].thumbnail){
                            
						    feedItem.image = items[i].thumbnail[1].url;
						}
						else if (items[i].thumbnail) {
						    feedItem.image = items[i].thumbnail[1].url;
						}

						if (!feed.items) {
						    feed.items = [];
						}
						feed.items.push(feedItem);
					}
					callback(true);
				}).
				error(function(error){
					callback(false);
				});
		}
	};
}])
.factory('utilityService', [function(){
	return {
		getTextWidth : function(text, fontSize, fontName){
			var width =0;
			var span = document.createElement('span');
			span.style.fontSize = fontSize + "pt";
			span.style.fontName = fontName;
			span.style.width = "100%";
			span.style.height = "100%"
			span.style.whiteSpace = "nowrap";
			span.style.position = "relative";
			span.style.top = "-2000px";
			span.innerText = text;
			document.body.appendChild(span);
			width = span.offsetWidth;
			document.body.removeChild(span);
			
			return width;		 
		} 
	
	};
}])
.controller("PlayerController", ['$scope', '$timeout', '$document', 'prService', 'utilityService', function ($scope, $timeout, $document, prService, utilityService) {
    var currentPageIndex = 0;
    var presentation;
    var page;

    $scope.init = function () {
        presentation = angular.fromJson(localStorage.getItem('PRESENTATION'));
        currentPageIndex = presentation.currentPageIndex;
        page = presentation.pages[currentPageIndex];
        $scope.presentation = presentation;        
        $scope.setPageBackground(page);
        $scope.page = page;
        $scope.playPresentation();		
    };

    $scope.playPresentation = function () {
        
        var duration = Utility.getTotalMS($scope.page.duration);
        var nextPageIndex = currentPageIndex + 1;
        if (nextPageIndex == $scope.presentation.pages.length) {
            nextPageIndex = 0;
        }
        window.setTimeout(function () {
            $scope.$apply(function () {
                currentPageIndex = nextPageIndex;
                page = $scope.presentation.pages[currentPageIndex];
                $scope.setPageBackground(page);
                $scope.page = page;
                $scope.playPresentation();
            });
        },duration);
    };

    $scope.setPageBackground = function (page) {

        $timeout(function () {
            var container = document.getElementById('playerContainer');

            if (page.bgType == 'color') {
                container.style.backgroundColor = page.bgColor;
                container.style.backgroundImage = '';
            }
            else {
                container.style.backgroundImage = "url(" + page.bgImageSrc + ")";
                container.style.backgroundSize = 'cover';

            }
        }, 0);
        
    };
    

    $scope.loadPartial = function (item) {
        var view = '';
        switch (item.type) {
            case 'image':
                view = "partials/image.html";
                break;
            case 'video':
                view = 'partials/player/video.html';
                break;
            case 'ticker':
                view = 'partials/player/ticker_tape.html';
                break;
            case 'text':
                view = 'partials/player/text.html';
                break;
			case 'rss':
                view = 'partials/player/rss.html';
                break;	
        }

        return view;
    };
   
    
    $scope.getYoutubeVideoId = function(item){
    	var tokenPosition = item.src.indexOf('v=') + 2;
    	var videoId = item.src.substr(tokenPosition);	
    	
    	return videoId;
    };
    
    $scope.itemLoaded = function(){   	
   	
    	switch(this.item.type){
			case 'video':
				var item = this.item;
				$timeout(function(){
					//videojs('vd_' + item.uid, { "techOrder": [item.provider], "src": item.src });					    	
					
					
					if(item.provider == 'youtube'){
						
						
						var iframe = document.createElement('iframe');
						iframe.width = item.width;
						iframe.height = item.height;
						iframe.src = item.altSrc;
						iframe.frameBorder = 0;
						var container = document.getElementById('vd_you_' + item.uid);
						container.appendChild(iframe);
					
					}
				}, 10);

			break;
			case 'image':
			break;
			case 'text':
			break;
			case 'rss':
				var item = this.item;
				
				prService.fetchRss(this.item, function(isSuccess){
					
					setTimeout(function(){
						var feedElArr = $("#" + item.uid).find(".ng-scope");
						if(item.startEffect && item.startEffect!= ''){
							var animTime = Utility.getTotalMS(item.startEffectDuration)/1000 +"s" ;
							//$("#" + item.uid).css('-webkit-animation', item.startEffect + ' linear '+ animTime +  ' 1');
							$("#" + item.uid).css('-webkit-animation', item.startEffect +' linear 10s infinite');
							//$("#" + item.uid).css('display', '');	
						}
						
						var index = 0;
						var height = item.height;
						var windowIntervalId = window.setInterval(function(){
							if(feedElArr){
						
								if(index == feedElArr.length){
									index = 0;
									for(var i=0; i<feedElArr.length; i++){
										$(feedElArr[i]).css('display', "block");
									}
								}
								else if(index == feedElArr.length-1){
									$(feedElArr[0]).css('display', "block");
								}
								// $(feedElArr[index]).animate({ "top": "-=" + height + "px"}, "slow");
								// $(feedElArr[index]).hide( "slow" );
								$(feedElArr[index]).animate({height: "toggle", opacity: "toggle"}, 'slow');
								index++;
							//console.log(index);
							}
							else{
								window.clearInterval(windowIntervalId);
							}
							 
						}, item.slideInterval * 1000);
					}, 100);
				});	
			break;
			case 'ticker':
				var item = this.item;
				var textWidth = utilityService.getTextWidth(item.text, item.fontSize, item.fontName);
				$timeout(function(){
					var animCss = ".anim{animation: ticker linear ANIM_TIMEs infinite;"+   
								"-webkit-animation: ticker linear ANIM_TIMEs infinite;"+ 
								"-webkit-backface-visibility: hidden;"+
								"-moz-backface-visibility: hidden;"+
								"-ms-backface-visibility: hidden;"+
								"backface-visibility: hidden;"+
								"-webkit-perspective: 1000;"+
								"-moz-perspective: 1000;"+
								"-ms-perspective: 1000;"+
								"perspective: 1000;"+
								"display: block;}"+
								"@keyframes ticker{"+
								"0% { text-indent: 100%;}"+
								"100% { text-indent: -END_VALUE%; }"+
								"}"+
								"@-webkit-keyframes ticker{"+
								"0% { text-indent: 100%;}"+
								"100% { text-indent: -END_VALUE%; }"+
								//"0% { transform: translateX(0px);}"+
								//"100% { transform: translateX(-5004px); }"+
								"}";
					animCss = animCss.replace(new RegExp('ANIM_TIME', 'g'), item.slideTime);	
					animCss = animCss.replace(new RegExp('END_VALUE', 'g'), ((textWidth/screen.width)*100).toString());					
					var animStyle = document.createElement('style');
					animStyle.innerHTML = animCss;	
					document.head.appendChild(animStyle);
					
					//console.log(document.getElementById(item.uid).style.innerHTML);	
					$("#" + item.uid).addClass('ticker');
					$("#" + item.uid).addClass("anim");
					
					//alert(tickerElm.offsetWidth);	
				},0);
				
			break;
		}

		
    }    
}])
.directive('afterRender', function ($parse) {

	return function(scope, element, attrs){
		var invoker = $parse(attrs.afterRender);
		invoker(scope);
		/*scope.$apply(function () {
			
		});*/
	}
	
});

