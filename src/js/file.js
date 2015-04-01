'use strict'

var util = require('./util');


module.exports = {
  inherit: true,
  template: '#file-template',

  data: function () {
    return {
      util: util
    }
  },


  components: {
    'file-editor': require('./file-editor')
  },


  events: {
    'modal-response': function (button) {
      if (button == 'delete') this.delete();
      return false; // Cancel event propagation
    }
  },


  methods: {
    showThumb: function () {
      return util.isImage(this.file.type) &&
        (!this.file.uploading || this.file.src);
    },


    download: function () {
      this.file.downloads += 1;
    },


    canUp: function () {
      return this.file.url && this.files.indexOf(this.file);
    },


    canDown: function () {
      return this.file.url &&
        this.files.indexOf(this.file) < this.files.length - 1;
    },


    up: function () {
      if (this.canUp()) this.onUp(this.file);
    },


    down: function () {
      if (this.canDown()) this.onDown(this.file);
    },


    edit: function () {
      this.$broadcast('file-editor-show', this.file);
    },


    askDelete: function () {
      this.$broadcast('modal-show-delete');
    },


    delete: function () {
      this.onDelete(this.file);
    }
  }
}
