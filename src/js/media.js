'use strict'


module.exports = {
  inherit: true,
  replace: true,
  template: '#media-template',


  data: function () {
    return {
      util: require('./util'),
    }
  }
}
