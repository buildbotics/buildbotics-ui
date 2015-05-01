'use strict'


var $bb = require('./buildbotics');
var notify = require('./notify');


module.exports = {
  template: '#comment-template',
  paramAttributes: ['comment'],


  data: function () {
    return {modified: false}
  },


  events: {
    'modal-response': function (button) {
      if (button == 'delete') this.remove();
      return false; // Cancel event propagation
    },


    'markdown-editor.modified': function (modified) {
      this.modified = modified;
      return false; // Cancel event propagation
    }
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
      this.$broadcast('modal-show-delete');
    },
 

    remove: function () {
      var self = this;

      $bb.delete(this.getAPIURL()).done(function () {
        self.$remove();

        Vue.nextTick(function () {
          self.$destroy();
        })
      })
    },


    checkLogin: function () {
      if (!this.isLoggedIn) {
        notify.login('vote on comments');
        return false;
      }

      return true;
    },


    vote: function (up) {
      if (!this.checkLogin()) return;

      $bb.put(this.getAPIURL() + (up ? '/up' : '/down')).done(function () {
        this.comment.votes += up ? 1 : -1;
      }.bind(this))
    },


    getAPIURL: function () {
      return this.$parent.getAPIURL() + '/' + this.comment.comment;
    }
 },


  mixins: [
    require('./field-editor')('comment', 'text'),
    require('./login-listener')
  ]
}
