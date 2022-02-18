angular.module("smart.media", [])
.directive('htmlRender', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = "scope." + attrs.htmlRender;
            element[0].innerHTML = eval(model);
        }
    }
})
.directive('jqDialog', ['$timeout', '$parse', function ($timeout, $parse) {
    return {
        scope: {
            //open: '@',
            //title: '@',
            //width: '@',
            //height: '@',
            //show: '@',
            //hide: '@',
            //autoOpen: '@',
            //position: '@',
            template: '&url'
        },
        replace: false,
        transclude: true,    // transclusion allows for the dialog contents to use angular {{}}
        template: '<div ng-transclude text="template"></div>',      // the transcluded content is placed in the div
        //templateUrl: scope.template,
        link: function (scope, element, attrs) {

            // Close button is hidden by default
            var hideCloseButton = attrs.hideCloseButton || true;


            var okButtonHandler = attrs.ok || false;
            var cancelButtonHandler = attrs.cancel || false;
            var closable = attrs.closable || false;
            var minimizable = attrs.minimizable || false;
            var buttonConfig = [];
            if (okButtonHandler) {
                buttonConfig.push({
                    text: "Ok",
                    "class": "media_button",
                    click: function () {
                        $(this).dialog("close");
                        scope.$apply(
                            function () {
                                $parse(okButtonHandler)(scope.$parent);
                            });
                    }
                });                
            }

            if (cancelButtonHandler) {
                var invoker = $parse(cancelButtonHandler);
                buttonConfig.push({
                    text: "Cancel",
                    "class": "media_button",
                    click: function () {
                        $(this).dialog("close");
                        scope.$apply(
                            function () {
                                $parse(cancelButtonHandler)(scope.$parent);
                            });
                    }
                });
                
            }
            
            // Specify the options for the dialog
            var dialogOptions = {
                autoOpen: attrs.autoOpen == 'true' ? true : false,
                title: attrs.title,
                width: attrs.width || 350,
                autoHeight: attrs.height || false,
                height: attrs.height,
                modal: attrs.modal || false,
                //hide: attrs.hide || '',
                draggable: attrs.draggable || true,
                resizable: false,
                closeOnEscape: false,
                show: { effect: "fadein", duration: 500 },
                position: attrs.position || "center",
                close: function () {
                    console.log('closing...');
                },
                open: function (event, ui) {
                    // Hide close button 
                    if (hideCloseButton == true) {
                        $(".ui-dialog-titlebar-close", ui.dialog).hide();
                    }
                },
                buttons: buttonConfig
            };


            // Initialize the element as a dialog
            // For some reason this timeout is required, otherwise it doesn't work
            // for more than one dialog
            $timeout(function designerModule() {
                var dlg = $(element).dialog(dialogOptions);
                var $titlebar = $(dlg[0].parentNode).find(".ui-dialog-titlebar");
                
                if (closable) {
                    $("<a class='dialog_title_link'/>").text("x")
                    .appendTo($titlebar)
                    .on('click', function () {
                        $(element).dialog('close');
                    });
                }
                if (minimizable) {
                    $("<a class='dialog_title_link'/>").text("-")
                        .appendTo($titlebar)
                        .on('click', function () {
                            if (this.text == '-') {
                                $(this).text("+");
                            }
                            else {
                                $(this).text("-");
                            }
                            element.parent().find('.ui-widget-content').toggle(150);
                        });
                }         
                
            }, 0);
        }
    }
}]);
