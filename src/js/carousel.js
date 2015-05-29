'use strict'

var util = require('./util');


module.exports = {
  replace: true,
  template: '#carousel-template',
  paramAttributes: ['media', 'dots'],
  components: {'bb-media': require('./media')},


  data: function () {
    return {
      dots: true,
      isFullscreen: false
    }
  },


  watch: {
    media: function () {this.reload()}
  },


  beforeDestroy: function () {this.unload()},


  methods: {
    load: function () {
      var element = $(this.$el);

      // Changing class
      this.slick = element.slick({
        dots: this.dots !== 'false',
        infinite: false,

        onBeforeChange: function () {
          //element.addClass('changing');
        },

        onAfterChange: function () {
          element.removeClass('changing');
        }
      });

      // Hide images before they are loaded
      var images = element.find('.carousel-media img');
      images.each(function () {
        if (!this.complete) $(this).hide();
      });

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
      return util.isImage(type);
    },


    fullscreen: function (enable) {
      if (typeof enable == 'undefined')
        enable = !$(this.$el).hasClass('fullscreen');

      if (enable) $(this.$el).addClass('fullscreen');
      else $(this.$el).removeClass('fullscreen');

      $(this.$el).slickSetOption('dots', this.dots !== 'false', true);

      this.isFullscreen = enable;
    }
  }
}
