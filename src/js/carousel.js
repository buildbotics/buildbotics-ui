'use strict'


module.exports = {
  replace: true,
  template: '#carousel-template',
  paramAttributes: ['media'],


  watch: {
    media: function () {this.reload()}
  },


  beforeDestroy: function () {this.unload()},


  methods: {
    load: function () {
      var element = $(this.$el);

      // Changing class
      this.slick = element.slick({
        dots: true,

        onBeforeChange: function () {
          element.addClass('changing');
        },

        onAfterChange: function () {
          element.removeClass('changing');
        }
      });


      // Hide images before they are loaded
      var images = element.find('.carousel-media img');
      images.each(function () {
        if (!this.complete) $(this).hide();
      })

        // Stretch images which are close to our aspect ratio
        var list = element.find('.slick-list');
      var carouselAspect = list.width() / list.height();
      images.one('load', function () {
        var aspect = this.width / this.height;
        var diff = Math.abs(1 - aspect / carouselAspect);

        if (0.001 < diff && diff < 0.18) $(this).addClass('stretch');
        else $(this).removeClass('stretch');

        // Make visible
        $(this).fadeIn(500);

      }).each(function () {
        // Make sure we get the load signal even for cached images
        if (this.complete) $(this).load()
      })
    },


    unload: function () {
      if (this.slick) this.slick.unslick();
    },


    reload: function () {
      this.unload();
      this.load();
    },


    isImage: function (type) {
      return /^image\/((png)|(gif)|(jpeg)|(svg)|(bmp))/.test(type);
    },


    fullscreen: function (enable) {
      if (typeof enable == 'undefined') $(this.$el).toggleClass('fullscreen');
      else if (enable) $(this.$el).addClass('fullscreen');
      else $(this.$el).removeClass('fullscreen');

      $(this.$el).slickSetOption('dots', true, true);
    }
  }
}
