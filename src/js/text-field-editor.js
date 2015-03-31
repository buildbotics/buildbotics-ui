'use strict'


module.exports = {
  data: function () {
    return {
      text: '',
      modified: false,
      editorButtons: [
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
      if (!this.modified) return false;

      switch (response) {
      case 'save': this.saveChanges(); break;
      case 'cancel': this.cancel(); break;
      }

      this.$broadcast('markdown-editor.fullscreen', false);

      return false;
    }
  },


  ready: function () {
    this.$set('text', this.getText() || '');
  },


  methods: {
    getText: function () {return ''},
    save: function (defer) {if (defer) defer.reject()},


    // From protect-changes
    needsSave: function () {return this.modified},


    saveChanges: function (defer) {
      defer = defer || $.Deferred();
      defer.done(this.markClean);
      this.save(this.text, defer);
    },


    discardChanges: function (defer) {
      this.markClean();
      defer.resolve();
    },


    markClean: function () {
      this.$broadcast('markdown-editor.mark-clean');
    },


    cancel: function () {
      this.$set('text', this.getText() || '');
      this.markClean();
    }
  },


  mixins: [require('./protect-changes')]
}
