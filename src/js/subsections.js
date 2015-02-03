'use strict'


module.exports = function (prefix, subsections) {
  subsections = subsections.split(' ');


  function makeComponents() {
    var components = {};

    for (var i = 0; i < subsections.length; i++)
      components[prefix + '-' + subsections[i]] = {
        template: '#' + prefix + '-' + subsections[i] + '-template',
        inherit: true,

        ready: function () {
          var subsection = subsections[i];

          return function () {
            $(this.$el).addClass(prefix + '-' + subsection);
          }
        }()
      }

    return components;
  }


  return {
    components: makeComponents(),


    created: function () {
      this.$set('subsections', subsections);
      this.setSubsection(subsections[0]);

      // Watch subsection changes
      var app = require('./app');
      var self = this;
      this.unwatch = app.$watch('subsection', function (value) {
        self.setSubsection(value);
      }, false, true)
    },


    beforeDestroy: function () {
      this.unwatch();
    },


    methods: {
      setSubsection: function (subsection) {
        subsection = subsection.trim();

        if (!subsection || subsections.indexOf(subsection) == -1)
          subsection = subsections[0]; // Choose first by default

        if (this.subsection == subsection) return;
        this.$set('subsection', subsection);

        // Set menu item active
        var self = this;
        Vue.nextTick(function () {
          $(self.$el).find('.menu > a').each(function () {
            var text = $(this).text();
            if (text == subsection) $(this).addClass('active');
            else $(this).removeClass('active');
          });
        });
      }
    }
  }
}
