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
      var self = this;

      // Add editor variables
      fields.forEach(function (field) {
        self.$set(prefix + field, '');
      })
    },


    methods: {
      onEdit: function () {},
      onSave: function () {},
      onCancel: function () {},


      initFields: function () {
        var self = this;

        fields.forEach(function (field) {
          self.$set(target + '.' + field, self[target][field] || '');
        })
      },


      edit: function () {
        var self = this;

        // Set editor variables
        fields.forEach(function (field) {
          self.$set(prefix + field, copy(self[target][field]));
        })

        this.onEdit();
        this.editing = true;
      },


      save: function () {
        var self = this;

        // Find Changes
        var changes = {};
        var changed = false;

        fields.forEach(function (field) {
          if (!equal(self[prefix + field], self[target][field])) {
            changes[field] = copy(self[prefix + field]);
            changed = true;
          }
        })

        // Abort if nothing changed
        if (!changed) {
          this.editing = false;
          return;
        }

        // Do save callback
        var self = this;
        $.when.apply($, this.onSave(changes)).then(function () {
          fields.forEach(function (field) {
            self[target][field] = copy(self[prefix + field]);
          })

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
