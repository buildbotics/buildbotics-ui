'use strict'

var util = require('./util');


module.exports = {
  replace: true,
  template: '#media-selector-template',
  paramAttributes: ['media'],


  data: function () {
    return {
      util: util
    }
  },


  events: {
    'media-selector-show': function () {this.open()}
  },


  methods: {
    // From overlay
    overlayClick: function () {this.cancel()},


    open: function () {
      this.addOverlay();
      this.$set('selected', -1);
      this.$set('show', true);
      this.$set('size', 'small');
    },


    close: function () {
      this.removeOverlay();
      this.show = false;
    },


    select: function (index) {
      this.selected = index;
    },


    sizeChanged: function (e) {
      this.size = $(e.target).val();
    },


    getFileName: function (file) {
      return file.url.replace(/^.*\//, '');
    },


    cancel: function () {
      this.$dispatch('media-selector-cancel');
      this.close();
    },


    add: function () {
      this.$dispatch('media-selector-add', this.media[this.selected],
                     this.size);
      this.close();
    }
  },


  mixins: [require('./overlay')('modal')]
}
