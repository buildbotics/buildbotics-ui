'use strict'

var page = require('page')


module.exports = {
  template: '#dashboard-template',


  data: function () {
    return {
    }
  },


  methods: {
    isAuthenticated: function () {
      return require('./app').isAuthenticated();
    },


    login: function () {
      require('./app').initiateLogin();
    },


    getUser: function () {
      return require('./app').getUser();
    },


    editProfile: function () {
      page('/' + this.getUser().name + '#edit-details');
    }
  }
}
