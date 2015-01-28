'use strict'


var $bb = require('./buildbotics');


module.exports = {
  template: '#comment-template',
  paramAttributes: ['comment'],


  events: {
    'modal-response': function (button) {
      if (button == 'delete') this.remove();
      return false; // Cancel event propagation
    }
  },


  methods: {
    isOwner: function () {
      return require('./app').isUser(this.comment.owner);
    },


    onSave: function (fields, accept) {
      fields.comment = this.comment.comment;
      $bb.put(this.getAPIURL(), fields).success(accept);
    },


    askRemove: function () {
      this.$broadcast('modal-show-delete');
    },
 

    remove: function () {
      var self = this;

      $bb.delete(this.getAPIURL()).success(function () {
        self.$remove();

        Vue.nextTick(function () {
          self.$destroy();
        })
      })
    },
 

    getAPIURL: function () {
      return this.$parent.getAPIURL() + '/' + this.comment.comment;
    }
 },


  mixins: [require('./field-editor')('comment', 'text')]
}
