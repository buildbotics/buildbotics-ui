'use strict'


module.exports = {
  data: function () {
    return {
      active: false
    }
  },


  created: function () {
    var self = this;

    this.$on('logged-in', function () {self.update()})
    this.$on('logged-out', function () {self.$set('active', false)})

    this.$on('modal-response', function (button) {
      if (button == 'login') require('./app').initiateLogin();
      return false; // Cancel event propagation
    })
  },


  ready: function () {this.update()},


  methods: {
    isActive: function () {return false;},
    setActive: function (active) {},


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
