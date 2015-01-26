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
      for (var field in fields)
        this.$set(prefix + field, '');
    },


    methods: {
      onEdit: function () {},
      onSave: function () {},
      onCancel: function () {},


      initFields: function () {
        for (var field in fields)
          this.$set(target + '.' + field, this[target][field] || '');
      },


      edit: function () {
        // Set editor variables
        for (var field in fields)
          this.$set(prefix + field, copy(this[target][field]));

        this.onEdit();
        this.editing = true;
      },


      save: function () {
        // Find Changes
        var changes = {};
        var changed = false;

        for (var field in fields)
          if (!equal(this[prefix + field], this[target][field])) {
            changes[field] = copy(this[prefix + field]);
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
          for (var field in fields)
            self[target][field] = copy(self[prefix + field]);

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
