'use strict'

var $bb = require('./buildbotics');

var subsections = 'overview instructions files comments';
var fields = 'title url license tags description';


module.exports = {
  template: '#thing-template',


  created: function () {
    var self = this;
    var app = require('./app');

    // Import thing data
    $.each(app.thingData, function (key, value) {self.$set(key, value);});

    // Instructions
    this.$set('thing.description', this.thing.description || '');

    // Get licenses
    this.$set('licenses', app.licenses);

    // Split tags
    if (this.thing.tags)
      this.thing.tags = this.thing.tags.split(',')
      .filter(function (tag) {return tag})
      .map(function (tag) {return tag.replace(/^#/, '')})
    else this.thing.tags = []

    // Listen file manager events
    this.$on('file-manager-before-upload', function (file, done) {
      var data = {
        type: file.type,
        size: file.size,
        display: /^image\//.test(file.type)
      }

      $bb.put(this.getAPIURL() + '/files/' + file.name, data)
        .success(function (data) {done(true, data);})

        .error(function (data, status) {
          app.error('Failed to upload file ' + file.name, status);
          done(false);
        })

      return false; // Cancel event propagation
    });


    this.$on('file-manager-delete', function (file, done) {
      $bb.delete(this.getAPIURL() + '/files/' + file.name)
        .success(function () {done(true)})

        .error(function (data, status) {
          app.error('Failed to delete file ' + file.name, status)
          done(false);
        });

      return false; // Cancel event propagation
    });
  },


  computed: {
    media: function () {
      return this.files.filter(function (file) {return file.display});
    }
  },


  methods: {
    isOwner: function () {
      return require('./app').isUser(this.thing.owner);
    },


    publish: function () {
      var self = this;
      $bb.put(this.getAPIURL(), {publish: true})
        .success(function () {self.thing.published = true})
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
    }
  },


  mixins: [
    require('./subsections')('thing', subsections),
    require('./field-editor')('thing', fields)
  ]
}
