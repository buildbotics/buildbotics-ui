'use strict';

function gallery_directive() {
    function link($scope, element, attrs, ctrl) {
        element.addClass('owl-carousel owl-theme');

        var carousel;

        function init() {
            console.log('init()');

            carousel = element.owlCarousel({
                singleItem: true,
                navigation: true,
                autoHeight: false,
                autoPlay: true,
                center: true,
                loop: true,
                dots: true
            });

            destroy();
        }


        function destroy() {
            if (carousel && carousel.data('owlCarousel'))
                carousel.data('owlCarousel').destroy();
        }

        $scope.$watchCollection(attrs.watch, function (newVal,  oldVal) {
            console.log('watch()', newVal, oldVal);
            //destroy();
            if (newVal && newVal.length) init();
        });
    }

    return {
        link: link,
        restrict: 'E',
        scope: true
    }
}


angular
    .module('buildbotics.gallery', [])
    .directive('bbGallery', gallery_directive);
