'use strict'


var page = require('page');


module.exports = {
  template: '#comments-template',
  paramAttributes: ['comments'],


  data: function () {
    return {
      text: '',
      modified: false,
      postButtons: [
        {label: 'Cancel', icon: 'times', klass: 'disabled', response: 'cancel',
         title: 'Cancel comment.'},
        {label: 'Post', icon: 'envelope-o', klass: 'success disabled',
         response: 'post', title: 'Post your comment.'}
      ]
    }
  },


  events: {
    'markdown-editor.modified': function (modified) {
      this.modified = modified;

      var btn = $(this.$el).find('.markdown-editor .actions button');
      if (modified) btn.removeClass('disabled');
      else btn.addClass('disabled');

      return false;
    },


    'markdown-editor.response': function (response) {
      switch (response) {
      case 'post':
        if (this.modified) this.comment();
        break;

      case 'cancel':
        this.text = '';
        this.$broadcast('markdown-editor.mark-clean');
        break;
      }

      this.$broadcast('markdown-editor.fullscreen', false);

      return false;
    }
  },


  methods: {
    isAuthenticated: function () {
      return require('./app').isAuthenticated();
    },


    login: function () {
      require('./app').initiateLogin();
    },


    getUserName: function () {
      return require('./app').user.name;
    },


    comment: function () {
      if (!this.text.trim()) return;

      var comment = {
        text: this.text
      }

      $bb.post(this.getAPIURL(), comment).done(function (id) {
        this.text = '';

        var user = require('./app').user;

        comment.comment = id;
        comment.owner = user.name;
        comment.owner_points = user.points;
        comment.votes = 1;
        comment.created = comment.modified = new Date().toISOString();

        this.comments.push(comment);

        this.$broadcast('markdown-editor.reset');
      }.bind(this));
    },


    getAPIURL: function () {
      return this.$parent.getAPIURL() + '/comments';
    }
  }
}
