'use strict'


var debounce = require('./debounce');
var $bb = require('./buildbotics');
var notify = require('./notify');


module.exports = {
  replace: true,
  template: '#thing-name-validator-template',
  paramAttributes: ['owner', 'ref'],


  data: function () {
    return {
      newName: '',
      shortName: false,
      spaces: false,
      invalidChars: false,
      valid: false,
      checking: false,
      available: true
    }
  },


  methods: {
    isValid: function (name) {
      this.spaces = !/^[^ ]*$/.test(name);
      this.invalidChars = !this.spaces && !/^[\w_.]*$/.test(name);
      this.shortName = !this.spaces && !this.invalidChars && name.length == 1;

      return name &&
        !this.spaces &&
        !this.invalidChars &&
        !this.shortName
    },


    setValid: function (valid) {
      if (this.valid != valid) {
        this.valid = valid;
        this.$dispatch('thing-name-valid', valid, this.newName, this.ref);
      }
    },


    checkName: debounce(1000, function () {
      if (!this.isValid(this.newName)) {
        this.checking = false;
        return;
      }

      var self = this;
      var url =
        'profiles/' + this.owner + '/things/' + this.newName + '/available';

      $bb.get(url)
        .done(function (data) {self.available = data})

        .fail(function (data, status) {
          notify.error('Failed to check name availability', status);
          self.available = true;
        })

        .always(function () {
          self.checking = false;
          self.setValid(self.isValid(self.newName) && self.available);
        })
    }),


    validate: debounce(250, function (name) {
      this.setValid(false);

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
        this.setValid(false);
        this.validate(name);
        return name;
      }
    }
  }
}
