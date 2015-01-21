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


  ready: function () {
    var self = this;

    // Inject modal overlay
    this.$watch('show', function (show) {
      if (show) {
        this.overlay = $('<div>')
          .addClass('modal-overlay')
          .click(function () {self.response('cancel')})
          .appendTo('body');

        $('body').addClass('modal-active');

      } else {
        this.overlay.remove();
        $('body').removeClass('modal-active');
      }
    })

    // Listen to events
    var self = this;
    this.$on('modal-show-' + this.ref, function () {self.show = true});
    this.$on('modal-hide-' + this.ref, function () {self.show = false});

    // Split buttons
    this.buttons = this.buttons.split(' ');

    // Set callout class
    if (this.callout) Vue.util.addClass(this.$el, 'callout-' + this.callout);
  },


  methods: {
    response: function (button) {
      this.$dispatch('modal-response', button, this.ref, this.context);
      this.show = false;
    }
  }
}
