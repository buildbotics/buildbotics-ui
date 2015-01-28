'use strict'


module.exports = {
  data: function () {
    return {
      isOwner: false
    }
  },


  events: {
    'logged-in': function (user) {
      this.setIsOwner(user.name == this.getOwner())
    },

    'logged-out': function () {this.setIsOwner(false)}
  },


  ready: function () {
    this.setIsOwner(require('./app').getUser().name == this.getOwner())
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
