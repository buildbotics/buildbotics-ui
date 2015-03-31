'use strict'

var $bb = require('./buildbotics');
var notify = require('./notify');


module.exports = {
  replace: true,
  template: '#profile-bio-editor-template',
  paramAttributes: ['profile'],


  methods: {
    // From text-field-editor
    getText: function () {return this.profile.bio},


    save: function (text, defer) {
      $bb.put('profiles/' + this.profile.name, {bio: text})
        .done(function () {
          this.$set('profile.bio', text);
          if (typeof defer != 'undefined') defer.resolve();

        }.bind(this)).fail(function () {
          if (typeof defer != 'undefined') defer.reject();
          notify.error('Failed to save bio');
        })
    }
  },


  mixins: [require('./text-field-editor')]
}
