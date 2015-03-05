'use strict'


module.exports = {
  methods: {
    // From protect-page
    canLeave: function () {return !this.needsSave()},
    onLeave: function (response, defer) {
      switch (response) {
      case 'discard': this.discardChanges(defer); break;
      case 'save': this.saveChanges(defer); break;
      }
    },
    

    needsSave: function () {return false},
    saveChanges: function (defer) {defer.resolve()},
    discardChanges: function (defer) {defer.resolve()},
  },


  mixins: [
    require('./protect-page')({
      unload: {
        message: 'You have unsaved changes.  Are you sure you want to leave?'
      },

      leave: {
        type: 'question',
        title: 'Save changes?',
        body: 'There are unsaved changes.  Would you like to save?',
        buttons: [
          {label: 'Cancel', icon: 'times'},
          {label: 'Discard', icon: 'trash-o', response: 'discard'},
          {label: 'Save', icon: 'floppy-o', klass: 'success', response: 'save'}
        ]
      }
    })
  ]
}
