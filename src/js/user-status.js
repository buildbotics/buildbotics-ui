'use strict'

var perms = {
  isAdmin: function (isOwner) {return false}
}


module.exports = {
  replace: true,
  template: '#user-status-template',


  methods: {
    signIn: function () {require('./app').initiateLogin()},
    signOut: function () {require('./app').logout()}
  },


  mixins: [require('./login-listener')(perms)]
}
