'use strict'


module.exports = {
  replace: true,
  template: '#media-template',

  computed: {
    'isImage': function () {
      return /^image\/((png)|(gif)|(jpeg)|(svg)|(bmp))/.test(this.type);
    }
  },


  compiled: function () {
    // Stretch images which are close to our aspect ratio
    var element = $(this.$el);
    var mediaAspect = element.width() / element.height();

    element.find('img').one('load', function () {
      var aspect = this.width / this.height;
      var diff = Math.abs(1 - aspect / mediaAspect);

      if (0.001 < diff && diff < 0.10)
        element.find('img').addClass('stretch');

    }).each(function () {
      // Make sure we get the load signal even for cached images
      if (this.complete) $(this).load()
    })
  }
}
