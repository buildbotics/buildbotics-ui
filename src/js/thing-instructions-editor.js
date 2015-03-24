'use strict'

var notify = require('./notify');


module.exports = {
  replace: true,
  template: '#thing-instructions-editor-template',
  paramAttributes: ['thing'],


  data: function () {
    return {
      edit_instructions: '',
      modified: false
    }
  },


  events: {
    'markdown-editor.modified': function (modified) {
      this.modified = modified;
    }
  },


  ready: function () {
    this.$set('edit_instructions', this.thing.instructions || '');
  },


  methods: {
    // From protect-changes
    needsSave: function () {return this.modified},


    saveChanges: function (defer) {
      this.save(defer);
    },


    discardChanges: function (defer) {
      this.markClean();
      defer.resolve();
    },


    markClean: function () {
      this.$broadcast('markdown-editor.mark-clean');
    },


    save: function (defer) {
      var data = {instructions: this.edit_instructions};

      $bb.put(this.$parent.getAPIURL(), data).done(function () {
        this.$set('thing.instructions', this.edit_instructions);
        if (typeof defer != 'undefined') defer.resolve();
        this.markClean();

      }.bind(this)).fail(function () {
        if (typeof defer != 'undefined') defer.reject();
        notify.error('Failed to save instructions');
      })
    }
  },


  mixins: [require('./protect-changes')]
}
