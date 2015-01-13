'use strict';


function notify_service($modal) {
    function display_msg(type, title, msg) {
        $modal.open({
            templateUrl: 'notify.html',
            controller: 'NotifyDialogCtrl',
            resolve: {
                type:  function () {return type;},
                title: function () {return title;},
                msg:   function () {return msg;}
            }
        })
    }

    return {
        info:    function (title, msg) {display_msg('info',    title, msg);},
        error:   function (title, msg) {display_msg('error',   title, msg);},
        warning: function (title, msg) {display_msg('warning', title, msg);}
    }
}


function notify_dialog_controller($scope, $modalInstance, type, title, msg) {
    $scope.type = type;
    $scope.icon = type == 'error' ? 'exclamation-circle' : type;
    $scope.title = title;
    $scope.message = msg;
    $scope.ok = function () {$modalInstance.dismiss('cancel');};
}


angular
    .module('buildbotics.notify', [])
    .controller('NotifyDialogCtrl', notify_dialog_controller)
    .factory('$notify', notify_service)
