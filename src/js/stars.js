'use strict'

var $bb = require('./buildbotics');


module.exports = {
  replace: true,
  template: '#stars-template',
  paramAttributes: ['thing', 'stars', 'button'],


  data: function () {
    return {
      thing: {}
    }
  },


  watch: {
    'thing.stars': function () {this.updateUserList(this.stars)}
  },


  methods: {
    isActive: function () {
      return require('./app').isStarred(this.thing.owner, this.thing.name);
    },


    setActive: function (active) {
      var app = require('./app');
      var thing = this.thing;
      var owner = thing.owner;
      var name = thing.name;
      var url = 'profiles/' + owner + '/things/' + name + '/star';

      if (active) return $bb.put(url)
        .done(function () {
          thing.stars += 1;
          app.setStarred(owner, name, true);
        })

      else return $bb.delete(url)
        .done(function () {
          thing.stars -= 1;
          app.setStarred(owner, name, false);
        })
    }
  },


  mixins: [require('./widget')]
}
