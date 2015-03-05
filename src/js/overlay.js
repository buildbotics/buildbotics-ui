'use strict'


module.exports = function (name) {
  return {
    beforeDestroy: function () {
      this.removeOverlay(name);
    },


    methods: {
      overlayClick: function (name) {},


      addOverlay: function (_name) {
        if (typeof _name != 'undefined' && name != _name) return;

        if (typeof this.overlay == 'undefined')
          this.overlay = $('<div>')
          .addClass('overlay ' + name + '-overlay')
          .click(function () {this.overlayClick(name)}.bind(this))
          .appendTo('body');
      },


      removeOverlay: function (_name) {
        if (typeof _name != 'undefined' && name != _name) return;

        if (typeof this.overlay != 'undefined') {
          this.overlay.remove();
          delete this.overlay;
        }
      }
    }
  }
}
