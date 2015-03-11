'use strict'

var $bb = require('./buildbotics');

var fields = 'bio';


module.exports = {
  template: '#profile-bio-editor-template',
  paramAttributes: ['profile'],


  methods: {
    // From protected-field-editor
    onProtectedSave: function (fields) {
      return $bb.put('profiles/' + this.profile.name, fields)
        .fail(function () {notify.error('Failed to save bio')})
    }
  },


  mixins: [
    require('./protected-field-editor')('profile', fields)
  ]
}
