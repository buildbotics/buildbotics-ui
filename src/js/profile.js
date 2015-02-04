'use strict'


var page = require('page.min');
var $bb = require('./buildbotics');

var subsections =
  'profile bio starred badges followers following activity edit-profile';
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
    // From subsections
    onSubsectionChange: function (newSubsection, oldSubsection) {
      var self = this;
      if (newSubsection == 'edit-profile')
        Vue.nextTick(function () {self.edit()})
    },


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


    onSave: function (fields) {
      return $bb.put('profiles/' + this.profile.name, fields)
        .done(function () {
          require('./app').message('Profile updated successfully');
        });
    },


    editProfile: function () {
      location.hash = 'edit-profile';
    }
  },


  mixins: [
    require('./subsections')('profile', subsections),
    require('./field-editor')('profile', fields)
  ]
}
