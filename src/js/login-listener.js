'use strict'


module.exports = function (perms) {
  perms = perms || {};

  function evalPerm(perm, user, isOwner) {
    if (typeof user.auth == 'undefined') return false;
    if (user.auth.indexOf('admin') != -1) return true;

    var result = perm(isOwner)

    if (typeof result == 'string') {
      var app = require('./app');
      return app.permissions[result] <= user.points;
    }

    return result;
  }


  return {
    data: function () {
      return {
        user: {},
        isOwner: false,
        isLoggedIn: false
      }
    },


    events: {
      'logged-in': function (user) {this.loginListenerUpdate(user)},
      'logged-out': function () {this.loginListenerUpdate({})}
    },


    ready: function () {
      this.loginListenerUpdate(require('./app').getUser());
    },


    methods: {
      getOwner: function () {return ''},


      loginListenerUpdate: function (user) {
        this.$set('user', user);
        this.$set('isLoggedIn', typeof user.name != 'undefined')
        this.$set('isOwner', user.name == this.getOwner())

        for (var name in perms)
          this.$set(name, evalPerm(perms[name], user, this.isOwner));
      }
    }
  }
}
