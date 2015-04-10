'use strict'

var page = require('page')
var $bb = require('./buildbotics')


module.exports = {
  template: '#dashboard-template',


  data: function () {
    return {
      profile: {},
      things: []
    }
  },


  events: {
    'logged-in': function (user) {this.update(user)}
  },


  ready: function () {this.update(this.getUser())},


  methods: {
    update: function (user) {
      if (!user.name) return;

      // Profile
      this.$set('profile', user);

      // Creations
      this.$set('things', this.getUserData().things);

      // Events
      var config = {
        data: {
          subject: user.name,
          following: true,
          limit: 20
        }
      }

      $bb.get('events', config)
        .done(function (data) {
          this.$set('events', data);
        }.bind(this))
    },


    isAuthenticated: function () {
      return require('./app').isAuthenticated();
    },


    login: function () {
      require('./app').initiateLogin();
    },


    getUser: function () {
      return require('./app').getUser();
    },


    getUserData: function () {
      return require('./app').getUserData();
    },


    editProfile: function () {
      page('/' + this.getUser().name + '#edit-details');
    },


    create: function () {
      page('/create');
    },


    openProject: function (name) {
      page('/' + this.getUser().name + '/' + name);
    }
  }
}
