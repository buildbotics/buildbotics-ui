'use strict'

var $bb = require('./buildbotics');
var page = require('page');
var util = require('./util');
var throttle = require('./throttle');


module.exports = new Vue({
  el: 'body',


  data: {
    user: {},
    currentPage: 'loading',
    subsection: '',
    profileData: {},
    thingData: {},
    licenses: [],
    following: {},
    starred: {},
    authenticating: true
  },


  components: {
    'loading-page': {template: '#loading-template'},
    'docs-page': {template: '#docs-template', inherit: true},
    'login-page': {template: '#login-template'},
    'register-page': require('./register'),
    'landing-page': require('./landing'),
    'dashboard-page': require('./dashboard'),
    'explore-page': require('./explore'),
    'learn-page': {template: '#learn-template'},
    'create-page': require('./create'),
    'thing-page': require('./thing'),
    'profile-page': require('./profile'),
    'tag-page': require('./tag'),
    'not-found-page': {template: '#not-found-template'},

    'bb-page-layout': {replace: true, template: '#page-layout-template'},

    'bb-profiles': require('./profiles'),
    'bb-things': require('./things'),
    'bb-stars': require('./stars'),
    'bb-comment': require('./comment'),
    'bb-comments': require('./comments'),
    'bb-points': require('./points'),
    'bb-followers': require('./followers'),
    'bb-tags': require('./tags'),
    'bb-events': require('./events'),

    'bb-modal': require('./modal'),
    'bb-carousel': require('./carousel'),
    'bb-media': require('./media'),
    'bb-avatar': require('./avatar'),

    'file-manager': require('./file-manager'),
    'markdown-editor': require('./markdown'),
    'tag-editor': require('./tag-editor'),
    'subsection-menu': require('./subsection-menu'),
    'thing-name-validator': require('./thing-name-validator')
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


    escape: function (handler) {
      if (!handler) return;

      return function (e) {
        if (e.keyCode == 27) {
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
    this.login();

    var self = this;

    $bb.get('licenses').done(function (data) {
      for (var i = 0; i < data.length; i++)
        self.licenses.push(data[i]);
    })

    // Configure markdown
    var renderer = new marked.Renderer();
    renderer.image = function (href, title, text) {
      // Parse href
      var a = document.createElement('a');
      a.href = href;

      if (a.hostname
          .toLowerCase()
          .match(/^(www\.)?((youtube\.com)|(youtu\.be))$/))
        return '<iframe class="youtube" ' +
          'src="//www.youtube.com/embed/' + util.getYoutubeId(a.href) +
          '" frameborder="0" allowfullscreen></iframe>';

      var q = util.parseQueryString(a.search);
      var size = q.size || 'small';

      href = a.pathname.replace(/^.*[\\\/]/, '');
      href = location.pathname.replace(/\/$/, '') + '/' + href;

      if (href.slice(-4).toLowerCase() == '.mp4') {
        var html = '<video controls class="' + size + '"';

        if (title) html += ' title="' + title + '"';
        html += '>';

        html += '<source src="' + href + '" type="video/mp4"/>';

        return html + '</video>'

      } else {
        var html = '<img ';

        if (text) html += 'alt="' + text + '" ';
        if (title) html += 'title="' + title + '" ';

        html += 'src="' + href + '?size=' + size + '"';

        return html + '/>'
      }
    }

    marked.setOptions({
      renderer: renderer,
      sanitize: false,
      highlight: function (code) {return hljs.highlightAuto(code).value}
    })
  },


  ready: function () {
    // Scroll to top button
    var win = $(window);
    var top = $('#top');
    var hidden;

    win.scroll(throttle(250, false, function () {
      var hide = win.scrollTop() < 200;

      if (hide && hidden !== true) top.hide();
      if (!hide && hidden !== false) top.show();

      hidden = hide;
    }));

    // Smooth scrolling
    window.addEventListener('click', function (e) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey ||
          e.defaultPrevented) return;

      // Ensure link
      var el = e.target;
      while (el && 'A' !== el.nodeName) el = el.parentNode;
      if (!el || 'A' !== el.nodeName) return;

      // Ensure hash
      var link = el.getAttribute('href');
      if (!el.hash || link == '#') return;

      if (location.pathname.replace(/^\//, '') ==
          el.pathname.replace(/^\//, '') &&
          location.hostname == el.hostname) {

        util.scrollTo(el.hash, function () {location.hash = el.hash})

        e.preventDefault();
        return false;
      }
    }, false)
  },


  methods: {
    top: function (e) {
      $('html, body').animate({scrollTop: 0}, 1000, 'swing')
      e.preventDefault();
    },


    loggedIn: function (user_data) {
      var user = user_data.profile;
      console.debug('Logged in as ' + user.name);

      // Following
      this.following = {}
      for (var i = 0; i < user_data.following.length; i++) {
        var profile = user_data.following[i].name;
        this.following[profile] = true;
      }

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
      if (path) page(path == '/' ? '/dashboard' : path);

      // Event
      this.$broadcast('logged-in', user, this);
    },


    loggedOut: function () {
      console.debug('loggedOut()');
      $.removeCookie('buildbotics.sid.js');
      this.user = {}
      this.following = {}
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


    isFollowing: function (profile) {
      return this.following[profile];
    },


    setFollowing: function (profile, following) {
      this.following[profile] = following;
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

      $bb.get('auth/logout').done(function () {
        self.loggedOut()
        self.currentPage = currentPage;
        self.subsection = subsection;
      });
    },


    login: function () {
      var self = this;

      $bb.get('auth/user').done(function (data) {
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

      }).always(function () {
        this.authenticating = false
      }.bind(this))
    },


    initiateLogin: function () {
      var path = location.pathname;
      if (location.hash) path += location.hash;
      $.removeCookie('buildbotics.login-path');
      $.cookie('buildbotics.login-path', path, {path: '/'});

      page('/login');
    },


    overlayClick: function () {
      this.closeExploreNav();
      this.closeUserNav();
    },


    openExploreNav: function () {
      $('#explore-nav').show();
      this.addOverlay();
    },


    closeExploreNav: function () {
      $('#explore-nav').hide();
      this.removeOverlay();
    },


    openUserNav: function () {
      $('#user-nav').show();
      this.addOverlay();
    },


    closeUserNav: function () {
      $('#user-nav').hide();
      this.removeOverlay();
    }
  },


  mixins: [require('./overlay')('menu')]
})
