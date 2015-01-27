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
      if (show) this.open();
      else this.close();
    })

    // Listen to events
    var self = this;
    this.$on('modal-show-' + this.ref, function () {self.open()});
    this.$on('modal-hide-' + this.ref, function () {self.close()});

    // Split buttons
    this.buttons = this.buttons.split(' ');

    // Set callout class
    if (this.callout) Vue.util.addClass(this.$el, 'callout-' + this.callout);
  },


  methods: {
    open: function () {
      this.overlay = $('<div>')
        .addClass('modal-overlay')
        .click(function () {self.response('cancel')})
        .appendTo('body');

      $('body').addClass('modal-active');

      this.show = true;
    },


    close: function () {
      $('body > .modal-overlay').remove();
      $('body').removeClass('modal-active');
      this.show = false;
    },


    response: function (button) {
      var self = this;
      this.close();
      self.$dispatch('modal-response', button, self.ref, self.context);
    }
  }
}
