'use strict'


module.exports = function (klass) {
  return {
    methods: {
      overlayClick: function () {},


      addOverlay: function () {
        var self = this;

        this.overlay = $('<div>')
          .addClass('overlay ' + klass)
          .click(function () {self.overlayClick()})
          .appendTo('body');
      },


      removeOverlay: function () {
        if (this.overlay) {
          this.overlay.remove();
          delete this.overlay;
        }
      }
    }
  }
}
