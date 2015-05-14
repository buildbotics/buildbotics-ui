'use strict'


var debounce = require('./debounce');
var $bb = require('./buildbotics');
var page = require('page');
var notify = require('./notify');


module.exports = {
  template: '#create-template',


  data: function () {
    return {
      name: '',
      valid: false,
      title: ''
    }
  },


  events: {
    'thing-name-valid': function (valid, name) {
      this.valid = valid;
      this.name = name;
    }
  },


  methods: {
    isAuthenticated: function () {
      return require('./app').isAuthenticated();
    },


    login: function () {
      require('./app').initiateLogin();
    },


    submit: function () {
      var thing = '/' + this.getUserName() + '/' + this.name;

      var data = {
        type: 'project',
        title: this.title || this.name
      }

      var url = 'profiles/' + this.getUserName() + '/things/' + this.name;
      $bb.put(url, data)
        .done(function (data) {page(thing + '#edit-files')})
        .fail(function (data, status) {
          notify.error('Failed to create ' + thing, status);
        })
    },


    getUserName: function () {
      return require('./app').getUser().name;
    }
  }
}
