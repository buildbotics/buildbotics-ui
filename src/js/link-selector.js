'use strict'


module.exports = {
  replace: true,
  template: '#link-selector-template',


  data: function () {
    return {
    }
  },


  events: {
    'link-selector-show': function (text) {this.open(text)}
  },


  methods: {
    // From overlay
    overlayClick: function () {this.cancel()},


    open: function (text) {
      this.addOverlay();
      this.$set('link', '');
      this.$set('text', text || '');
      this.$set('show', true);
    },


    close: function () {
      this.removeOverlay();
      this.show = false;
    },


    cancel: function () {
      this.$dispatch('link-selector-cancel');
      this.close();
    },


    add: function () {
      this.$dispatch('link-selector-add', this.link, this.text);
      this.close();
    }
  },


  mixins: [require('./overlay')('modal')]
}
