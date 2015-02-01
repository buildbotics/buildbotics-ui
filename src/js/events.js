'use strict'


module.exports = {
  replace: true,
  template: '#events-template',
  paramAttributes: ['events'],


  methods: {
    getIcon: function (action) {
      switch (action) {
      case 'badge': return 'certificate';
      case 'follow': return 'user-plus';
      case 'update': return 'pencil';
      case 'publish': return 'book';
      case 'rename': return 'adjust';
      case 'delete': return 'trash';
      default: return action;
      }
    },


    describeAction: function (action) {
      switch (action) {
      case 'badge': return ' earned the badge ';
      case 'follow': return ' followed ';
      case 'update': return ' updated ';
      case 'publish': return ' published ';
      case 'rename': return ' renamed ';
      case 'delete': return ' deleted ';
      case 'star': return ' starred ';
      case 'comment': return ' commented on '
      default: return action;
      }
    },


    describeObject: function (action, path) {
      switch (action) {
      case 'badge': return path.replace(/^badges\/(.*)$/, '$1');
      case 'comment': return path.replace(/^(.*)#comment-\d+$/, '$1');
      default: return path;
      }
    }
  }
}
