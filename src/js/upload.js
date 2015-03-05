'use strict'


module.exports = function (url) {
  return {
    ready: function () {
      this.initUploader();
    },


    beforeDestroy: function () {
      if (this.uploader) this.uploader.destroy();
    },


    methods: {
      initUploader: function () {
        if (this.uploader) return; // Already loaded

        var self = this;

        // Find targets
        var element = $(this.$el);
        var dropzone = element.find('.dropzone');
        var browse = element.find('.browse');

        if (!dropzone.length && !browse.length) return; // Uploads disabled

        // Add IDs needed by plupload to HTML
        var id = Math.random();
        var uploadID = 'upload-' + id;
        var dropzoneID = 'upload-dropzone-' + id;
        var browseID = 'upload-browse-' + id;

        // Set IDs
        element.children().first().attr('id', uploadID)

        if (dropzone.length) dropzone.attr('id', dropzoneID);
        else dropzoneID = undefined;

        if (browse.length) browse.attr('id', browseID);
        else browseID = undefined;

        // Configure plupload
        this.uploader = new plupload.Uploader({
          runtimes: 'html5',
          url: url,
          file_data_name: 'file',
          container: uploadID,
          drop_element: dropzoneID,
          browse_button: browseID,
          multipart_params: {},
        });

        // Bind events
        this.uploader.bind('Error',          handleError);
        this.uploader.bind('PostInit',       handleInit);
        this.uploader.bind('FilesAdded',     handleFilesAdded);
        this.uploader.bind('QueueChanged',   handleQueueChanged);
        this.uploader.bind('BeforeUpload',   handleBeforeUpload);
        this.uploader.bind('UploadProgress', handleUploadProgress);
        this.uploader.bind('FileUploaded',   handleFileUploaded);

        // Init
        this.uploader.init();

        // Handle window resize
        this.resizeHandler = function (event) {self.uploader.refresh()}
        $(window).on('resize', this.resizeHandler);
        

        function handleError(uploader, error) {
          self.onError(error);
        }


        function handleInit(uploader, params) {
          //console.debug('Uploader initialized');
          //console.debug('Drag-drop supported:', !!uploader.features.dragdrop);
        }


        function handleFilesAdded(uploader, files) {
          self.onFilesAdded(files);
        }


        function handleQueueChanged(uploader) {
          if (uploader.files.length && uploader.state === plupload.STOPPED)
            uploader.start();
        }


        function handleBeforeUpload(uploader, file) {
          if (file.state == 'deleted') {
            uploader.removeFile(file);
            return false;
          }

          var settings = uploader.settings;
          var params = settings.multipart_params;

          console.debug('Uploading ' + file.name);

          function done(success, url, post) {
            if (success) {
              // Set upload url
              settings.url = url;

              // Copy post fields
              $.extend(params, post);

              // Continue with upload
              file.status = plupload.UPLOADING;
              uploader.trigger("UploadFile", file);

            } else {
              console.debug("Removing file from queue:", file.name);

              // Remove this upload, but continue others
              uploader.stop();
              uploader.removeFile(file);
              uploader.start();
            }
          }

          self.onBeforeUpload(file, done);

          // Suspend upload, continued by call to done()
          return false;
        }


        function handleUploadProgress(uploader, file) {
          if (file.state == 'deleted') {
            uploader.stop();
            uploader.removeFile(file);

          } else self.onUploadProgress(file);
        }


        function handleFileUploaded(uploader, file, response) {
          console.debug('Upload complete ' + file.name);
          self.onFileUploaded(file);
        }
      },


      beforeDestroy: function () {
        if (this.uploader) {
          $(window).off('resize', this.resizeHandler);
          this.uploader.destroy();
          console.debug('uploader destroyed');
        }
      },


      onBeforeUpload: function (file, done) {done()},


      onUploadProgress: function (file) {
        console.debug('Uploaded ' + file.percent + '% of ' + file.name);
      },


      onFilesAdded: function (files) {
        for (var i = 0; i < files.length; i++) {
          console.debug('Added file ' + files[i].name);
          this.onFileAdded(files[i]);
        }
      },


      onFileAdded: function (file) {},
      onFileUploaded: function (file) {},


      onError: function (error) {
        console.debug('Upload error:', JSON.stringify(error));
      }
    }
  }
}
