'use strict'

var $bb = require('./buildbotics');

var fields = 'fullname location url';


module.exports = {
  replace: true,
  template: '#profile-details-editor-template',
  paramAttributes: ['profile'],


  methods: {
    // From protected-field-editor
    onProtectedSave: function (fields) {
      return $bb.put('profiles/' + this.profile.name, fields)
        .fail(function () {notify.error('Failed to save details')})
    }
  },


  mixins: [
    require('./protected-field-editor')('profile', fields)
  ]
}
