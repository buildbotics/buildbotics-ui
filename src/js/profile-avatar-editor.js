'use strict'


var notify = require('./notify');


module.exports = {
  template: '#profile-avatar-editor-template',
  paramAttributes: ['profile'],

  data: function () {
    return {
      profile: {},
      avatar: {},
    }
  },


  watch: {
    'profile.name': function (name) {
      this.$set('url', '/api/profiles/' + name + '/avatar?size=alarge');
    }
  },


  ready: function () {
    this.initUploader();
  },


  methods: {
    // From protect-page
    canLeave: function () {
      return !this.avatar.uploading;
    },


    getAPIURL: function () {
      return 'profiles/' + this.profile.name + '/avatar';
    },


    onBeforeUpload: function (file, done) {
      var data = {
        type: file.type,
        size: file.size
      }

      $bb.put(this.getAPIURL() + '/' + file.name, data)
        .done(function (data) {
          file.state = 'uploading';
          file.upload_url = data.upload_url + data.post.key;
          file.aws_guid = data.guid;
          done(true, data.upload_url, data.post);

        }).fail(function (data, status) {
          notify.error('Failed to upload avatar ' + file.name, status);
          file.state = 'error';
          done(false);
        })
    },


    onFileAdded: function (file) {
      this.avatar = file;
      file.state = 'waiting';
      file.uploading = true;
      file.percent = 0;
      file.downloads = 0;
    },


    onFileUploaded: function (file) {
      var data = {guid: file.aws_guid}

      $bb.put(this.getAPIURL() + '/' + file.name + '/confirm', data)
        .done(function (data) {
          this.url = this.url.replace(/&nocache=[.\d]+$/, '') +
            '&nocache=' + Math.random();

        }.bind(this)).fail(function (data, status) {
          notify.error('Failed to save avatar', status);

        }).always(function () {
          this.avatar = {state: 'done'}
        }.bind(this))
    },


    cancel: function () {
      this.cancelUpload(this.avatar);
      this.avatar = {}
    },


    gotIt: function () {
      this.avatar = {}
    }
  },


  mixins: [
    require('./upload')('/'),

    require('./protect-page')({
      unload: {
        message: 'File upload in progress.  Are you sure you want to leave?'
      },

      leave: {
        type: 'question',
        title: 'Abort upload?',
        body: 'Upload in progress.  Would you like to stay on this page and ' +
          'continue or leave and abort the upload?',
        buttons: [
          {label: 'Abort', icon: 'trash-o', response: 'abort'},
          {label: 'Continue', klass: 'success', icon: 'upload'}
        ]
      }
    })
  ]
}
