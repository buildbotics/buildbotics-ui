'use strict'

var buttons = require('./buttons')


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

    // Add buttons
    $(this.$el).find('.modal-footer')
      .append(buttons.create(this.buttons, this.response))

    // Set callout class
    if (this.callout) Vue.util.addClass(this.$el, 'callout-' + this.callout);
  },


  methods: {
    // From overlay
    overlayClick: function () {this.response('cancel')},


    open: function () {
      if (!this.show) {
        this.addOverlay();
        $('body').addClass('modal-active');
        this.show = true;
      }
    },


    close: function () {
      if (this.show) {
        this.removeOverlay();
        $('body').removeClass('modal-active');
        this.show = false;
      }
    },


    response: function (button) {
      this.close();
      this.$dispatch('modal-response', button, this.ref, this.context);
    }
  },


  mixins: [require('./overlay')('modal')]
}
