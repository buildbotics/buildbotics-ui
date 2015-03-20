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
  }
}


module.exports = util;
