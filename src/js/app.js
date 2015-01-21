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
    'bb-stars': require('./stars'),
    'bb-comment': require('./comment'),
    'bb-comments': require('./comments'),

    'bb-modal': require('./modal'),
    'bb-carousel': require('./carousel'),

    'file-manager': require('./file-manager'),
    'markdown-editor': require('./markdown')
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

    this.login(false);
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


    isAuthenticated: function() {
      return this.user.authenticated;
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
