'use strict'

var ytLongRE =
  /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([\w-]{11})(\&.*)?$/;

var ytShortRE = /^(https?:\/\/)?(www\.)?youtu\.be\/([\w-]{11})$/;
var ytIdRE = /^[\w-]{11}$/;


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


  isYoutube: function (url) {
    return url.match(ytLongRE) || url.match(ytShortRE) || url.match(ytIdRE)
  },


  isYoutubeId: function (url) {
    return url.match(ytIdRE)
  },


  getYoutubeId: function (url) {
    // ID
    if (url.match(ytIdRE)) return url;

    // Short
    var m = url.match(ytShortRE);
    if (m) return m[3];

    // Long
    m = url.match(ytLongRE);
    if (m) return m[3];
  },


  sanitizeYoutube: function (url) {
    if (this.isYoutubeId(url)) url = 'http://youtu.be/' + url;
    url = url.replace(/\&feature=[^&]+/, '')
    return url;
  },


  cleanYoutube: function (url) {
    url = this.sanitizeYoutube(url);
    url = url.replace(/^https?:/, '');
  },


  getIcon: function (type) {
    switch (type) {
    case 'text/plain': return 'fa-file-text-o';
    case 'application/pdf': return 'fa-file-pdf-o';
    case 'application/x-gzip':
    case 'application/x-tar':
    case 'application/x-bzip':
    case 'application/x-bzip2':
    case 'application/zip':
    case 'application/x-compressed-zip':
    case 'application/x-compressed':
      return 'fa-file-archive-o';

    default:
      if (typeof type != 'undefined') {
        if (type.indexOf('image/') == 0) return 'fa-file-image-o';
        if (type.indexOf('audio/') == 0) return 'fa-file-audio-o';
        if (type.indexOf('video/') == 0) return 'fa-file-video-o';
        if (type.indexOf('text/') == 0) return 'fa-file-code-o';
      }

      return 'fa-file-o';
    }
  },


  prettyURL: function (url) {
    return url.replace(/^https?:\/\//, '');
  },


  scrollTo: function (selector, cb, animate) {
    Vue.nextTick(function () {
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
  },


  parseQueryString: function(q) {
    function decode(s) {return decodeURIComponent(s.replace(/\+/g, ' '))}

    var match;
    var search = /([^&=]+)=?([^&]*)/g
    var params = {}

    q = q.replace(/^\?/, '');

    while (match = search.exec(q))
      params[decode(match[1])] = decode(match[2]);

    return params;
  }
}


module.exports = util;
