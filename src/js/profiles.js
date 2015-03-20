'use strict'


module.exports = {
  replace: true,
  template: '#profiles-template',
  paramAttributes: ['profiles', 'small'],


  ready: function () {
    $(this.$el).addClass('profiles-' + (this.small ? 'small' : 'large'));
  }
}
