'use strict'


module.exports = function (target, fields) {
  fields = fields.split(' ');
  var prefix = 'edit_';


  return {
    data: function () {
      return {
        editing: false
      }
    },


    created: function () {
      // Add editor variables
      for (var i = 0; i < fields.length; i++)
        this.$set(prefix + fields[i], '');
    },


    methods: {
      onEdit: function () {},
      onSave: function () {},
      onCancel: function () {},


      edit: function () {
        // Set editor variables
        for (var i = 0; i < fields.length; i++)
          this.$set(prefix + fields[i], this[target][fields[i]]);

        this.onEdit();
        this.editing = true;
      },


      save: function () {
        // Find Changes
        var changes = {};
        var changed = false;

        for (var i = 0; i < fields.length; i++)
          if (this[prefix + fields[i]] != this[target][fields[i]]) {
            changes[fields[i]] = this[prefix + fields[i]];
            changed = true;
          }

        // Abort if nothing changed
        if (!changes) {
          this.editing = false;
          return;
        }

        // Do save callback
        var self = this;
        this.onSave(changes, function () {
          for (var i = 0; i < fields.length; i++)
            self[target][fields[i]] = self[prefix + fields[i]];

          self.editing = false;
        });
      },


      cancel: function () {
        this.onCancel();
        this.editing = false;
      }
    }
  }
}
