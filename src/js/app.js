'use strict'

var $bb = require('./buildbotics');


module.exports = new Vue({
  el: 'body',

  data: {
    user: {},
    currentPage: 'loading',
    subsection: '',
    profileData: {},
    thingData: {},
    licenses: [],
    starred: {}
  },

  components: {
    'loading-page': {template: '#loading-template'},
    'register-page': require('./register'),
    'home-page': {template: '#home-template'},
    'explore-page': require('./explore'),
    'learn-page': {template: '#learn-template'},
    'create-page': {template: '#create-template'},
    'thing-page': require('./thing'),
    'profile-page': require('./profile'),
    'not-found-page': {template: '#not-found-template'},

    'bb-things': require('./things'),
    'bb-stars': require('./stars')
  },

  directives: {
    disable: function (value) {this.el.disabled = !!value},
    markdown: function (value) {
      this.el.innerHTML = value ? marked(value) : '';
    }
  },

  filters: {
    preventDefault: function (handler) {
      if (!handler) return;

      return function (e) {
        handler.call(this, e);
        e.preventDefault();
      }
    },

    enter: function (handler) {
      if (!handler) return;

      return function (e) {
        if (e.keyCode == 13) {
          handler.call(this, e);
          e.preventDefault();
        }
      }
    },

    timeSince: function (time) {
      return moment(time).fromNow();
    }
  },

  compiled: function () {
    var self = this;

    $bb.get('licenses').success(function (data) {
      for (var i = 0; i < data.length; i++)
        self.licenses.push(data[i]);
    })

    this.login(false);
  },

  methods: {
    loggedIn: function (user_data) {
      var user = user_data.profile;
      console.debug('Logged in as ' + user.name);

      // Starred things
      this.starred = {}
      for (var i = 0; i < user_data.starred.length; i++) {
        var thing = user_data.starred[i];
        this.starred[thing.owner + '/' + thing.name] = true;
      }

      // Logged in
      this.user = user;
      this.user.authenticated = true;
      $('body').addClass('authorized');

      // Event
      this.$broadcast('logged-in', this);
    },

    loggedOut: function () {
      console.debug('loggedOut()');
      $.removeCookie('buildbotics.sid');
      this.user = {}
      $('body').removeClass('authorized');

      // Event
      this.$broadcast('logged-out', this);
    },

    isUser: function(name) {
      return this.user.name == name;
    },

    getUser: function () {
      return this.user;
    },

    getUserData: function () {
      return this.user_data;
    },

    isStarred: function (owner, thing) {
      return this.starred[owner + '/' + thing];
    },

    setStarred: function (owner, thing, starred) {
      this.starred[owner + '/' + thing] = starred;
    },

    logout: function () {
      var self = this;
      $bb.get('auth/logout').success(self.loggedOut);
    },

    login: function (register) {
      var self = this;

      $bb.get('auth/user').success(function (data) {
        if (typeof data.profile != 'undefined') {
          if (typeof data.profile.lastseen != 'undefined') {
            self.loggedIn(data);
            return;

          } else if (typeof data.profile.name != 'undefined') {
            if (register) page('/register');
            return;
          }
        }

        self.loggedOut();
      });
    }
  }
})
