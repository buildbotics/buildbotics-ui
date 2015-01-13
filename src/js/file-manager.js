'use strict';


function file_manager_directive() {
    function link($scope, element, attrs, ctrl) {
        $scope.addFile = function (file) {
            $scope.files.push(file);
        }

        function remove_file(file) {
            $scope.files.splice($scope.files.indexOf(file), 1);
        }

        $scope.showThumb = function (file) {
            return !!(file.type.indexOf('image/') == 0 &&
                      (!file.uploading || file.src));
        }

        $scope.getFileIcon = function (file) {
            var type = file.type;

            switch (type) {
            case 'text/plain': return 'fa-file-text-o';
            case 'application/pdf': return 'fa-file-pdf-o';

            case 'application/x-gzip':
            case 'application/x-tar':
            case 'application/x-bzip':
            case 'application/x-bzip2':
            case 'application/zip':
            case 'application/x-compressed-zip':
            case 'application/x-compressed':
                return 'fa-file-archive-o';

            default:
                if (type.indexOf('image/') == 0) return 'fa-file-image-o';
                if (type.indexOf('audio/') == 0) return 'fa-file-audio-o';
                if (type.indexOf('video/') == 0) return 'fa-file-video-o';
                if (type.indexOf('text/') == 0) return 'fa-file-code-o';

                return 'fa-file-o';
            }
        }

        $scope.deleteFile = function (file) {
            file.state = 'deleting';
            $scope.onDelete({file: file, done: function (success) {
                if (success) remove_file(file);
            }});
        }

        $scope.fileAdded = function (file) {
            file.state = 'waiting';
            file.uploading = true;
            file.percent = 0;
            $scope.addFile(file);

            // Preload thumbnail
            if (file.type.indexOf('image/') == 0) {
                var preloader = new mOxie.Image();

                preloader.onload = function () {
                    preloader.downsize(64, 64);
                    file.src = preloader.getAsDataURL();
                }

                preloader.load(file.getSource());
            }
        }

        $scope.beforeUpload = function (file, done) {
            $scope.onUpload({file: file, done: function (success, data) {
                if (success) {
                    file.state = 'uploading';
                    file.future_url = data.file_url;
                    done(true, data.upload_url, data.post);

                } else {
                    remove_file(file);
                    done(false);
                }

            }});
        }

        $scope.uploadProgress = function (file) {
            $scope.$apply();
        }

        $scope.fileUploaded = function (file) {
            file.state = 'ok';
            file.uploading = false;
            file.url = file.future_url;
            $scope.$apply();
        }
    }


    return {
        link: link,
        require: ['ngModel'],
        restrict: 'EA',
        templateUrl: 'file-manager.html',
        scope: {
            files: '=ngModel',
            canEdit: '=',
            onSave: '&',
            onAdd: '&',
            onDelete: '&',
            onUpload: '&',
        }
    }
}


function file_controller($scope) {
    function show_modal(name) {
        $scope['show_modal_' + name] = true;
    }

    function hide_modal(name) {
        $scope['show_modal_' + name] = false;
    }

    $scope.askDeleteFile = function (file) {
        show_modal('delete');
    }

    $scope.cancelDelete = function (file) {
        hide_modal('delete');
    }

    $scope.deleteFile = function (file) {
        $scope.$parent.deleteFile(file);
        hide_modal('delete');
    }

    $scope.downloadFile = function (file) {
        file.downloads += 1;
    }
}


angular
    .module('buildbotics.file-manager', [])
    .directive('bbFileManager', file_manager_directive)
    .controller('FileCtrl', file_controller);
