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
    var self = this;

    this.$on('logged-in', function () {
      self.$set('starred', is_starred(self.thing))
    })
    this.$on('logged-out', function () {self.$set('starred', false)})

    this.$on('modal-response', function (button) {
      if (button == 'login') require('./app').initiateLogin();
      return false; // Cancel event propagation
    })
  },


  ready: function () {this.$set('starred', is_starred(this.thing))},


  methods: {
    toggle: function () {
      if (!require('./app').isAuthenticated()) {
        this.$broadcast('modal-show-login');
        return;
      }

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
