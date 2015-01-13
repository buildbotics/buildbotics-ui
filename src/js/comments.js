'use strict';


function comments_directive($buildbotics, $notify) {
    function controller($scope) {
        $buildbotics.extend($scope);
        $scope.api_url = $scope.thing.api_url + '/comments';
        $scope.text = '';

        $scope.comment = function () {
            if (!$scope.text.trim()) {
                // TODO warn invalid
                return;
            }

            // TODO handle step and comment ref

            var comment = {
                text: $scope.text
            }

            $buildbotics.post($scope.api_url, comment)
                .success(function (data) {
                    // Add comment
                    $.extend(comment, {
                        id: data,
                        owner: $buildbotics.user.name,
                        thing_owner: $scope.thing.owner,
                        thing: $scope.thing.name,
                        avatar: $buildbotics.user.avatar,
                        created: new Date().toISOString(),
                        modified: new Date().toISOString()
                    });
                    $scope.comments.push(comment);

                    $scope.text = '';

                }).error(function (data, status) {
                    $notify.error('Failed to post comment', status);
                });
        }
    }

    return {
        controller: controller,
        require: ['ngModel'],
        restrict: 'E',
        templateUrl: 'comments.html',
        scope: {
            comments: '=ngModel',
            thing: '='
        }
    }
}


function comment_controller($scope, $buildbotics, $notify) {
    $scope.editing = false;
    $scope.is_owner = $buildbotics.user.name == $scope.comment.owner;
    $scope.api_url =
        $scope.thing.api_url + '/comments/' + $scope.comment.comment;

    $scope.edit = function () {
        $scope.editing = true;
    }

    $scope.save = function () {
        $buildbotics.put($scope.api_url, $scope.comment)
            .success(function (data) {
                $scope.editing = false;
            }).error(function (data, status) {
                $notify.error('Failed to update comment', status);
            });
    }

    $scope.cancel = function () {
        $scope.editing = false;
    }

    $scope.askRemove = function () {
        $scope.show_modal_remove = true;
    }

    $scope.cancelRemove = function () {
        $scope.show_modal_remove = false;
    }

    $scope.remove = function () {
        $buildbotics.delete($scope.api_url, $scope.comment)
            .success(function (data) {
                var i = $scope.comments.indexOf($scope.comment);
                $scope.comments.splice(i, 1);

                $scope.show_modal_remove = false;
            }).error(function (data, status) {
                $notify.error('Failed to remove comment', status);
            });
    }
}


angular
    .module('buildbotics.comments', [])
    .directive('bbComments', comments_directive)
    .controller('CommentCtrl', comment_controller)
