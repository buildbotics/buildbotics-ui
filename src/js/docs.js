'use strict'


module.exports = {
  inherit: true,
  template: '#docs-template',


  data: function () {
    return {
      title: '',
      content: ''
    }
  },


  compiled: function () {
    var app = require('./app');
    this.unwatch = app.$watch('docContent', this.update, false, true);
  },


  beforeDestroy: function () {
    this.unwatch();
  },


  methods: {
    update: function (content) {
      try {
        var re = /^<h1[^>]*>(.*)<\/h1>([\s\S]*)$/;
        var m = re.exec(content);
        this.title = m[1];
        this.content = m[2];

      } catch (e) {
        this.title = 'Not found';
        this.content = '<h1>Document not found!</h1>';
      }
    }
  }
}
