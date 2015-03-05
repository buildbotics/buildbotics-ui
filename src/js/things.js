'use strict'


module.exports = {
  replace: true,
  template: '#things-template',
  paramAttributes: ['things'],


  watch: {
    things: function () {
      var element = $(this.$el);

      // Hide images before they are loaded
      var images = element.find('.image img');
      images.each(function () {
        if (!this.complete) $(this).hide();
      });

      // Unhide after load
      images.one('load', function () {
        // Stretch if close
        var parent = $(this.parentNode);
        var parentAspect = parent.width() / parent.height();
        var aspect = this.width / this.height;
        var diff = Math.abs(1 - aspect / parentAspect);

        if (0.001 < diff && diff < 0.18) $(this).addClass('stretch');
        else $(this).removeClass('stretch');

        // Make visible
        $(this).fadeIn(500);

      }).each(function () {
        // Make sure we get the load signal even for cached images
        if (this.complete) $(this).load()
      });
    }
  }
}
