'use strict'


module.exports = {
  data: function () {
    return {
      active: false,
      buttons: [
        {label: 'Cancel', response: 'cancel', icon: 'times'},
        {label: 'Login', response: 'login', icon: 'sign-in', klass: 'success'},
      ]
    }
  },


  events: {
    'logged-in': function () {this.update()},
    'logged-out': function () {this.$set('active', false)},

    'modal-response': function (button) {
      if (button == 'login') require('./app').initiateLogin();
      return false; // Cancel event propagation
    }
  },


  ready: function () {this.update()},


  methods: {
    isActive: function () {return false;},
    setActive: function (active) {},


    updateUserList: function (list) {
      var app = require('./app');
      var user = app.getUser();

      if (user && list)
        if (this.isActive()) {
          // Add the current user if necessary
          var found = false;
          for (var i = 0; i < list.length; i++)
            if (list[i].name == user.name) {
              found = true;
              break;
            }

          if (!found) list.push(user);

        } else
          // Remove the current user if necessary
          for (var i = 0; i < list.length; i++)
            if (list[i].name == user.name)
              list.splice(i);

      this.update()
    },


    update: function () {
      this.$set('active', this.isActive());
    },


    toggle: function () {
      if (!require('./app').isAuthenticated()) {
        this.$broadcast('modal-show-login');
        return;
      }

      var self = this;
      $.when(this.setActive(!this.active)).then(function () {
        self.update();
      })
    }
  }
}
