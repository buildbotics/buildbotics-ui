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

    // Get images
    this.images = this.files.filter(function (file) {return file.display});

    // Get licenses
    this.$set('licenses', app.licenses);

    // Split tags
    if (this.thing.tags)
      this.tags = this.thing.tags.split(',')
      .filter(function (e) {return e})

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


  methods: {
    isOwner: function () {
      return require('./app').isUser(this.thing.owner);
    },


    publish: function () {
      alert('TODO');
    },


    tag: function() {
      alert('TODO');
    },


    star: function() {
      alert('TODO');
    },


    onSave: function (fields, accept) {
      $bb.put(this.getAPIURL(), fields).success(accept);
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
