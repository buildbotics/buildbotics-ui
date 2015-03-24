'use strict'


var util = {
  isImage: function (type) {
    return /^image\/((png)|(gif)|(jpeg)|(svg))/.test(type);
  },


  isVideo: function (type) {
    return /^video\/mp4/.test(type);
  },


  isMedia: function (type) {
    return util.isImage(type) || util.isVideo(type);
  },


  prettyURL: function (url) {
    return url.replace(/^https?:\/\//, '');
  },


  scrollTo: function (selector, cb, animate) {
    Vue.nextTick(function () {
      console.debug('scroll_to(' + selector + ')');

      if (!selector || selector == '#') selector = 'html,body';
      if (typeof animate == 'undefined') animate = true;

      var target = $(selector);
      target = target.length ? target : $('[name=' + selector.slice(1) +']');

      if (target.length) {
        var top = target.offset().top;

        if (animate) {
          $("html, body").animate({scrollTop: top}, 1000, 'swing', cb)
          return
        }

        window.scrollTo(0, top);
      }

      if (cb) cb();
    })
  }
}


module.exports = util;
