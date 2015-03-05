'use strict'

var $bb = require('./buildbotics');

var fields = 'title url license tags';


module.exports = {
  template: '#thing-details-editor-template',
  paramAttributes: ['thing'],


  data: function () {
    return {
      modified: false
    }
  },


  ready: function () {
    this.initFields();
    this.edit();

    // Get licenses
    this.$set('licenses', require('./app').licenses);
  },


  methods: {
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


    saveTags: function (tags) {
      var promises = [];

      // Find added tags
      var tag = [];
      for (var i = 0; i < tags.length; i++)
        if (this.thing.tags.indexOf(tags[i]) == -1)
          tag.push(tags[i]);

      if (tag.length)
        promises.push($bb.put(this.thing.api_url + '/tags/' + tag.join()));

      // Find removed tags
      var untag = [];
      for (var i = 0; i < this.thing.tags.length; i++)
        if (tags.indexOf(this.thing.tags[i]) == -1)
          untag.push(this.thing.tags[i]);

      if (untag.length)
        promises.push($bb.delete(this.thing.api_url + '/tags/' + untag.join()));

      return promises;
    },


    // From field-editor
    onSave: function (fields) {
      var promises = [];

      // Save any tags
      if (fields.tags) {
        promises = promises.concat(this.saveTags(fields.tags));
        delete fields.tags;
      }

      // Save other fields
      if (JSON.stringify(fields) != '{}')
        promises.push($bb.put(this.thing.api_url, fields));

      return $.when.apply($, promises).done(function () {
        this.modified = false;

      }.bind(this)).fail(function () {
        notify.error('Failed to save details');
      })
    },


    // From field-editor
    onCancel: function () {
      this.edit();
      this.modified = false;
    },


    getLicenseDescription: function (license) {
      if (!this.licenses) return;

      for (var i = 0; i < this.licenses.length; i++) {
        var l = this.licenses[i];

        if (l.name == license)
          return l.description
            .replace('$name', '<a href="' + l.url + '" target="_blank">' +
                     l.name + "</a>");
      }
    }
  },


  mixins: [
    require('./field-editor')('thing', fields),
    require('./protect-changes')
  ]
}
