'use strict'


var $bb = require('./buildbotics');
var notify = require('./notify');

var perms = {
  canEdit: function (isOwner) {return isOwner || 'edit-comments'},
  canDelete: function (isOwner) {return isOwner || 'delete-comments'},
  canUpvote: function (isOwner) {return !isOwner || 'upvote-comments'},
  canDownvote: function (isOwner) {return !isOwner || 'downvote-comments'}
}


module.exports = {
  replace: true,
  template: '#comment-template',
  paramAttributes: ['comment'],


  data: function () {
    return {
      modified: false,
      deleted: false,
      show_reply: false,
      children: []
    }
  },


  events: {
    'modal-response': function (button) {
      if (button == 'delete') this.remove();
      return false; // Cancel event propagation
    },


    'markdown-editor.modified': function (modified) {
      this.modified = modified;
      return false; // Cancel event propagation
    },


    'comment-editor.add': function (comment) {
      this.children.push(comment);
      this.show_reply = false;
      return false;
    },


    'comment-editor.cancel': function () {
      this.show_reply = false;
      return false;
    },


    'comment.child-deleted': function (id) {
      this.children = this.children.filter(function (child) {
        return child.comment != id;
      });

      if (!this.children.length && this.deleted) this.kill();

      return false;
    }
  },


  compiled: function () {
    this.$set('children', this.comment.children || []);
    this.$set('deleted', this.comment.deleted);
  },


  methods: {
    // From login-listener
    getOwner: function () {return this.comment.owner},


    // From field-editor
    onSave: function (fields, accept) {
      fields.comment = this.comment.comment;
      $bb.put(this.getAPIURL(), fields).done(accept);
    },


    askRemove: function () {
      this.$broadcast('modal-show-delete.' + this.comment.comment);
    },


    kill: function () {
      this.$dispatch('comment.child-deleted', this.comment.comment);
    },


    remove: function () {
      $bb.delete(this.getAPIURL(true)).done(function () {
        // Check if has children
        this.deleted = true;
        if (!this.children.length) this.kill();
      }.bind(this))
    },


    checkLogin: function (msg) {
      if (!this.isLoggedIn) {
        notify.login(msg);
        return false;
      }

      return true;
    },


    vote: function (up) {
      if (!this.checkLogin('vote on comments')) return;

      $bb.put(this.getAPIURL(true) + (up ? '/up' : '/down')).done(function () {
        // TODO
        this.comment.votes += up ? 1 : -1;

      }.bind(this)).fail(function (xhr, status) {
        notify.error((up ? 'Up' : 'Down') + 'vote failed', status);
      })
    },


    reply: function () {
      if (!this.checkLogin('post a reply')) return;
      this.show_reply = !this.show_reply;
    },


    getAPIURL: function (full) {
      return this.$parent.getAPIURL() + (full ? '/' + this.comment.comment : '')
    },


    getDepth: function () {
      return this.$parent.getDepth() + 1;
    }
 },


  mixins: [
    require('./field-editor')('comment', 'text'),
    require('./login-listener')(perms)
  ]
}
