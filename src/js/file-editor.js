'use strict'

var util = require('./util');


module.exports = {
  replace: true,
  template: '#file-editor-template',


  data: function () {
    return {
      util: util,
      file: {},
      show: false,
      visibility: '',
      caption: '',
      modified: false
    }
  },


  events: {
    'file-editor-show': function (file) {this.open(file)}
  },


  watch: {
    visibility: function () {this.update()},
    caption: function () {this.update()}
  },


  methods: {
    // From overlay
    overlayClick: function () {this.cancel()},


    open: function (file) {
      this.addOverlay(undefined, this.$parent.$el);

      this.file = file;
      this.visibility = file.visibility;
      this.caption = file.caption;
      this.show = true;
    },


    close: function () {
      this.removeOverlay();
      this.show = false;
    },


    visibilityChanged: function () {
      return this.visibility != this.file.visibility;
    },


    captionChanged: function () {
      return this.caption != this.file.caption;
    },


    update: function () {
      this.modified = this.visibilityChanged() || this.captionChanged();
    },


    cancel: function () {
      this.$dispatch('file-editor.cancel');
      this.close();
    },


    save: function () {
      var data = {
        visibility: this.visibilityChanged() ? this.visibility : undefined,
        caption: this.captionChanged() ? this.caption : undefined
      }

      this.$dispatch('file-manager.save', this.file, data)
      this.close();
    }
  },


  mixins: [require('./overlay')('modal')]
}
