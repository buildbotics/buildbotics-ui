'use strict'


module.exports = function (klass) {
  return {
    beforeDestroy: function () {
      this.removeOverlay();
    },


    methods: {
      overlayClick: function () {},


      addOverlay: function () {
        var self = this;

        if (typeof this.overlay == 'undefined')
          this.overlay = $('<div>')
          .addClass('overlay ' + klass)
          .click(function () {self.overlayClick()})
          .appendTo('body');
      },


      removeOverlay: function () {
        if (typeof this.overlay != 'undefined') {
          this.overlay.remove();
          delete this.overlay;
        }
      }
    }
  }
}
