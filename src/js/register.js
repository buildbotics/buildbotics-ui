'use strict'


var debounce = require('./debounce');
var $bb = require('./buildbotics');
var page = require('page');
var notify = require('./notify');


module.exports = {
  template: '#register-template',


  data: function () {
    return {
      name: '',
      suggestions: [],
      spaces: false,
      shortName: false,
      invalidChars: false,
      available: true,
      valid: false,
      checking: false,
      agree: false
    }
  },


  compiled: function () {
    var self = this;

    $bb.get('suggest')
      .done(function (suggestions) {
        self.suggestions = suggestions;
        if (!self.name && suggestions.length)
          self.setName(suggestions[0]);
      })
      .fail(function (status) {
        page('/login');
      })
  },


  filters: {
    nameValidator: {
      write: function (name) {
        name = name.trim();

        if (name != this.name) {
          this.available = true;
          this.valid = false;
          this.validate(name);
        }

        return name;
      }
    }
  },


  methods: {
    submit: function () {
      var self = this;
      var name = this.name.trim();

      $bb.put('profiles/' + name + '/register')
        .done(function () {
          require('./app').login();
          page('/dashboard');
        })
        .fail(function (status) {
          notify.error('Failed to register "' + name + '"', status);
        })
    },


    setName: function (name) {
      this.name = name;
      this.valid = this.isValid(name);
      this.checking = false;
    },


    isValid: function (name) {
      var name = name.trim();
      var user = require('./app').getUser();

      this.spaces = !/^[^ ]*$/.test(name);
      this.invalidChars = !this.spaces && !/^[\w.]*$/.test(name);
      this.shortName = !this.spaces && !this.invalidChars && name.length == 1;

      return name &&
        !this.spaces &&
        !this.invalidChars &&
        !this.shortName &&
        !this.isLoggedIn;
    },


    validate: debounce(250, function (name) {
      this.valid = false;

      if (this.isValid(name)) {
        this.checking = true;
        this.checkName();

      } else this.checking = false;
    }),


    checkName: debounce(1000, function () {
      if (!this.isValid(this.name)) {
        this.checking = false;
        return;
      }

      var self = this;

      $bb.get('profiles/' + this.name.trim() + '/available')
        .done(function (data) {self.available = data})

        .fail(function (data, status) {
          notify.error('Failed to check name availability', status);
          self.available = true;
        })

        .always(function () {
          self.checking = false;
          self.valid = self.isValid(self.name) && self.available;
        })
    })
  },


  mixins: [require('./login-listener')()]
}
