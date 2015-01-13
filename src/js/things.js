'use strict';


function things_directive() {
    function link($scope, element, attrs, ctrl) {
        $scope.star_toggle = function () {
            alert('TODO');
        }
    }

    return {
        link: link,
        require: ['ngModel'],
        restrict: 'E',
        templateUrl: 'things.html',
        scope: {
            things: '=ngModel'
        }
    }
}


function tags_directive() {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            ctrl.$validators.length = function (name) {
                return /^(([^,]{0,64})?(,([^,]{0,64})?)*)?$/.test(name);
            };
            ctrl.$validators.noSpaces = function (name) {
                return /^[^ ]*$/.test(name);
            };
            ctrl.$validators.validChars = function (name) {
                return /^[\w, ]*$/.test(name);
            };
            ctrl.$validators.startChars = function (name) {
                return /^(([a-zA-Z][^,]*)?(,([a-zA-Z][^,]*)?)*)?$/
                    .test(name);
            };
        }
    }
}


function parse_tags(tags) {
    if (!tags) return [];
    return tags
        .split(',')
        .map(function (tag) {return tag.trim().replace(/^#/, '')})
        .filter(function (tag) {return tag});
}


function thing_directive($buildbotics, $notify) {
    function controller($scope) {
        $buildbotics.extend($scope);
        $.extend($scope, $scope.thing_data);

        $scope.edit = {};
        $scope.old = {};
        $scope.images_control = {};
        $scope.api_url = '/api/profiles/' + $scope.thing.owner + '/things/' +
            $scope.thing.name;
        $scope.thing.api_url = $scope.api_url;
        $scope.stars = $scope.stars || [];
        $scope.starred = $scope.stars.filter(function (star) {
            return star.profile == $buildbotics.user.name;
        }).length != 0;
        $scope.thing.tags = parse_tags($scope.thing.tags);
        $scope.new_tags = '';

        $scope.is_owner = function () {
            return $buildbotics.isUser($scope.thing.owner);
        }

        function put_thing(data) {
            $buildbotics.put($scope.api_url, data)
                .error(function (data, status) {
                    $notify.error('Save failed', 'Failed to save ' + field +
                                  '\n' + status)
                });
        }

        $scope.toggleEdit = function (field) {
            $scope.edit[field] = !$scope.edit[field];
            if ($scope.edit[field]) $scope.old[field] = $scope.thing[field];
            else $scope.thing[field] = $scope.old[field];
        };

        $scope.edit = function (field) {
            $scope.old[field] = $scope.thing[field];
            $scope.edit[field] = true;
        };

        $scope.cancel = function (field) {
            $scope.thing[field] = $scope.old[field];
            $scope.edit[field] = false;
        };

        $scope.save = function (field) {
            if ($scope.thing[field] != $scope.old[field]) {
                var data = {};
                data[field] = $scope.thing[field];
                put_thing(data);
            }

            $scope.edit[field] = false;
        };

        $scope.addTags = function (tags) {
            tags = tags.split(',');
            var new_tags = [];
            for (var i = 0; i < tags.length; i++) {
                var tag = tags[i].trim();
                if (tag && $scope.thing.tags.indexOf(tag) == -1)
                    new_tags.push(tag);
            }

            if (new_tags.length) {
                $buildbotics.put($scope.api_url + '/tags/' + new_tags.join(','))
                    .success(function () {
                        for (var i = 0; i < new_tags.length; i++)
                            $scope.thing.tags.push(new_tags[i]);
                    })
                    .error(function (data, status) {
                        $notify.error('Failed to add tags',
                                      'Failed to add tags `' + new_tags +
                                      '`\n' + status)
                    });
            }

            $scope.new_tags = '';
            $scope.edit['tags'] = false;
        }

        $scope.removeTag = function (tag) {
            $buildbotics.delete($scope.api_url + '/tags/' + tag)
                .success(function () {
                    var i = $scope.thing.tags.indexOf(tag);
                    $scope.thing.tags.splice(i, 1);
                })
                .error(function (data, status) {
                    $notify.error('Failed to remove tag',
                                  'Failed to remove tag `' + tag + '`\n' +
                                  status)
                });
        }

        $scope.publish = function (pub) {
            put_thing({publish: pub});
            $scope.thing.published = pub;
        }

        $scope.deleteFile = function (file, done) {
            $buildbotics.delete($scope.api_url + '/files/' + file.name)
                .success(function () {
                    done(true);
                })
                .error(function (data, status) {
                    $notify.error('Delete failed', 'Failed to delete file ' +
                                  file.name + '\n' + status)
                    done(false);
                });
        }

        $scope.uploadFile = function (file, media, done) {
            var url = $scope.api_url + '/files/' + file.name;

            var data = {
                type: file.type,
                size: file.size,
                display: media
            }

            $buildbotics.put(url, data)
                .success(function (data) {done(true, data);})
                .error(function (data, status) {
                    console.error('Upload failed:', status);
                    done(false);
                });
        }

        $scope.starThing = function () {
            if ($scope.starred) return;

            $buildbotics.put($scope.api_url + '/star')
                .success(function () {
                    $scope.stars.push({
                        profile: $buildbotics.user.name,
                        avatar: $buildbotics.user.avatar
                    });

                    $scope.thing.stars += 1;
                    $scope.starred = true;

                }).error(function (data, status) {
                    $notify.error('Star failed', 'Failed to star thing\n' +
                                  status)
                });
        }


        $scope.unstarThing = function () {
            if (!$scope.starred) return;

            $buildbotics.delete($scope.api_url + '/star')
                .success(function () {
                    $scope.stars = $scope.stars.filter(function (star) {
                        return star.profile != $buildbotics.user.name;
                    });

                    $scope.thing.stars -= 1;
                    $scope.starred = false;

                }).error(function (data, status) {
                    $notify.error('Unstar failed', 'Failed to unstar thing\n' +
                                  status)
                });
        }


        $scope.toggleStarThing = function () {
            if ($scope.starred) $scope.unstarThing();
            else $scope.starThing();
        }
    }

    return {
        controller: controller,
        require: ['ngModel'],
        restrict: 'E',
        templateUrl: 'thing.html',
        scope: {
            thing_data: '=ngModel'
        }
    }
}


angular
    .module('buildbotics.things', [])
    .directive('bbTags', tags_directive)
    .directive('bbThings',  things_directive)
    .directive('bbThing', thing_directive)
