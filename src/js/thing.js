'use strict'

var $bb = require('./buildbotics');
var page = require('page.min');

var subsections = 'overview instructions files comments maintenance';
var fields = 'title url license tags instructions';


function isImage(type) {
  return /^image\/((png)|(gif)|(jpeg)|(svg)|(bmp))/.test(type);
}


module.exports = {
  template: '#thing-template',


  data: function  () {
    return {
      newName: '',
      nameIsValid: false
    }
  },


  events: {
    // Listen file manager events
    'file-manager-before-upload': function (file, done) {
      var data = {
        type: file.type,
        size: file.size,
        display: isImage(file.type)
      }

      $bb.put(this.getAPIURL() + '/files/' + file.name, data)
        .success(function (data) {done(true, data);})

        .error(function (data, status) {
          app.error('Failed to upload file ' + file.name, status);
          done(false);
        })

      return false; // Cancel event propagation
    },


    'file-manager-delete': function (file, done) {
      $bb.delete(this.getAPIURL() + '/files/' + file.name)
        .success(function () {done(true)})

        .error(function (data, status) {
          app.error('Failed to delete file ' + file.name, status)
          done(false);
        });

      return false; // Cancel event propagation
    },


    // Listen to is-owner events
    'is-owner': function (isOwner) {
      this.$broadcast('file-manager-can-edit', isOwner);
    },


    'modal-response': function (button) {
      if (button == 'delete') this.delete();
      if (button == 'rename') this.rename();
      return false; // Cancel event propagation
    },


    'thing-name-valid': function (valid, name) {
      this.nameIsValid = valid;
      this.newName = name;
    }
  },


  created: function () {
    var self = this;
    var app = require('./app');

    // Import thing data
    $.each(app.thingData, function (key, value) {self.$set(key, value);});
    this.initFields();

    // Get licenses
    this.$set('licenses', app.licenses);

    // Split tags
    if (typeof this.thing.tags == 'string')
      this.thing.tags = this.thing.tags.split(',')
      .filter(function (tag) {return tag})
      .map(function (tag) {return tag.replace(/^#/, '')})

    else if (!this.thing.tags) this.thing.tags = []
  },


  ready: function () {
    if (/#?comment-\d+/.test(location.hash)) location.hash = location.hash;
  },


  computed: {
    media: function () {
      return this.files.filter(function (file) {
        return file.display && isImage(file.type);
      });
    }
  },


  methods: {
    // From login-listener
    getOwner: function () {
      return this.thing.owner;
    },


    publish: function () {
      var self = this;
      $bb.put(this.getAPIURL(), {publish: true})
        .success(function () {self.$set('thing.published', true)})
    },


    tag: function() {
      alert('TODO');
    },


    star: function() {
      alert('TODO');
    },


    saveTags: function (tags) {
      var promises = [];

      // Find added tags
      var tag = [];
      for (var i = 0; i < tags.length; i++)
        if (this.thing.tags.indexOf(tags[i]) == -1)
          tag.push(tags[i]);

      if (tag.length)
        promises.push($bb.put(this.getAPIURL() + '/tags/' + tag.join()));

      // Find removed tags
      var untag = [];
      for (var i = 0; i < this.thing.tags.length; i++)
        if (tags.indexOf(this.thing.tags[i]) == -1)
          untag.push(this.thing.tags[i]);

      if (untag.length)
        promises.push($bb.delete(this.getAPIURL() + '/tags/' + untag.join()));

      return promises;
    },


    onSave: function (fields) {
      var promises = [];

      // Save any tags
      if (fields.tags) {
        promises.push(this.saveTags(fields.tags));
        fields.tags = undefined;
      }

      // Save other fields
      promises.push($bb.put(this.getAPIURL(), fields));

      return promises;
    },


    getAPIURL: function () {
      return 'profiles/' + this.thing.owner + '/things/' + this.thing.name;
    },


    askRename: function () {
      this.$broadcast('modal-show-rename-thing');
    },


    rename: function () {
      var self = this;
      var app = require('./app');
      var starred = app.isStarred(this.thing.owner, this.thing.name);

      $bb.put(this.getAPIURL() + '/rename', {name: this.newName})
        .success(function () {
          app.setStarred(self.thing.owner, self.newName, starred);
          page('/' + self.thing.owner + '/' + self.newName);

        }).error(function () {
          require('./app').error('Failed to rename project');
        })
    },


    askDelete: function () {
      this.$broadcast('modal-show-delete-thing');
    },


    delete: function () {
      var self = this;

      $bb.delete(this.getAPIURL()).success(function () {
        page('/' + self.thing.owner);
      })
    }
  },


  mixins: [
    require('./subsections')('thing', subsections),
    require('./field-editor')('thing', fields),
    require('./login-listener')
  ]
}
