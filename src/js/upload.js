'use strict';


function upload_directive($window) {
    function link($scope, element, attrs) {
        // Add IDs needed by plupload to HTML
        var id = Math.random();
        var uploadID = 'upload-' + id;
        var dropzoneID = 'upload-dropzone-' + id;
        var browseID = 'upload-browse-' + id;

        element.children().first().attr('id', uploadID)
        element.find('.dropzone').attr('id', dropzoneID);
        element.find('.browse').attr('id', browseID);

        // Configure plupload
        var uploader = new plupload.Uploader({
            runtimes: 'html5',
            url: $scope.url,
            file_data_name: 'file',
            container: uploadID,
            drop_element: dropzoneID,
            browse_button: browseID,
            multipart_params: {},
        });

        // Bind events
        uploader.bind('Error',          handleError);
        uploader.bind('PostInit',       handleInit);
        uploader.bind('FilesAdded',     handleFilesAdded);
        uploader.bind('QueueChanged',   handleQueueChanged);
        uploader.bind('BeforeUpload',   handleBeforeUpload);
        uploader.bind('UploadProgress', handleUploadProgress);
        uploader.bind('FileUploaded',   handleFileUploaded);
        uploader.bind('StateChanged',   handleStateChanged);

        // Init
        uploader.init();

        // Handle window resize
        function handleWindowResize(event) {uploader.refresh()}
        var win = $($window);
        win.on('resize', handleWindowResize);
        
        // Cleanup
        $scope.$on('$destroy', function() {
            win.off('resize', handleWindowResize);
            uploader.destroy();
        });


        function handleError(uploader, error) {
            console.warn("Upload error");
            console.error(JSON.stringify(error));
            $scope.onError({error: error});
        }


        function handleInit(uploader, params) {
            console.log('Initialization complete.');
            console.log('Drag-drop supported:', !!uploader.features.dragdrop);
        }


        function handleFilesAdded(uploader, files) {
            for (var i = 0; i < files.length; i++) {
                console.log('Added file ' + files[i].name);
                $scope.onFileAdded({file: files[i]});
            }
        }


        function handleQueueChanged(uploader) {
            if (uploader.files.length && uploader.state === plupload.STOPPED)
                uploader.start();
        }


        function handleBeforeUpload(uploader, file) {
            var settings = uploader.settings;
            var params = settings.multipart_params;

            console.log('Uploading ' + file.name);

            function done(success, url, post) {
                if (success) {
                    // Set upload url
                    settings.url = url;

                    // Copy post fields
                    $.extend(params, post);

                    // Continue upload
                    file.status = plupload.UPLOADING;
                    uploader.trigger("UploadFile", file);

                } else {
                    console.warn("File being removed from queue:", file.name);

                    // Remove this upload, but continue others
                    uploader.stop();
                    uploader.removeFile(file);
                    uploader.start();
                }
            }

            $scope.onBeforeUpload({file: file, done: done});

            // Suspend upload, continued by call to done()
            return false;
        }


        function handleUploadProgress(uploader, file) {
            $scope.onUploadProgress({file: file});
        }


        function handleFileUploaded(uploader, file, response) {
            $scope.onFileUploaded({file: file});
        }


        function handleStateChanged(uploader) {}
    }

    return {
        link: link,
        restrict: 'E',
        scope: {
            url: '=',
            onBeforeUpload: '&',
            onUploadProgress: '&',
            onFileAdded: '&',
            onFileUploaded: '&',
            onError: '&'
        },
        transclude: true,
        template: '<div><div class="dropzone" ng-transclude></div></div>'
    }
}


angular
    .module('buildbotics.upload', [])
    .directive('upload', upload_directive);
