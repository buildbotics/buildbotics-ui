'use strict'

var $bb = require('./buildbotics');
var page = require('page.min');


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
    'login-page': {template: '#login-template'},
    'register-page': require('./register'),
    'home-page': {template: '#home-template'},
    'explore-page': require('./explore'),
    'learn-page': {template: '#learn-template'},
    'create-page': require('./create'),
    'thing-page': require('./thing'),
    'profile-page': require('./profile'),
    'not-found-page': {template: '#not-found-template'},

    'bb-profiles': require('./profiles'),
    'bb-things': require('./things'),
    'bb-stars': require('./stars'),
    'bb-comment': require('./comment'),
    'bb-comments': require('./comments'),

    'bb-modal': require('./modal'),
    'bb-carousel': require('./carousel'),

    'file-manager': require('./file-manager'),
    'markdown-editor': require('./markdown'),
    'tag-editor': require('./tag-editor')
  },


  directives: {
    disable: function (value) {this.el.disabled = !!value},


    markdown: function (value) {
      $(this.el).addClass('markdown');
      this.el.innerHTML = value ? marked(value) : '';
    },


    progressbar: {
      bind: function () {
        var el = $(this.el);

        $('<div>')
          .append(el.children().detach())
          .width(0)
          .appendTo(el);

        el.addClass('progressbar');
      },


      update: function (value) {
        $(this.el).find('> div').width(value + '%');
      }
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


    humanSize: function (bytes, precision) {
      if (typeof bytes != 'number' || isNaN(bytes)) return 'unknown';
      if (typeof precision == 'undefined') precision = 1;

      var i;
      for (i = 0; 1024 < bytes && i < 4; i++) bytes /= 1024;

      bytes = bytes.toFixed(precision);

      return Number(bytes) + ' ' + ['Bytes', 'KB', 'MB', 'GB', 'TB'][i];
    },


    humanNumber: function (bytes, precision) {
      if (typeof bytes != 'number' || isNaN(bytes)) return 'unknown';
      if (typeof precision == 'undefined') precision = 0;

      var i;
      for (i = 0; 1024 < bytes && i < 4; i++) bytes /= 1024;

      bytes = bytes.toFixed(precision);

      return Number(bytes) + ['', 'K', 'M', 'B', 'T'][i];
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

    this.login();
  },


  methods: {
    message: function (msg, obj) {
      if (obj) msg += '\n' + JSON.stringify(obj);
      alert(msg);
      // TODO use a dialog instead
    },


    error: function (msg, obj) {
      this.message('ERROR: ' + msg, obj);
    },


    warn: function (msg, obj) {
      this.message('WARNING: ' + msg, obj);
    },


    info: function (msg, obj) {
      this.message('INFO: ' + msg, obj);
    },


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

      // Redirect
      var path = $.cookie('buildbotics.login-path');
      $.removeCookie('buildbotics.login-path');
      if (path) page(path);

      // Event
      this.$broadcast('logged-in', this);
    },


    loggedOut: function () {
      console.debug('loggedOut()');
      $.removeCookie('buildbotics.sid');
      this.user = {}
      this.starred = {}
      $('body').removeClass('authorized');

      // Event
      this.$broadcast('logged-out', this);
    },


    isAuthenticated: function() {
      return this.user.authenticated;
    },


    isUser: function(name) {
      return this.user && this.user.name == name;
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

      var currentPage = this.currentPage;
      var subsection = this.subsection;
      this.currentPage = 'loading';

      $bb.get('auth/logout').success(function () {
        self.loggedOut()
        self.currentPage = currentPage;
        self.subsection = subsection;
      });
    },


    login: function () {
      var self = this;

      $bb.get('auth/user').success(function (data) {
        if (typeof data.profile != 'undefined') {
          if (typeof data.profile.lastseen != 'undefined') {
            self.loggedIn(data);
            return;

          } else if (typeof data.profile.name != 'undefined') {
            page('/register');
            return;
          }
        }

        self.loggedOut();
      });
    },


    initiateLogin: function () {
      var path = location.pathname;
      if (location.hash) path += location.hash;
      $.removeCookie('buildbotics.login-path');
      $.cookie('buildbotics.login-path', path, {path: '/'});

      page('/login');
    }
  }
})
