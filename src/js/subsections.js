'use strict'


module.exports = function (prefix, subsections) {
  subsections = subsections.split(' ');


  function makeComponents() {
    var components = {};

    for (var i = 0; i < subsections.length; i++)
      components[prefix + '-' + subsections[i]] = {
        template: '#' + prefix + '-' + subsections[i] + '-template',
        inherit: true
      }

    return components;
  }


  return {
    components: makeComponents(),

    created: function () {
      this.$set('subsections', subsections);
      this.$set('subsection', subsections[0]);

      // Watch subsection changes
      var app = require('./app');
      var self = this;
      this.unwatch = app.$watch('subsection', function (value) {
        value = value.trim();

        if (!value || subsections.indexOf(value) == -1)
          self.setSubsection(subsections[0]);
        else self.setSubsection(value);

      }, false, true)
    },


    beforeDestroy: function () {
      this.unwatch();
    },


    methods: {
      setSubsection: function (subsection) {
        this.subsection = subsection;

        // Set menu item active
        $(this.$el).find('.menu li').each(function () {
          if ($(this).find('a').text() == subsection)
            $(this).addClass('active');
          else $(this).removeClass('active');
        });
      }
    }
  }
}
