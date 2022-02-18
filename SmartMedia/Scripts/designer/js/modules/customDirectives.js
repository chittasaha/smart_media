app.directive('mdraggable', function ($document) {
    return function (scope, element, attrs) {
        //var startX = 0, startY = 0, x = scope.item.left, y = scope.item.top;
        var item = scope.item;        
		element.draggable({
		    
		    containment: attrs.mdraggable,
		    //scroll: true,
		    stop: function (event, ui) {
				item.top = ui.position.top;
				item.left = ui.position.left;
			}
		});
		var aspectRatio = item.type == 'image';
		element.resizable({
			aspectRatio: aspectRatio, 
			resize: function(event, ui){
				item.width = ui.size.width;
				item.height = ui.size.height;
			}
		});        
    }
});
app.directive('datepicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            $(function () {
                element.datepicker({
                    dateFormat: 'dd/mm/yy',
                    onSelect: function (date) {
                        scope.$apply(function () {
                            ngModelCtrl.$setViewValue(date);
                        });
                    }
                });
            });
        }
    }
});
app.directive('timeSpan', ['$timeout',function($timeout){
	return {
		restrict : 'E',
		replace : true,
		require: '^?ngModel',
		transclude : true,
		scope : {
			duration : '=ngModel'
		},
		template : '<span class="time-spin"><input type="number" class="form-control" ng-model="duration.hour" min="0" placeholder="hh"/>'+
				   	'<input type="number" class="form-control" ng-model="duration.min" max="60" min="0" placeholder="mm" />'+
				   	'<input type="number" class="form-control" ng-model="duration.sec" max="60" min="0" placeholder="ss"/>' +
				   '</span>',
		link : function(scope, element, attrs, ngModel ){
			$(function () {
				var hourSpin = angular.element(element.children()[0]);
				var minSpin = angular.element(element.children()[1]);
				var secSpin = angular.element(element.children()[2]);
				minSpin.on('change', function(event, ui){							
					tSpanData = ngModel.$viewValue;
					if (tSpanData.min >= 60) {
						//scope.$apply(function(){
						$timeout(function(){
							tSpanData.hour +=1;
							tSpanData.min -= 60;							
							ngModel.$setViewValue(tSpanData);
						},0);
						return false;						
					}
				});
				secSpin.on('change', function(event, ui){							
					tSpanData = ngModel.$viewValue;
					if (tSpanData.sec >= 60) {
						//scope.$apply(function(){
						$timeout(function(){
							tSpanData.min +=1;
							tSpanData.sec -= 60;
							ngModel.$setViewValue(tSpanData);
						},0);
						return false;						
					}
				});
			});	
		}
		
	};
}]);
app.directive('jqAccordion', function ($timeout) {
    return {
        scope: {
            show: '@'
        },
        replace: false,
        transclude: true,    // transclusion allows for the dialog 
        // contents to use angular {{}}
        template: '<div ng-transclude></div>',      // the transcluded content 
        //is placed in the div
        link: function (scope, element, attrs) {
            $timeout(function () {
                $(element).accordion();
            }, 0);
        }
    }
});

app.directive('prsClick', ['$document', '$parse',function ($document, $parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var invoker = $parse(attrs.prsClick);
            $document.on('click', function (event) {
                if (event.target.localName == 'html') {
                    scope.$apply(
                        function () {

                            // Invoke the handler on the scope,
                            // mapping the jQuery event to the
                            // $event object.
                            invoker(scope);

                        });
                }
            });
        }
    }
}]);
app.directive('expander', function(){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: { 
			title : '@'            
		    //indicator : '▼'
		},
		
		template: '<div>' +
		'<div class="title" ng-click="toggle()">{{title}}▼</div>' +
		'<div class="body" ng-show="show" ng-transclude></div>' +
		'</div>',
		link: function(scope, element, attrs) {
		    scope.show = false;		    
		    var elmTitle = element.children()[0];
		    scope.toggle = function toggle() {
		        scope.show = !scope.show;
		        if (scope.show) {
		            elmTitle.innerHTML = scope.title + "▲";
		        }
		        else {
		            elmTitle.innerHTML = scope.title + "▼";
		        }
		    };		    
		}
	}
});