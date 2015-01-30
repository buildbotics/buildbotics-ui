'use strict'


module.exports = {
  replace: true,
  template: '#things-template',
  paramAttributes: ['things'],


  watch: {
    things: function () {
      var element = $(this.$el);

      // Hide images before they are loaded
      var images = element.find('img');
      images.each(function () {
        if (!this.complete) $(this).hide();
      });

      // Unhide after load
      images.one('load', function () {
        $(this).fadeIn(500);

      }).each(function () {
        // Make sure we get the load signal even for cached images
        if (this.complete) $(this).load()
      });
    }
  }
}
