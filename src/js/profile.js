'use strict'


var $bb = require('./buildbotics');
var page = require('page');
var notify = require('./notify');

var subsections = 'view edit-picture edit-details edit-bio'


module.exports = {
  template: '#profile-template',


  components: {
    'profile-details-editor': require('./profile-details-editor'),
    'profile-bio-editor': require('./profile-bio-editor')
  },


  data: function  () {
    return {
      viewSections: 'bio starred followers following activity'.split(' '),
      modified: false
    }
  },


  created: function () {
    var self = this;
    var app = require('./app');

    // Import profile data
    $.each(app.profileData, function (key, value) {self.$add(key, value)});
  },


  methods: {
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


    editProfile: function (section) {
      if (typeof section != 'string') section = 'picture';
      location.hash = 'edit-' + section;
      window.scrollTo(0, 0);
    }
  },


  mixins: [
    require('./subsections')('profile', subsections),
    require('./login-listener')
  ]
}
