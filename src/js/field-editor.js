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
      fields.forEach(function (field) {
        this.$set(prefix + field, '');
      }.bind(this))
    },


    methods: {
      onEdit: function () {},
      onSave: function () {},
      onCancel: function () {},


      initFields: function () {
        fields.forEach(function (field) {
          this.$set(target + '.' + field, this[target][field] || '');
        }.bind(this))
      },


      edit: function () {
        // Set editor variables
        fields.forEach(function (field) {
          this.$set(prefix + field, copy(this[target][field] || ''));
        }.bind(this))

        this.onEdit();
        this.editing = true;
      },


      save: function () {
        // Find Changes
        var changes = {};
        var changed = false;

        fields.forEach(function (field) {
          if (!equal(this[prefix + field], this[target][field])) {
            changes[field] = copy(this[prefix + field]);
            changed = true;
          }
        }.bind(this))

        // Abort if nothing changed
        if (!changed) {
          this.editing = false;
          return;
        }

        // Do save callback
        return $.when(this.onSave(changes)).done(function () {
          fields.forEach(function (field) {
            this[target][field] = copy(this[prefix + field]);
          }.bind(this))

          this.editing = false;
        }.bind(this));
      },


      cancel: function () {
        this.onCancel();
        this.editing = false;
      }
    }
  }
}
