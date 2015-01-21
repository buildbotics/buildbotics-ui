'use strict'

function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
}


function equal(o1, o2) {
  return JSON.stringify(o1) == JSON.stringify(o2);
}


function copy(o) {
  if (isArray(o)) return [].concat(o);
  if (typeof o == 'object') return $.extend({}, o);
  return o;
}


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
          this.$set(prefix + fields[i], copy(this[target][fields[i]]));

        this.onEdit();
        this.editing = true;
      },


      save: function () {
        // Find Changes
        var changes = {};
        var changed = false;

        for (var i = 0; i < fields.length; i++)
          if (!equal(this[prefix + fields[i]], this[target][fields[i]])) {
            changes[fields[i]] = copy(this[prefix + fields[i]]);
            changed = true;
          }

        // Abort if nothing changed
        if (!changed) {
          this.editing = false;
          return;
        }

        // Do save callback
        var self = this;
        $.when(this.onSave(changes)).then(function () {
          for (var i = 0; i < fields.length; i++)
            self[target][fields[i]] = copy(self[prefix + fields[i]]);

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
