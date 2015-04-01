'use strict'

var util = require('./util');


module.exports = {
  replace: true,
  template: '#youtube-selector-template',


  data: function () {
    return {
      url: '',
      valid: false
    }
  },


  watch: {
    url: function (url) {
      this.$set('valid', util.isYoutube(url))
    }
  },


  events: {
    'youtube-selector-show': function () {this.open()}
  },


  methods: {
    // From overlay
    overlayClick: function () {this.cancel()},


    open: function () {
      this.addOverlay(undefined, this.$parent.$el);
      this.$set('url', '');
      this.$set('show', true);
    },


    close: function () {
      this.removeOverlay();
      this.show = false;
    },


    cancel: function () {
      this.$dispatch('youtube-selector-cancel');
      this.close();
    },


    insert: function () {
      this.$dispatch('youtube-selector-add', util.sanitizeYoutube(this.url));
      this.close();
    }
  },


  mixins: [require('./overlay')('modal')]
}
