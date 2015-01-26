'use strict'


module.exports = {
  replace: true,
  template: '#carousel-template',
  paramAttributes: ['media'],


  ready: function () {
    var el = $(this.$el);

    this.slick = $(this.$el).slick({
      dots: true,

      onBeforeChange: function () {
        el.addClass('changing');
      },

      onAfterChange: function () {
        el.removeClass('changing');
      }
    });
  },


  methods: {
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
