'use strict'


module.exports = {
  template: '#file-view-template',
  paramAttributes: ['file'],


  data: function () {
    return {
      util: require('./util')
    }
  }
}
