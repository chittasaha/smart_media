var TimeSpan = new Class({
	initialize : function(hour, min, sec){
		this.hour = hour;
		this.min = min;
		this.sec = sec;				
	}
});
var Presentation = new Class({
	initialize : function(name, pgDuration, w, h){
        this.id = "",
	    this.name = name;
		this.pages = [];
		this.currentPageIndex = 0;		
		this.tickers = [];
		this.pageDuration = pgDuration;
		this.width = w;
		this.height = h;
	}
});
var Animatable = new Class({
	initialize : function(){
		this.startEffect = "None";
		this.startEffectDuration = new TimeSpan(0,0,0);
		this.endEffect = "None";
		this.endEffectDuration = new TimeSpan(0,0,0);
	}
});
var Page = new Class({
	Extends : Animatable,
	initialize : function(pgDuration){		
		this.parent();
		this.images = [];
		this.videos = [];
		this.texts = [];
		this.feeds = [];
		this.bgColor = "#FFFFFF";
		this.bgImageSrc = "";
		this.bgType = "color";
		this.duration = pgDuration; //in seconds
		this.audiodSrc = "";		
		
	}                  
});
var Media = new Class({
	initialize : function(type){
		this.type = type;
		this.isDesignTime = true;
		this.top = 0;
		this.calculatedTop = 0; //in %
		this.left = 0;
		this.calculatedLeft = 0; //in %
		this.width = 0;
		this.calculatedWidth = 0; //in %
		this.height =0;
		this.calculatedHeight = 0; //in %
		this.startTime = 0; //in seconds
		this.provider = "";
		this.uid = Date.now().toString();
	},
	evaluateCalculatedProperties : function(){
		this.calculatedTop = (this.top * 100)/screen.height;
		this.calculatedLeft = (this.left * 100)/screen.width;
		this.calculatedWidth = (this.width * 100)/screen.width;
		this.calculatedHeight = (this.height * 100)/screen.height;
	}
});

var Image = new Class({
	Extends : Media,
	initialize : function(){
		this.parent('image');
		this.src = "";
		this.startEffect = "None";
		this.startEffectDuration = new TimeSpan(0,0,0);
		this.endEffect = "None";
		this.endEffectDuration = new TimeSpan(0,0,0);
	}
});
var Video = new Class({
	Extends : Media,
	initialize : function(){
		this.parent('video');
		this.src = "";
		this.altSrc = "";
		this.skinUrl = "";
		this.startEffect = "None";
		this.startEffectDuration = new TimeSpan(0,0,0);
		this.endEffect = "None";
		this.endEffectDuration = new TimeSpan(0, 0, 0);
		this.volume = 100;
	}
});
var Ticker = new Class({
	Extends : Media,
	initialize : function(){
		this.parent('ticker');		
		this.text = "tMedia Ticker Tape: Add you text content!";
		this.rssUrl = "";
		this.sourceType = "text";
		this.fontName = "Arail";
		this.fontSize = 10; // in pt
		this.fontColor = '#000000';
		this.bgColor = "#cccccc";
		this.slideTime = 20; //seconds
	}
});
var Text = new Class({
	Extends : Media,
	initialize : function(){
		this.parent('text');
		this.bgColor = "#ffffff";
		this.text = 'Insert some text here';
	}
});

var VideoSearchResult = new Class({
    initialize: function () {
        this.provider = "";
        this.searchToken = "";
        this.items = [];
    }
});

var VideoInfo = new Class({
    initialize: function () {
        this.thumbnailSrc = "";
        this.thumbnailWidth = 0;
        this.thumbnailHeight = 0;
        this.url = "";
        this.skinUrl = "";
        this.width = 0;
        this.height = 0;
    }
});

var RSSFeed = new Class({
	Extends : Media,
	initialize : function(){
		this.parent('rss');
		this.src = "";
		this.slideInterval = 10; //seconds
		this.refreshInterval = 10; //seconds
		this.items = [];
		this.bgColor = "#FFFFFF";
		this.fontName = ""
		this.fontSize = 10;
		this.fontColor = '#000000';
	}
});

var FeedItem = new Class({
	initialize : function(){
		this.title = "";
		this.description = "";
		this.image ="";
	}
});

var PresentationSettings = new Class({
    initialize: function () {
        this.name = "";
        this.width = window.screen.width;
        this.height = window.screen.height;
    }
});
