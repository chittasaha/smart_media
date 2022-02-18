angular.module('app.directives', [])
.directive('jqDialog', function ($timeout) {
    return {
        scope: {
            open: '@',
            title: '@',
            width: '@',
            height: '@',
            show: '@',
            hide: '@',
            autoOpen: '@',
            position: '@'
        },
        replace: false,
        transclude: true,    // transclusion allows for the dialog contents to use angular {{}}
        template: '<div ng-transclude></div>',      // the transcluded content is placed in the div
        link: function (scope, element, attrs) {
            // Close button is hidden by default
            var hideCloseButton = attrs.hideCloseButton || false;

            // Specify the options for the dialog
            var dialogOptions = {
                autoOpen: attrs.autoOpen == 'true' ? true : false,
                title: attrs.title,
                width: attrs.width || 350,
                autoHeight: attrs.height || false,
                height: attrs.height,
                modal: attrs.modal || false,
                hide: attrs.hide || '',
                draggable: attrs.draggable || true,
                resizable: false,
                closeOnEscape: true,
                show: { effect: "fadein", duration: 200 },
                position: attrs.position || "center",
                close: function () {
                    console.log('closing...');
                },
                open: function (event, ui) {
                    // Hide close button 
                    if (hideCloseButton == true) {
                        $(".ui-dialog-titlebar-close", ui.dialog).hide();
                    }
                }
            };


            // Initialize the element as a dialog
            // For some reason this timeout is required, otherwise it doesn't work
            // for more than one dialog
            $timeout(function designerModule() {
                $(element).dialog(dialogOptions);
            }, 0);
        }
    }
});