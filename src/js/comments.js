'use strict'


var page = require('page');


module.exports = {
  template: '#comments-template',
  paramAttributes: ['comments'],


  events: {
    'comment-editor.add': function (comment) {
      this.comments.push(comment);
      return false;
    },


    'comment-editor.cancel': function () {
      return false;
    },


    'comment.child-deleted': function (id) {
      this.comments = this.comments.filter(function (child) {
        return child.comment != id;
      });
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


    getAPIURL: function () {
      return this.$parent.getAPIURL() + '/comments';
    },


    getDepth: function () {
      return 0;
    }
  }
}
