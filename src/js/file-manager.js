'use strict'


function isImage(file) {
  return /^image\/((png)|(gif)|(jpeg)|(svg)|(bmp))$/.test(file.type);
}


module.exports = {
  template: '#file-manager-template',
  paramAttributes: ['files', 'canEdit'],
  components: {'bb-file': require('./file')},


  data: function () {
    return {
      canEdit: false
    }
  },


  events: {
    'file-manager-can-edit': function (canEdit) {
      this.$set('canEdit', canEdit);
    }
  },


  methods: {
    removeFile: function (file) {
      this.files.splice(this.files.indexOf(file), 1);
    },


    fileUpdated: function (file) {
      // HACK Remove and readd file to force it to reload
      var self = this;
      var index = this.files.indexOf(file);
      this.files.splice(index, 1);
      Vue.nextTick(function () {self.files.splice(index, 0, file)})
    },


    onBeforeUpload: function (file, done) {
      var self = this;
      function cb(success, data) {
        if (success) {
          file.state = 'uploading';
          file.future_url = data.file_url;
          done(true, data.upload_url, data.post);

        } else {
          self.removeFile(file);
          done(false);
        }
      }

      this.$dispatch('file-manager-before-upload', file, cb);
    },


    onFileAdded: function (file) {
      file.state = 'waiting';
      file.uploading = true;
      file.percent = 0;
      file.downloads = 0;
      this.files.push(file);

      // Preload thumbnail
      if (isImage(file)) {
        var preloader = new mOxie.Image();

        preloader.onload = function () {
          preloader.downsize(64, 64);
          file.src = preloader.getAsDataURL();
        }

        preloader.load(file.getSource());
      }
    },


    onFileUploaded: function (file) {
      file.state = 'ok';
      file.uploading = false;
      file.url = file.future_url;
      this.fileUpdated(file);
    },


    onDelete: function (file) {
      file.state = 'deleting';

      var self = this;
      function cb(success) {
        if (success) self.removeFile(file);
        else file.state = 'ok';
      }

      this.$dispatch('file-manager-delete', file, cb);
    }
  },


  mixins: [require('./upload')('/')]
}
