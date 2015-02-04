'use strict'

var $bb = require('./buildbotics');


module.exports = {
  template: '#tag-template',

  data: function () {
    return {
      tag: '',
      things: [],
      loaded: false
    }
  },


  compiled: function () {
    var self = this;
    var app = require('./app');

    this.tag = app.tag;

    $bb.get('tags/' + app.tag, {data: {limit: 100}}).done(function (things) {
      self.things = things;
      self.loaded = true;
    })
  }
}
