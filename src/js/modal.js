'use strict'


module.exports = {
  replace: true,
  template: '#modal-template',
  paramAttributes: ['ref', 'buttons', 'callout', 'context'],


  data: function () {
    return {
      show: false
    }
  },


  watch: {
    'show': function (show) {
      if (show) this.open();
      else this.close();
    }
  },


  ready: function () {
    // Listen to events
    this.$on('modal-show-' + this.ref, function () {this.open()});
    this.$on('modal-hide-' + this.ref, function () {this.close()});

    // Split buttons
    this.buttons = this.buttons.split(' ');

    // Set callout class
    if (this.callout) Vue.util.addClass(this.$el, 'callout-' + this.callout);
  },


  methods: {
    overlayClick: function () {this.response('cancel')},

    open: function () {
      this.addOverlay();
      $('body').addClass('modal-active');
      this.show = true;
    },


    close: function () {
      this.removeOverlay();
      $('body').removeClass('modal-active');
      this.show = false;
    },


    response: function (button) {
      var self = this;
      this.close();
      self.$dispatch('modal-response', button, self.ref, self.context);
    }
  },


  mixins: [require('./overlay')('modal-overlay')]
}
