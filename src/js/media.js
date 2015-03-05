'use strict'

var util = require('./util');


module.exports = {
  replace: true,
  template: '#media-template',

  computed: {
    isImage: function () {return util.isImage(this.type);},
    isVideo: function () {return util.isVideo(this.type);}
  }
}
