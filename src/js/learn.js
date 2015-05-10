'use strict'

var sections = {tutorials: {}, reference: {}, faqs: {}}


module.exports = {
  template: '#learn-template',


  compiled: function () {
    for (var section in sections) this.fetch(section);
  },


  methods: {
    fetch: function (section) {
      if (sections[section].items) {
        this.$set(section, sections[section].items);
        return;
      }

      if (section == 'tutorials')
        $.get('/api/tags/tutorial,featured')
        .done(function (data) {
          this.$set('tutorials', sections.tutorials = data);
        }.bind(this))
    }
  }
}
