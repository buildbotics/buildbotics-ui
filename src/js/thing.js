'use strict'

var $bb = require('./buildbotics');
var page = require('page');
var notify = require('./notify');
var util = require('./util');

var subsections = 'view edit-files edit-instructions edit-details dangerous';
var perms = {
  canEdit: function (isOwner) {return isOwner || 'edit-things'},
  canPublish: function (isOwner) {return isOwner}
}

var lastEditSubsection;


module.exports = {
  template: '#thing-template',


  components: {
    'thing-license': {
      replace: true,
      inherit: true,
      template: '#thing-license-template'
    },


    'thing-details-editor': require('./thing-details-editor'),
    'thing-instructions-editor': require('./thing-instructions-editor')
  },


  data: function  () {
    return {
      util: util,
      newName: '',
      nameIsValid: false,
      viewSections: 'instructions downloads comments'.split(' '),
      media: [],
      downloads: []
    }
  },


  watch: {
    files: function () {this.updateFiles()},


    subsection: function (subsection) {
      if (subsection != 'view') lastEditSubsection = subsection;
    }
  },


  events: {
    'file-manager.before-upload': function (file, done) {
      var data = {
        type: file.type,
        size: file.size,
        visibility: util.isMedia(file.type) ? 'display' : 'download'
      }

      file.visibility = data.visibility;

      $bb.post(this.getAPIURL() + '/files/' + file.name, data)
        .done(function (data) {done(true, data);})

        .fail(function (data, status) {
          notify.error('Failed to upload file.', status);
          done(false);
        })

      return false; // Cancel event propagation
    },


    'file-manager.after-upload': function (file, done) {
      $bb.put(this.getAPIURL() + '/files/' + file.name + '/confirm')
        .done(function (data) {done(true);})

        .fail(function (data, status) {
          notify.error('Failed to upload file.', status);
          done(false);
        })

      return false; // Cancel event propagation
    },


    'file-manager.up': function (file, done) {
      $bb.post(this.getAPIURL() + '/files/' + file.name + '/up')
        .done(function () {done(true)})

        .fail(function (data, status) {
          notify.error('Failed to move file up.', status)
          done(false);
        });

      return false; // Cancel event propagation
    },


    'file-manager.down': function (file, done) {
      $bb.post(this.getAPIURL() + '/files/' + file.name + '/down')
        .done(function () {done(true)})

        .fail(function (data, status) {
          notify.error('Failed to move file down.', status)
          done(false);
        });

      return false; // Cancel event propagation
    },


    'file-manager.delete': function (file, done) {
      $bb.delete(this.getAPIURL() + '/files/' + file.name)
        .done(function () {done(true)})

        .fail(function (data, status) {
          notify.error('Failed to delete file.', status)
          done(false);
        });

      return false; // Cancel event propagation
    },


    'file-manager.save': function (file, data) {
      $bb.put(this.getAPIURL() + '/files/' + file.name, data)
        .done(function () {
          if (data.visibility) file.visibility = data.visibility;
          if (data.rename) file.name = data.rename;
          if (typeof data.caption == 'string') file.caption = data.caption;

          this.updateFiles();

        }.bind(this)).fail(function (data, status) {
          notify.error('Failed to update file.', status)
        });

      return false; // Cancel event propagation
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
    var app = require('./app');

    // Import thing data
    $.each(app.thingData,
           function (key, value) {this.$set(key, value)}.bind(this));

    // API URL
    this.thing.api_url = this.getAPIURL();

    // Load files
    this.updateFiles();

    // Split tags
    if (typeof this.thing.tags == 'string')
      this.thing.tags = this.thing.tags.split(',')
      .filter(function (tag) {return tag})
      .map(function (tag) {return tag.replace(/^#/, '')})

    else if (!this.thing.tags) this.thing.tags = []

    // Sort comments
    var commentMap = {};
    for (var i = 0; i < this.comments.length; i++) {
      var comment = this.comments[i];
      commentMap[comment.comment] = comment;
      comment.children = [];
    }

    // Connect child comments to parents
    var rootComments = [];
    for (var i = 0; i < this.comments.length; i++) {
      var comment = this.comments[i];
      if (comment.parent)
        commentMap[comment.parent].children.push(comment);
      else rootComments.push(comment);
    }

    function dont_prune(comment) {
      comment.children = comment.children.filter(dont_prune);
      return comment.children.length || !comment.deleted;
    }

    this.comments = rootComments.filter(dont_prune);
  },


  ready: function () {
    if (/#?comment-\d+/.test(location.hash)) {
      var target = $(location.hash);
      if (target.length) target[0].scrollIntoView();
    }
  },


  methods: {
    // From subsections
    getSubsectionTitle: function (subsection) {
      return subsection.replace(/^edit-/, '');
    },


    // From login-listener
    getOwner: function () {
      return this.thing.owner;
    },


    updateFiles: function () {
      this.media = this.files.filter(function (file) {
        return file.visibility != 'download' && util.isMedia(file.type);
      });

      this.downloads = this.files.filter(function (file) {
        return file.visibility != 'display';
      });
    },


    isEditing: function () {
      return this.isOwner && this.subsection != 'view';
    },


    getEditSubsections: function () {
      return this.subsections.filter(function (value) {return value != 'view'})
    },


    viewThing: function () {
      location.hash = '#';
      window.scrollTo(0, 0);
    },


    editThing: function (section) {
      if (typeof section != 'string')
        section = lastEditSubsection || this.subsections[1];
      else section = 'edit-' + section;

      location.hash = section;
      window.scrollTo(0, 0);
    },


    publish: function () {
      if (!this.media.length || !this.thing.instructions ||
          !this.thing.license) {

        var pass = '<span class="fa fa-check" style="color:green"></span>';
        var fail = '<span class="fa fa-times" style="color:red"></span>';
        var media = this.media.length ? pass : fail;
        var instructions = this.thing.instructions ? pass : fail;
        var license = this.thing.license ? pass : fail;
        var title = (this.thing.title && this.thing.title != this.thing.name) ?
          pass : fail;
        var tags = this.thing.tags.length ? pass : fail;

        notify.warning(
          'Project incomplete', 'Before you can publish a ' +
            'project you must complete the following:' +
            '<ol>' +
            '  <li>' + media + ' Add at least one picture.</li>' +
            '  <li>' + instructions + ' Write some instructions.</li>' +
            '  <li>' + license + ' Choose a license.</li>' +
            '</ol>' +
            'Optionally also:' +
            '<ol start="4">' +
            '  <li>' + title + ' Choose a good title.</li>' +
            '  <li>' + tags + ' Add some tags.</li>' +
            '</ol>')
        return;
      }

      $bb.put(this.getAPIURL() + '/publish')
        .done(function () {
          this.$set('thing.published', true)
          location.hash = '';
        }.bind(this))
    },


    getAPIURL: function () {
      return 'profiles/' + this.thing.owner + '/things/' + this.thing.name;
    },


    askRename: function () {
      this.$broadcast('modal-show-rename-thing');
    },


    rename: function () {
      var app = require('./app');
      var starred = app.isStarred(this.thing.owner, this.thing.name);

      $bb.put(this.getAPIURL() + '/rename', {name: this.newName})
        .done(function () {
          app.setStarred(this.thing.owner, this.newName, starred);
          page('/' + this.thing.owner + '/' + this.newName);

        }.bind(this)).fail(function () {
          notify.error('Failed to rename project.');
        })
    },


    askDelete: function () {
      this.$broadcast('modal-show-delete-thing');
    },


    'delete': function () {
      $bb.delete(this.getAPIURL()).done(function () {
        page('/dashboard');
      }.bind(this))
    }
  },


  mixins: [require('./subsections')('thing', subsections, perms)]
}
