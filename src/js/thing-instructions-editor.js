'use strict'

var notify = require('./notify');


module.exports = {
  replace: true,
  template: '#thing-instructions-editor-template',
  paramAttributes: ['thing', 'media'],


  data: function () {
    return {
      edit_instructions: '',
      modified: false,
      instructionButtons: [
        {label: 'Cancel', icon: 'times', response: 'cancel',
         title: 'Discard changes.', klass: 'disabled'},
        {label: 'Save', icon: 'save', response: 'save',
         klass: 'success disabled', title: 'Save changes.'}
      ]
    }
  },


  events: {
    'markdown-editor.modified': function (modified) {
      this.modified = modified;

      var save = $(this.$el).find('.markdown-editor .actions button');
      if (modified) save.removeClass('disabled');
      else save.addClass('disabled');

      return false;
    },


    'markdown-editor.response': function (response) {
      switch (response) {
      case 'save':
        if (!this.modified) return false;
        this.save();
        break;

      case 'cancel':
        this.cancel();
        break;
      }

      this.$broadcast('markdown-editor.fullscreen', false);

      return false;
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


    cancel: function () {
      this.$set('edit_instructions', this.thing.instructions || '');
      this.markClean();
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
