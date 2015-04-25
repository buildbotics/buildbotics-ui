'use strict'


module.exports = {
  data: function () {
    return {
      user: {},
      isOwner: false,
      isLoggedIn: false
    }
  },


  events: {
    'logged-in': function (user) {
      this.$set('user', user);
      this.setIsOwner(user.name == this.getOwner())
      this.$set('isLoggedIn', true)
    },


    'logged-out': function () {
      this.$set('user', {});
      this.setIsOwner(false)
      this.$set('isLoggedIn', false)
    }
  },


  ready: function () {
    var user = require('./app').getUser();

    this.$set('user', user);
    this.setIsOwner(user.name == this.getOwner())
    this.$set('isLoggedIn', typeof user.name != 'undefined')
  },


  methods: {
    getOwner: function () {return ''},


    setIsOwner: function (isOwner) {
      if (this.isOwner == isOwner) return;
      this.$set('isOwner',  isOwner);
      this.$emit('is-owner', this.isOwner);
      this.$broadcast('is-owner', this.isOwner);
    }
  }
}
