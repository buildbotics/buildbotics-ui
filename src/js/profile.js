var sections = 'profile creations starred badges followers'.split(' ');
var fields = 'fullname location url bio'.split(' ');

function make_components() {
  components = {};

  for (var i = 0; i < sections.length; i++)
    components['profile-' + sections[i]] = {
      template: '#profile-' + sections[i] + '-template',
      inherit: true
    }

  return components;
}


module.exports = {
  template: '#profile-template',

  data: function () {
    return {
      sections: sections,
      subsection: 'profile',
      editing: false,
      fullname: '',
      location: '',
      url: '',
      bio: ''
    }
  },

  components: make_components(),

  compiled: function () {
    var self = this;
    var app = require('./app');

    $.each(app.profileData, function (key, value) {self.$add(key, value)});

    this.unwatch = app.$watch('subsection', function (value) {
      value = value.trim();
      if (!value || sections.indexOf(value) == -1)
        self.setSubsection('profile');
      else self.setSubsection(value);

    }, false, true)
  },

  beforeDestroy: function () {
    this.unwatch();
  },

  methods: {
    isOwner: function () {
      return this.profile && require('./app').isUser(this.profile.name);
    },

    setSubsection: function (subsection) {
      this.subsection = subsection;

      // Set menu item active
      $(this.$el).find('.menu li').each(function () {
        if ($(this).find('a').text() == subsection)
          $(this).addClass('active');
        else $(this).removeClass('active');
      })
    },

    edit: function () {
      for (var i = 0; i < fields.length; i++)
        this[fields[i]] = this.profile[fields[i]];

      this.editing = true;
    },

    save: function () {
      var $bb = require('./buildbotics');

      var data = {}
      var send = false;
      for (var i = 0; i < fields.length; i++)
        if (this[fields[i]] != this.profile[fields[i]]) {
          data[fields[i]] = this[fields[i]];
          send = true;
        }

      if (!send) {
        this.editing = false;
        return;
      }

      var self = this;

      $bb.put('profiles/' + this.profile.name, data)
        .success(function () {
          for (var i = 0; i < fields.length; i++)
            self.profile[fields[i]] = self[fields[i]];

          self.editing = false;
        });
    },

    cancel: function () {
      this.editing = false;
    }
  }
}
