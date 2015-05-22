'use strict'

var util = require('./util');


module.exports = {
  template: '#landing-template',


  methods: {
    smoothScroll: function (e) {
      e.preventDefault();

      util.scrollTo(e.target.hash, true, function () {
        location.hash = e.target.hash;
      });
    }
  },


  ready: function () {
    $(this.$el).find('.expand i').click(function () {
      $(this).addClass('expanded');
    })
  },


  mixins: [require('./login-listener')()]
}
