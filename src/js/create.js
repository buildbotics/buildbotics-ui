'use strict'


var debounce = require('./debounce');
var $bb = require('./buildbotics');
var page = require('page.min');


module.exports = {
  template: '#create-template',


  data: function () {
    return {
      name: '',
      title: '',
      shortName: false,
      spaces: false,
      invalidChars: false,
      valid: false,
      checking: false,
      available: true
    }
  },


  methods: {
    submit: function () {
      var thing = this.getThingPath();

      var data = {
        type: 'project',
        title: this.title || this.name
      }

      $bb.put(this.getAPIURL(), data)
        .success(function (data) {page(thing)})
        .error(function (data, status) {
          app.error('Failed to create ' + thing, status);
        })
    },


    isValid: function (name) {
      this.spaces = !/^[^ ]*$/.test(name);
      this.invalidChars = !this.spaces && !/^[\w_.]*$/.test(name);
      this.shortName = !this.spaces && !this.invalidChars && name.length == 1;

      return name &&
        !this.spaces &&
        !this.invalidChars &&
        !this.shortName
    },


    getUserName: function () {
      return require('./app').getUser().name;
    },


    getAPIURL: function () {
      return 'profiles/' + this.getUserName() + '/things/' + this.name;
    },


    getThingPath: function () {
      return '/' + this.getUserName() + '/' + this.name;
    },


    checkName: debounce(1000, function () {
      if (!this.isValid(this.name)) {
        this.checking = false;
        return;
      }

      var self = this;

      $bb.get(this.getAPIURL() + '/available')
        .success(function (data) {self.available = data})

        .error(function (data, status) {
          require('./app').error('Failed to check name availability', status);
          self.available = true;
        })

        .always(function () {
          self.checking = false;
          self.valid = self.isValid(self.name) && self.available;
        })
    }),


    validate: debounce(250, function (name) {
      this.valid = false;

      if (this.isValid(name)) {
        this.checking = true;
        this.checkName();

      } else this.checking = false;
    })
  },


  filters: {
    nameValidator: {
      write: function (name) {
        this.available = true;
        this.valid = false;
        this.validate(name);
        return name;
      }
    }
  }
}
