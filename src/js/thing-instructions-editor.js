'use strict'

var $bb = require('./buildbotics');
var notify = require('./notify');


module.exports = {
  replace: true,
  template: '#thing-instructions-editor-template',
  paramAttributes: ['thing', 'media'],


  methods: {
    // From text-field-editor
    getText: function () {return this.thing.instructions},


    save: function (text, defer) {
      $bb.put(this.$parent.getAPIURL(), {instructions: text})
        .done(function () {
          this.$set('thing.instructions', text);
          if (typeof defer != 'undefined') defer.resolve();

        }.bind(this)).fail(function () {
          if (typeof defer != 'undefined') defer.reject();
          notify.error('Failed to save instructions');
        })
    }
  },


  mixins: [require('./text-field-editor')]
}
