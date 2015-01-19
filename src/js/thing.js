var mixin = {
  data: function () {
    return {
      editing: {},
      backup: {}
    }
  },

  methods: {
    get: function (field) {
      return this.$get(this.edit_prefix + field);
    },

    edit: function (field) {
      if (this.editing[field]) return;
      this.$set('editing.' + field, true);
      this.backup[field] = this.get(field);
    },

    save: function (field) {
      if (!this.editing[field]) return;
      this.$set('editing.' + field, false);
      if (this.get(field) != this.backup[field])
        this.onSave(field, this.get(field));
    },

    cancel: function (field) {
      if (!this.editing[field]) return;
      this.$set('editing.' + field, false);
      this.$set(this.edit_prefix + field, this.backup[field]);
    }
  }
}


module.exports = {
  template: '#thing-template',

  data: function () {
    return {
      edit_prefix: 'thing.',
      thing: {},
      images: [],
      stars: [],
      tags: []
    }
  },

  compiled: function () {
    var self = this;
    var data = require('./app').thingData;

    $.each(data, function (key, value) {self.$set(key, value);});

    if (this.thing.tags)
      this.tags = this.thing.tags.split(',')
      .filter(function (e) {return e})

    this.url = 'profiles/' + this.thing.owner + '/things/' + this.thing.name;
  },

  computed: {
    isOwner: function () {
      return this.thing && require('./app').isUser(this.thing.owner);
    }
  },

  methods: {
    onSave: function (field, value) {
      var data = {};
      data[field] = value;

      $bb.put(this.url, data)
        .error(function (data, status) {
          console.error('Save failed', 'Failed to save ' + field +
                        '\n' + status)
        });
    }
  },

  mixins: [mixin]
}
