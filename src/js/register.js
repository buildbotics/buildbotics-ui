module.exports = {
  template: '#register-template',

  data: function () {
    return {
      name: '',
      suggestions: [],
      valid: {
        chars: true,
        start: true,
        available: true,
        loggedout: !$bb.user.authenticated,
        valid: false
      },
      checking: false
    }
  },

  compiled: function () {
    var self = this;

    $bb.get('suggest')
      .success(function (suggestions) {
        self.suggestions = suggestions;
        if (!self.name && suggestions.length)
          self.setName(suggestions[0], true);
      })
  },

  methods: {
    submit: function () {
    },

    setName: function (name, available) {
      this.name = this.validateName(name, available);
    },

    validateName: function (orig, available) {
      var name = orig.trim();

      this.valid.chars = !name || /^[\w.]*$/.test(name);
      this.valid.start = !name || /^[a-zA-Z0-9]/.test(name);
      this.valid.available = true;
      this.valid.valid = !!name && this.valid.chars && this.valid.start &&
        this.valid.loggedout;

      // Clear old timeout
      if (this._valid_timeout) clearInterval(this._valid_timeout);

      // Check if name is available
      if (this.valid.valid && !available) {
        var self = this;

        this._valid_timeout = setTimeout(function () {
          delete this._valid_timeout;

          $bb.get('profiles/' + name + '/available')
            .success(function (result) {
              self.valid.valid = self.valid.available = result;
              self.checking = false;

            }).error(function () {
              self.valid.available = false;
              self.checking = false;
            })
        }, 1000);

        this.valid.valid = false;
        this.checking = true;

      } else this.checking = false;

      return orig
    }
  },

  filters: {
    nameValidator: {
      write: function (name) {return this.validateName(name)}
    }
  }
}
