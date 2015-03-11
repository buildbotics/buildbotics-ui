'use strict'

var $bb = require('./buildbotics');


module.exports = function (target, fields) {
  return {
    data: function () {
      return {
        modified: false
      }
    },


    ready: function () {
      this.initFields();
      this.edit();
    },


    events: {
      'markdown-editor.modified': function (modified) {
        this.$set('modified', modified);
      }
    },


    methods: {
      onProtectedSave: function (fields) {},


      // From protect-changes
      needsSave: function () {return this.modified},


      saveChanges: function (defer) {
        this.save().done(defer.resolve).fail(defer.fail);
      },


      discardChanges: function (defer) {
        this.modified = false;
        defer.resolve();
      },


      changed: function () {
        this.modified = true;
      },


      // From field-editor
      onSave: function (fields) {
        return $.when(this.onProtectedSave)
          .done(function () {
            this.$broadcast('markdown-editor.mark-clean');
            this.modified = false
          }.bind(this))
      },


      // From field-editor
      onCancel: function () {
        this.edit();
        this.modified = false;
      }
    },


    mixins: [
      require('./field-editor')(target, fields),
      require('./protect-changes')
    ]
  }
}
