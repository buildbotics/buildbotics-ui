'use strict'

var $bb = require('./buildbotics');


function is_starred(thing) {
  return require('./app').isStarred(thing.owner, thing.name);
}


function set_starred(thing, starred) {
  return require('./app').setStarred(thing.owner, thing.name, starred);
}


module.exports = {
  template: '#stars-template',
  paramAttributes: ['thing'],

  data: function () {
    return {
      starred: false
    }
  },

  created: function () {
    this.$on('logged-in', function () {this.starred = is_starred(this.thing)})
    this.$on('logged-out', function () {this.starred = false})
  },

  ready: function () {this.starred = is_starred(this.thing)},

  methods: {
    toggle: function () {
      var thing = this.thing;
      var url = 'profiles/' + thing.owner + '/things/' + thing.name + '/star';
      var self = this;

      if (this.starred)
        $bb.delete(url)
        .success(function () {
          thing.stars -= 1;
          self.starred = false;
          set_starred(thing, false);
        })

      else
        $bb.put(url)
        .success(function () {
          thing.stars += 1;
          self.starred = true;
          set_starred(thing, true);
        })
    }
  }
}
