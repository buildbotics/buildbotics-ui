'use strict'


var $bb = require('./buildbotics');
var page = require('page');
var notify = require('./notify');

var subsections = 'view edit-picture edit-details edit-bio'
var fields = 'fullname location url bio';


module.exports = {
  template: '#profile-template',


  data: function  () {
    return {
      viewSections: 'bio starred followers following activity'.split(' ')
    }
  },


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
      this.edit()
    },


    getSubsectionTitle: function (subsection) {
      return subsection.replace(/^edit-/, '');
    },


    // From login-listener
    getOwner: function () {
      return this.profile.name;
    },


    getEditSubsections: function () {
      return this.subsections.filter(function (value) {return value != 'view'})
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
          notify.message('Profile updated successfully');
        });
    },


    editProfile: function () {
      location.hash = 'edit-picture';
    }
  },


  mixins: [
    require('./subsections')('profile', subsections),
    require('./field-editor')('profile', fields),
    require('./login-listener')
  ]
}
