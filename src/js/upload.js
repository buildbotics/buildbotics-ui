'use strict'


module.exports = function (url) {
  return {
    ready: function () {
      var self = this;

      // Add IDs needed by plupload to HTML
      var id = Math.random();
      var uploadID = 'upload-' + id;
      var dropzoneID = 'upload-dropzone-' + id;
      var browseID = 'upload-browse-' + id;

      // Set IDs
      var element = $(this.$el);
      element.children().first().attr('id', uploadID)
      element.find('.dropzone').attr('id', dropzoneID);
      element.find('.browse').attr('id', browseID);

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
        self.onUploadProgress(file);
      }


      function handleFileUploaded(uploader, file, response) {
        console.debug('Upload complete ' + file.name);
        self.onFileUploaded(file);
      }
    },


    beforeDestroy: function () {
      $(window).off('resize', this.resizeHandler);
      this.uploader.destroy();
    },


    methods: {
      onBeforeUpload: function (file, done) {done()},
      onUploadProgress: function (file) {},


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
