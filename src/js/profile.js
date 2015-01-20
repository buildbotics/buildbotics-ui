'use strict'

var subsections = 'profile creations starred badges followers';
var fields = 'fullname location url bio';


module.exports = {
  template: '#profile-template',


  created: function () {
    var self = this;
    var app = require('./app');

    // Import profile data
    $.each(app.profileData, function (key, value) {self.$add(key, value)});
  },


  methods: {
    isOwner: function () {
      return require('./app').isUser(this.profile.name);
    },


    onSave: function (fields, accept) {
      var $bb = require('./buildbotics');
      $bb.put('profiles/' + this.profile.name, fields).success(accept);
    }
  },


  mixins: [
    require('./subsections')('profile', subsections),
    require('./field-editor')('profile', fields)
  ]
}
