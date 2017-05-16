'use strict'


module.exports = {
  template: '#controller-template',
  mixins: [require('./login-listener')()]
}
