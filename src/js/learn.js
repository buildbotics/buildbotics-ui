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

      /*$.get('/docs/' + section + '/index.json')
        .done(function (data) {
          sections[section] = data;
          this.$set(section, data.items);
        }.bind(this))*/
    }
  }
}
