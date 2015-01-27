'use strict'


module.exports = {
  data: function () {
    return {
      isOwner: false
    }
  },


  created: function () {
    var self = this;

    this.$on('logged-in', function (user) {
      this.setIsOwner(user.name == self.getOwner())
    })

    this.$on('logged-out', function () {
      this.setIsOwner(false)
    })
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
