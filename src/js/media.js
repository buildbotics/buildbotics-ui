'use strict'


module.exports = {
  replace: true,
  template: '#media-template',

  computed: {
    'isImage': function () {
      return /^image\/((png)|(gif)|(jpeg)|(svg)|(bmp))/.test(this.type);
    }
  }
}
