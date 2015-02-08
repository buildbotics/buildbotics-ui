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
      onSubsectionChange: function (newSubsection, oldSubsection) {},


      getSubsectionTitle: function (subsection) {
        return subsection.replace(/-/g, ' ');
      },


      setSubsection: function (subsection) {
        subsection = subsection.trim();

        if (!subsection || subsections.indexOf(subsection) == -1)
          subsection = subsections[0]; // Choose first by default

        if (this.subsection == subsection) return;
        var oldSubsection = this.subsection;
        this.$set('subsection', subsection);

        // Callback
        Vue.nextTick(function () {
          this.onSubsectionChange(subsection, oldSubsection);
        }.bind(this))
      }
    }
  }
}
