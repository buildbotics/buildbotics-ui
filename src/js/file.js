'use strict'


function isImage(type) {
  return /^image\/((png)|(gif)|(jpeg)|(svg)|(bmp))$/.test(type);
}


module.exports = {
  inherit: true,
  template: '#file-template',


  events: {
    'modal-response': function (button) {
      if (button == 'delete') this.delete();
      return false; // Cancel event propagation
    }
  },


  methods: {
    getIcon: function () {
      var type = this.file.type;

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
    },


    showThumb: function () {
      return isImage(this.file.type) &&
        (!this.file.uploading || this.file.src);
    },


    download: function () {
      this.file.downloads += 1;
    },


    askDelete: function () {
      this.$broadcast('modal-show-delete');
    },


    delete: function () {
      this.onDelete(this.file);
    }
  }
}
