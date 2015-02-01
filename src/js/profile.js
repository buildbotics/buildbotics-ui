'use strict'


var page = require('page.min');

var subsections = 'profile creations starred badges followers activity';
var fields = 'fullname location url bio';


module.exports = {
  template: '#profile-template',


  created: function () {
    var self = this;
    var app = require('./app');

    // Import profile data
    $.each(app.profileData, function (key, value) {self.$add(key, value)});
    this.initFields();
  },


  methods: {
    isOwner: function () {
      return require('./app').isUser(this.profile.name);
    },


    getPicture: function () {
      var avatar = this.profile.avatar;
      avatar = avatar.replace(/\?sz=\d+$/, '?sz=200'); // Google
      avatar = avatar.replace(/\?type=small$/, '?type=large'); // Facebook
      return avatar;
    },


    create: function () {
      page('/create');
    },


    onEdit: function () {
      location.hash = '#profile';
    },


    onSave: function (fields) {
      var $bb = require('./buildbotics');
      return $bb.put('profiles/' + this.profile.name, fields);
    }
  },


  mixins: [
    require('./subsections')('profile', subsections),
    require('./field-editor')('profile', fields)
  ]
}
