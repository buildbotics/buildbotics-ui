var sections = 'profile creations starred badges followers'.split(' ');


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
      subsection: 'profile'
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
    }
  }
}
