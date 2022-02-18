angular.module("mediaDesigner", ['colorpicker.module', 'ui.bootstrap', 'ui.grid', 'ui.grid.selection', 'smart.media'])
.config(function($sceProvider) {
    // Completely disable SCE.  For demonstration purposes only!
    // Do not use in new projects.
    $sceProvider.enabled(false);
})
.factory('desingerService', ['$http', function ($http) {
    return {
        savePresentation: function (presentation, callback) {
            var srvUrl = "./SavePresentation";
            $http({
                method: 'POST',
                url: srvUrl,
                data: {
                    presentation: presentation
                }
            }).
                    success(function (data) {
                        callback(data);
                    }).
                    error(function (error) {

                    });
        },
        getExisitingPresentations: function (callback) {
            var srvUrl = "./GetExistingPresentations";
            $http({
                method: 'GET',
                url: srvUrl
            }).
                    success(function (data) {
                        callback(data);
                    }).
                    error(function (error) {

                    });
        },

        getPresentationById: function (id, callback) {
            var srvUrl = "./GetPresentation?id=" + id;
            $http({
                method: 'GET',
                url: srvUrl
            }).
                    success(function (data) {
                        callback(data);
                    }).
                    error(function (error) {

                    });
        },

        searchYoutubeVideo : function (searchToken, callback) {
            var dataurl = 'http://gdata.youtube.com/feeds/api/videos?q="' + searchToken + '"&orderby=rating&alt=json';
            var xmlHttpHeader = $http.defaults.headers.common['X-Requested-With'];
            delete $http.defaults.headers.common['X-Requested-With'];
            //delete $scope.videoSearchResult.items;
            //$http.jsonp(dataurl);
            $http.get(dataurl)
            .success(function (data) {
                
                $http.defaults.headers.common['X-Requested-With'] = xmlHttpHeader;
                var items = [];
                for (i = 0; i < data.feed.entry.length; i++) {
                    var vInfo = new VideoInfo();
                    vInfo.thumbnailSrc = data.feed.entry[i].media$group.media$thumbnail[1].url;
                    vInfo.thumbnailWidth = data.feed.entry[i].media$group.media$thumbnail[1].width;
                    vInfo.thumbnailHeight = data.feed.entry[i].media$group.media$thumbnail[1].height;
                    vInfo.url = data.feed.entry[i].media$group.media$player[0].url.replace('&feature=youtube_gdata_player', '');
                    vInfo.skinUrl = data.feed.entry[i].media$group.media$thumbnail[0].url;;
                    vInfo.width = data.feed.entry[i].media$group.media$thumbnail[0].width;
                    vInfo.height = data.feed.entry[i].media$group.media$thumbnail[0].height;
                    items.push(vInfo);
                }

                callback(items);
            });
        }
    }
}])
.controller("PresentationController", ['$scope', '$timeout', '$document', '$modal', '$location', '$parse', 'desingerService', function ($scope, $timeout, $document, $modal, $location, $parse, desingerService) {
    $scope.currentPageIndex = 0;
    var presentation;
    var page;
    var textEditorLoaded = false;

    $scope.showVideoBrowse = false;
    $scope.isShowCreateNewPresentation = false;

    $scope.presentationConfig = null;

    $scope.existingPresentations = [];
    $scope.selectedPresentation = [];
    
    $scope.videoSearchResult = {
        searchToken: '',
        items: [],
        provider: '',
        selectedItem : null
    };

    $scope.presentationGridOptions = {
        data: 'existingPresentations',
        columnDefs: [{ field: 'Name', name: 'Name' },
                     { field: 'CreatedDate', name: 'Created' },
                     { field: 'ModifiedDate', name: 'Modified' }
        ],
        enableRowSelection: true,
        enableSelectAll: false,
        multiSelect: false,
        enableRowHeaderSelection: false,
        modifierKeysToMultiSelect: false,
        noUnselect: true,
        onRegisterApi: function (gridApi) {
            //set gridApi on scope
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                $scope.selectedPresentationId = row.entity.ID;
                //console.log($scope.selectedPresentationId);
            });
        }        
    };



    $scope.initializePage = function () {

        $scope.$watch('page.bgColor', function () {
            var designerContainer = document.getElementById("dsgnrContainer");
            designerContainer.style.backgroundColor = $scope.page.bgColor;
            designerContainer.style.backgroundImage = "";
        });
        $scope.$watch('page.bgImageSrc', function () {
            var designerContainer = document.getElementById("dsgnrContainer");
            designerContainer.style.backgroundImage = "url(" + $scope.page.bgImageSrc + ")";
            //document.body.style.backgroundImage = "url(" + $scope.page.bgImageSrc + ")";
        });
        $scope.$watch('page.bgType', function () {
            var designerContainer = document.getElementById("dsgnrContainer");
            if ($scope.page.bgType == 'color') {
                //document.body.style.backgroundColor = $scope.page.bgColor;
                //document.body.style.backgroundImage = '';
                designerContainer.style.backgroundColor = $scope.page.bgColor;
                designerContainer.style.backgroundImage = '';
            }
            else {
                //document.body.style.backgroundImage = "url(" + $scope.page.bgImageSrc + ")";
                //document.body.style.backgroundSize = 'cover'
                designerContainer.style.backgroundImage = "url(" + $scope.page.bgImageSrc + ")";
                designerContainer.style.backgroundSize = 'cover';
            }
        });




    };

    if (localStorage.getItem('PRESENTATION') != null) {

        $scope.presentation = angular.fromJson(localStorage.getItem('PRESENTATION'));
        $scope.currentPageIndex = $scope.presentation.currentPageIndex;
        $scope.page = $scope.presentation.pages[$scope.currentPageIndex];




        $timeout(function () {
            $scope.initializePage();
            $("#dlgProperty").dialog("open");
            $("#dlgTools").dialog("open");

        }, 500);
    }

    $scope.openPresentationSettings = function () {

        $scope.presentationConfig = new PresentationSettings();

        $scope.presentationConfig.width = $scope.presentation.width;
        $scope.presentationConfig.height = $scope.presentation.height;
        $scope.presentationConfig.name = $scope.presentation.name;

        $("#dlgPresentationSettinsg").dialog("open");
    };

    $scope.savePresentationSettings = function () {
        $("#dlgPresentationSettinsg").dialog("close");

        $scope.presentation.width = $scope.presentationConfig.width;
        $scope.presentation.height = $scope.presentationConfig.height;
        $scope.presentation.name = $scope.presentationConfig.name;

        //localStorage.setItem('PRESENTATION', angular.toJson($scope.presentation));

        $scope.savePresentation();

    };

    $scope.closePresentation = function () {
        $scope.presentation = null;
        $scope.page = null;
        localStorage.removeItem('PRESENTATION');
        $("#dlgProperty").dialog("close");
        $("#dlgTools").dialog("close");
        $scope.presentationConfig = null;
    };
    //else {
    //    presentation = angular.fromJson(localStorage.getItem('PRESENTATION'));
    //    currentPageIndex = presentation.currentPageIndex;
    //}
    //$scope.presentation = presentation;
    //$scope.page = $scope.presentation.pages[currentPageIndex];


    $scope.animations = ['slideIn', 'slideOut', 'fadeIn', 'fadeOut', 'bounce', 'flash', 'pulse',
    	'shake', 'swing', 'tada', 'wobble', 'flip', 'hinge', 'rollIn', 'rollOut'];



    $scope.goNext = function () {
        if ($scope.presentation.pages.length > $scope.currentPageIndex + 1) {
            $scope.currentPageIndex++;
            $scope.page = $scope.presentation.pages[$scope.currentPageIndex];
            $scope.presentation.currentPageIndex = $scope.currentPageIndex;
        }
    };

    $scope.showCreateNewPresentation = function () {
        $scope.presentationConfig = new PresentationSettings();
        $("#dlgNewPresentation").dialog("open");
    };

    $scope.createNewPresentation = function () {

        var presentation = new Presentation($scope.presentationConfig.name, new TimeSpan(0, 0, 10), $scope.presentationConfig.width, $scope.presentationConfig.height);
        page = new Page(presentation.pageDuration);
        presentation.pages.push(page);

        //localStorage.setItem('PRESENTATION', angular.toJson(presentation));

        $scope.presentation = presentation;
        $scope.page = page;


        localStorage.setItem('PRESENTATION', angular.toJson(presentation));

        $scope.initializePage();

        $("#dlgProperty").dialog("open");
        $("#dlgTools").dialog("open");
    };

    $scope.openPresentations = function () {
        desingerService.getExisitingPresentations(function (result) {
            $scope.existingPresentations = result.Presentations;
        });

        $('#dlgOpenPresentation').dialog('open');
    };

    $scope.openPresentation = function () {
        desingerService.getPresentationById($scope.selectedPresentationId, function (result) {
            $scope.presentation = result.Presentation;
            $scope.page = result.Presentation.pages[0];


            localStorage.setItem('PRESENTATION', angular.toJson($scope.presentation));

            $scope.initializePage();

            $("#dlgProperty").dialog("open");
            $("#dlgTools").dialog("open");
        });
    };

    $scope.goPrev = function () {
        if ($scope.currentPageIndex > 0 && $scope.presentation.pages.length > 0) {
            $scope.currentPageIndex--;
            $scope.page = $scope.presentation.pages[$scope.currentPageIndex];
            $scope.presentation.currentPageIndex = $scope.currentPageIndex;
        }
    };

    $scope.preview = function () {
        //window.open('/preview.html');
        var previewFrame = document.getElementById('frmPreview');
        var fullScreenRequested = false;
        if (previewFrame.webkitRequestFullscreen) {
            previewFrame.src = "../content/views/preview.html";
            previewFrame.style.display = 'block';
            previewFrame.webkitRequestFullscreen();

            var func = function (event) {
                if (!fullScreenRequested) {
                    fullScreenRequested = true;
                }
                else {
                    previewFrame.src = "";
                    previewFrame.style.display = 'none';
                    previewFrame.removeEventListener('webkitfullscreenchange', func);
                }
            };
            previewFrame.addEventListener('webkitfullscreenchange', func);
        }
        else if (previewFrame.mozRequestFullscreen) {
            previewFrame.src = "/preview.html";
            previewFrame.style.display = 'block';
            previewFrame.mozRequestFullscreen();

        }
        else if (previewFrame.requestFullscreen) {
            previewFrame.src = "/preview.html";
            previewFrame.style.display = 'block';
            previewFrame.requestFullscreen();
        }
        else {
            window.open('/preview.html');
        }

    };
    $scope.loadWidget = function (widgetType) {
        if (widgetType == 'property') {
            return "../../content/views/partials/widgets/property_window.html";
        }
        else if (widgetType == 'tools') {
            return "../../content/views/partials/widgets/tools_window.html";
        }
        else if (widgetType == 'presentation_settings') {
            return "../../Content/views/partials/dialogs/presentation_settings.html";
        }
        else if (widgetType == 'open_presentations') {
            return "../../Content/views/partials/dialogs/open_presentation.html";
        }
        else if (widgetType == 'edit_text') {
            return "../../Content/views/partials/dialogs/edit_text.html";
        }
        else if (widgetType == 'video_browser') {
            return "../../Content/views/partials/dialogs/video_browser.html";
        }
    };
    $scope.loadPartial = function (item) {
        var view = '';
        switch (item.type) {
            case 'image':
                view = "../../content/views/partials/image.html";
                break;
            case 'video':
                view = '../../content/views/partials/video.html';
                break;
            case 'ticker':
                view = '../../content/views/partials/ticker_tape.html';
                break;
            case 'text':
                view = '../../content/views/partials/text.html';
                break;
            case 'rss':
                view = '../../content/views/partials/rss.html';
                break;
        }

        return view;
    };

    $scope.loadNavbar = function () {
        return "../../content/views/partials/nav_bar.html";
    }

    $scope.bindPropWindow = function () {
        $scope.item = this.item;
    };

    $scope.showItemProperties = function () {


        if ($scope.item != null) {
            return true;
        }

        return false;
    };

    $scope.showItemProperty = function (prop) {
        var result = false;
        if ($scope.item) {
            switch (prop) {
                case 'left':
                    if ($scope.item.type == 'image' || $scope.item.type == 'text'
					|| $scope.item.type == 'video' || $scope.item.type == 'rss') {
                        result = true;
                    }
                    break;
                case 'width':
                    if ($scope.item.type == 'image' || $scope.item.type == 'text'
					|| $scope.item.type == 'video' || $scope.item.type == 'rss') {
                        result = true;
                    }
                    break;
                case 'height':
                    if ($scope.item.type == 'image' || $scope.item.type == 'text'
					|| $scope.item.type == 'video' || $scope.item.type == 'rss') {
                        return true;
                    }
                    break;
                case 'src':
                    if ($scope.item.type == 'image' || $scope.item.type == 'video' ||
                        $scope.item.type == 'rss') {
                        return true;
                    }
                    break;
                case 'text':
                    if ($scope.item.type == 'text' || $scope.item.type == 'ticker') {
                        return true;
                    }
                    break;
                case 'bgColor':
                    if ($scope.item.type == 'ticker' || $scope.item.type == 'rss' || $scope.item.type == 'text') {
                        return true;
                    }
                    break;
                case 'fontName':
                    if ($scope.item.type == 'ticker' || $scope.item.type == 'rss') {
                        return true;
                    }
                    break;
                case 'fontColor':
                    if ($scope.item.type == 'ticker' || $scope.item.type == 'rss') {
                        return true;
                    }
                    break;
                case 'fontSize':
                    if ($scope.item.type == 'ticker' || $scope.item.type == 'rss') {
                        return true;
                    }
                    break;
                case 'slideInterval':
                    if ($scope.item.type == 'rss') {
                        return true;
                    }
                    break;
                case 'refreshInterval':
                    if ($scope.item.type == 'rss') {
                        return true;
                    }
                    break;
                case 'startEffect':
                    if ($scope.item.type == 'rss' || $scope.item.type == 'image' || $scope.item.type == 'video' || $scope.item.type == 'text') {
                        return true;
                    }
                    break;
                case 'endEffect':
                    if ($scope.item.type == 'rss' || $scope.item.type == 'image' || $scope.item.type == 'video' || $scope.item.type == 'text') {
                        return true;
                    }
                    break;
                case 'startEffectDuration':
                    if ($scope.item.type == 'rss' || $scope.item.type == 'image' || $scope.item.type == 'video' || $scope.item.type == 'text') {
                        return true;
                    }
                    break;
                case 'endEffectDuration':
                    if ($scope.item.type == 'rss' || $scope.item.type == 'image' || $scope.item.type == 'video' || $scope.item.type == 'text') {
                        return true;
                    }
                    break;
                case 'slideTime':
                    if ($scope.item.type == 'ticker') {
                        return true;
                    }
                    break;
            }
        }
        return result;
    };

    $scope.addPage = function () {
        var pg = new Page(new TimeSpan(0, 0, 10));
        $scope.presentation.pages.push(pg);
        $scope.page = pg;
        $scope.currentPageIndex = $scope.presentation.pages.length - 1;
    };

    $scope.addImage = function () {
        var img = new Image();
        img.left = 200;
        img.top = 400
        img.width = 400;
        img.height = 250;
        img.src = "../content/img/photo.png";
        if (!$scope.page.images) {
            $scope.page.images = [];
        }
        $scope.page.images.push(img);
        $scope.item = img;
        //localStorage['PRESENTATION'] = angular.toJson(presentation);
    };

    $scope.addText = function () {
        var text = new Text();
        text.left = 350;
        text.top = 200;
        text.width = 400;
        text.height = 100;
        if (!$scope.page.texts) {
            $scope.page.texts = [];
        }
        $scope.page.texts.push(text);
        $scope.item = text;
    };

    $scope.addTicker = function () {
        var tckr = new Ticker();
        tckr.top = 200;
        if (!$scope.presentation.tickers) {
            $scope.presentation.tickerss = [];
        }
        $scope.presentation.tickers.push(tckr);
        $scope.item = tckr;
        //localStorage['PRESENTATION'] = angular.toJson(presentation);
    };

    $scope.addVideo = function (provider) {
        var vd = new Video();
        vd.left = 300;
        vd.top = 250;
        vd.provider = provider;
        if (provider == 'youtube') {
            vd.skinUrl = '../content/img/youtube.png';
            vd.width = 502;
            vd.height = 200;
        }
        else {
            vd.width = 300;
            vd.height = 300;
        }
        vd.src = '';
        if (!$scope.page.videos) {
            $scope.page.videos = [];
        }
        $scope.page.videos.push(vd);
        $scope.item = vd;
    };

    $scope.addRssFeed = function () {
        var rss = new RSSFeed();
        rss.top = 250;
        rss.left = 400;
        rss.height = 250;
        rss.width = 600;
        rss.src = "";
        rss.fontName = "Arial";
        if (!$scope.page.feeds) {
            $scope.page.feeds = [];
        }
        $scope.page.feeds.push(rss);
        $scope.item = rss;
    };

    $scope.selectElement = function () {
        $(element).addClass("selected");
    };

    $scope.deselectElement = function (element) {
        $(element).removeClass("selected");
    };

    $scope.clickBody = function () {
        //event.stopPropagation();
        if (window.event && window.event.toElement.id == 'dsgnrContainer') {
            $scope.item = null;
        }

    };

    $scope.savePresentation = function () {
        $timeout(function () {
            localStorage['PRESENTATION'] = angular.toJson($scope.presentation);

            desingerService.savePresentation($scope.presentation, function (result) {
                $scope.presentation.id = result.Id;
                localStorage['PRESENTATION'] = angular.toJson($scope.presentation);
            });
        }, 0);

    };

    $scope.itemLoaded = function (partial) {

        console.log(this.item.type);
    };

    $scope.Logout = function () {
        document.getElementById('logoutForm').submit();
    };

    $scope.browseSource = function () {

        if ($scope.item.type == 'video') {
            //var videoSearchResult = new VideoSearchResult();
            //videoSearchResult.provider = $scope.item.provider;
            //$scope.videoSearchResult = videoSearchResult;
            $scope.videoSearchResult.provider = $scope.item.provider;
            $("#dlgVideoSerach").dialog('open');
        }
        //$('#wdgVidBrowse').dialog();
        //$scope.items = ['item1', 'item2', 'item3'];
        //var modalInstance = $modal.open({
        //    templateUrl: '../../content/views/partials/widgets/video_browser.html',
        //    controller: 'ModalInstanceCtrl',
        //    resolve: {
        //        videoSearchResult: function () {
        //            return $scope.videoSearchResult;
        //        }
        //    }
        //});

        //modalInstance.result.then(function (selectedItem) {
        //    $scope.item.width = selectedItem.width;
        //    $scope.item.height = selectedItem.height
        //    $scope.item.src = selectedItem.url;
        //    $scope.item.skinUrl = selectedItem.skinUrl;
        //    if ($scope.item.provider == 'youtube') {
        //        var tokenPosition = $scope.item.src.indexOf('v=') + 2;
        //        var videoId = $scope.item.src.substr(tokenPosition);
        //        $scope.item.altSrc = "http://www.youtube.com/embed/" + videoId + "?autoplay=1&html5=1";
        //    }

        //}, function () {
        //    //$log.info('Modal dismissed at: ' + new Date());
        //});
    };

    $scope.setRichText = function () {

        if (!textEditorLoaded) {
            $('#txtEditor').jqte();
            textEditorLoaded = true;
        }
        
        //document.getElementById('txtEditor').value = $scope.item.text;
        $('#txtEditor').jqteVal($scope.item.text);
        $('#dlgTxtEditor').dialog('open');

    };

    $scope.updateRichText = function () {
        $scope.item.text = document.getElementById('txtEditor').value;
        $('#dlgTxtEditor').dialog('close');
    };

    $scope.cancelRichTextEditor = function () {
        $('#dlgTxtEditor').dialog('close');
    }

    //$(document).on('keydown', function (event) {
    //    //delete key pressed
    //    if (event.keyCode == 46) {
    //        var isProp = false;
    //        for (var i = 0; i < event.target.attributes.length; i++) {
    //            if (event.target.attributes[i].name == 'prop') {
    //                isProp = true;
    //                break;
    //            }
    //        }

    //        if (!isProp) {
    //            $scope.$apply(function () {
    //                if ($scope.item.type == 'ticker' && $scope.presentation.tickers.length > 0) {
    //                    var index = $scope.presentation.tickers.indexOf($scope.item);
    //                    $scope.presentation.tickers.splice(index, 1);
    //                }
    //                else if ($scope.item.type == 'image' && $scope.page.images.length > 0) {
    //                    var index = $scope.page.images.indexOf($scope.item);
    //                    $scope.page.images.splice(index, 1);
    //                }
    //                else if ($scope.item.type == 'video' && $scope.page.videos.length > 0) {
    //                    if ($scope.page && $scope.page.videos.length > 0) {
    //                        var index = $scope.page.videos.indexOf($scope.item);
    //                        $scope.page.videos.splice(index, 1);
    //                    }
    //                }
    //                else if ($scope.item.type == 'text' && $scope.page.texts.length > 0) {
    //                    if ($scope.page && $scope.page.texts.length > 0) {
    //                        var index = $scope.page.texts.indexOf($scope.item);
    //                        $scope.page.texts.splice(index, 1);
    //                    }
    //                }
    //            });
    //            $scope.item = null;

    //        }
    //    }

    //});

    
    $scope.searchVideo = function (provider) {
        if (provider == 'youtube') {
            desingerService.searchYoutubeVideo($scope.videoSearchResult.searchToken, function (items) {
                $scope.videoSearchResult.items = items;
            });
        }
    };
    $scope.selectVideoItem = function (item) {
        $scope.videoSearchResult.selectedItem = item;
    };

    $scope.menus = ['New', 'Open', 'Save', 'Save as template'];

}])
.controller("ModalInstanceCtrl", function ($scope, $modalInstance, $http, videoSearchResult) {

    $scope.videoSearchResult = videoSearchResult;
    $scope.selectedItem = {};
    $scope.resultFound = false;
    $scope.ok = function () {
        $modalInstance.close($scope.selectedItem);
    };

    $scope.selectVideoItem = function () {
        $scope.selectedItem = this.item;
    };

    $scope.showResult = function () {
        return this.resultFound;
    };

    $scope.searchVideoOnEnter = function () {
        if (event.keyCode == 13) {
            $scope.searchVideo();
        }
    };

    $scope.searchVideo = function () {
        var dataurl = 'http://gdata.youtube.com/feeds/api/videos?q="' + $scope.videoSearchResult.searchToken + '"&orderby=rating&alt=json';
        var xmlHttpHeader = $http.defaults.headers.common['X-Requested-With'];
        delete $http.defaults.headers.common['X-Requested-With'];
        delete $scope.videoSearchResult.items;
        //$http.jsonp(dataurl);
        $http.get(dataurl)
        .success(function (data) {
            $scope.resultFound = true;
            $http.defaults.headers.common['X-Requested-With'] = xmlHttpHeader;
            $scope.videoSearchResult.items = [];
            for (i = 0; i < data.feed.entry.length; i++) {
                var vInfo = new VideoInfo();
                vInfo.thumbnailSrc = data.feed.entry[i].media$group.media$thumbnail[1].url;
                vInfo.thumbnailWidth = data.feed.entry[i].media$group.media$thumbnail[1].width;
                vInfo.thumbnailHeight = data.feed.entry[i].media$group.media$thumbnail[1].height;
                vInfo.url = data.feed.entry[i].media$group.media$player[0].url.replace('&feature=youtube_gdata_player', '');
                vInfo.skinUrl = data.feed.entry[i].media$group.media$thumbnail[0].url;;
                vInfo.width = data.feed.entry[i].media$group.media$thumbnail[0].width;
                vInfo.height = data.feed.entry[i].media$group.media$thumbnail[0].height;
                $scope.videoSearchResult.items.push(vInfo);
            }
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
})
.controller("TextModalInstanceCtrl", function ($scope, $modalInstance, textInput) {

    $scope.text = textInput;
    $scope.ok = function () {
        $modalInstance.close($scope.text);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
})
.directive('mdraggable', function ($document) {
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
            resize: function (event, ui) {
                item.width = ui.size.width;
                item.height = ui.size.height;
            }
        });
    }
})
.directive('timeSpan', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        replace: true,
        require: '^?ngModel',
        transclude: true,
        scope: {
            duration: '=ngModel'
        },
        template: '<span class="time-spin"><input type="number" class="form-control" ng-model="duration.hour" min="0" placeholder="hh"/>' +
				   	'<input type="number" class="form-control" ng-model="duration.min" max="60" min="0" placeholder="mm" />' +
				   	'<input type="number" class="form-control" ng-model="duration.sec" max="60" min="0" placeholder="ss"/>' +
				   '</span>',
        link: function (scope, element, attrs, ngModel) {
            $(function () {
                var hourSpin = angular.element(element.children()[0]);
                var minSpin = angular.element(element.children()[1]);
                var secSpin = angular.element(element.children()[2]);
                minSpin.on('change', function (event, ui) {
                    tSpanData = ngModel.$viewValue;
                    if (tSpanData.min >= 60) {
                        //scope.$apply(function(){
                        $timeout(function () {
                            tSpanData.hour += 1;
                            tSpanData.min -= 60;
                            ngModel.$setViewValue(tSpanData);
                        }, 0);
                        return false;
                    }
                });
                secSpin.on('change', function (event, ui) {
                    tSpanData = ngModel.$viewValue;
                    if (tSpanData.sec >= 60) {
                        //scope.$apply(function(){
                        $timeout(function () {
                            tSpanData.min += 1;
                            tSpanData.sec -= 60;
                            ngModel.$setViewValue(tSpanData);
                        }, 0);
                        return false;
                    }
                });
            });
        }

    };
}])
.directive('jqAccordion', function ($timeout) {
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
})
.directive('textEditor',[function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            //element[0].value = eval("scope." + attrs.textEditor);
            $(element).jqte();
            //scope.$apply(function () {
                
            //});
            
        }
    }
}]);
