'use strict'


var $bb = require('./buildbotics');
var notify = require('./notify');


module.exports = {
  replace: true,
  template: '#followers-template',
  paramAttributes: ['profile', 'followers', 'button'],

  data: function () {
    return {
      profile: {}
    }
  },


  watch: {
    'profile.followers': function () {this.updateUserList(this.followers)}
  },


  methods: {
    // From login-listener
    getOwner: function () {
      return this.profile.name;
    },


    // From widget
    isActive: function () {
      return require('./app').isFollowing(this.profile.name);
    },


    setActive: function (active) {
      var app = require('./app');
      var profile = this.profile;
      var name = profile.name;
      var url = 'profiles/' + name + '/follow';

      if (app.getUser().name == name) {
        notify.error('You cannot follow yourself.');
        var defer = $.Deferred();
        defer.reject();
        return defer.promise();
      }

      if (active) return $bb.put(url)
        .done(function () {
          profile.followers += 1;
          app.setFollowing(name, true);
        })

      else return $bb.delete(url)
        .done(function () {
          profile.followers -= 1;
          app.setFollowing(name, false);
        })
    }
  },


  mixins: [
    require('./widget'),
    require('./login-listener')()
  ]
}
