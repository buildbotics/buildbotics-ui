'use strict'


module.exports = {
  template: '#comments-template',
  paramAttributes: ['comments'],


  data: function () {
    return {
      text: ''
    }
  },


  methods: {
    isAuthenticated: function () {
      return require('./app').isAuthenticated();
    },


    getAvatar: function () {
      return require('./app').user.avatar;
    },


    getUserName: function () {
      return require('./app').user.name;
    },


    comment: function () {
      if (!this.text.trim()) return;

      var comment = {
        text: this.text
      }

      var self = this;
      $bb.post(this.getAPIURL(), comment).success(function (id) {
        self.text = '';

        comment.comment = id;
        comment.owner = self.getUserName();
        comment.avatar = self.getAvatar();
        comment.created = comment.modified = new Date().toISOString();

        self.comments.push(comment);

        self.$broadcast('markdown-editor.reset');
      });
    },


    getAPIURL: function () {
      return this.$parent.getAPIURL() + '/comments';
    }
  }
}
