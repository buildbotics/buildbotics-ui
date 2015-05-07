'use strict'


module.exports = {
  template: '#landing-template',


  methods: {
    expand: function (e) {
      console.debug('expand(', e, ')');
      e = e || window.event;

      var self = this;
      var target = $(e.target);

      target.find('> b').each(function () {
        var b = $(this);

        b.find('> i').each(function () {
          var i = $(this);

          var a = document.createElement('a');
          a.innerHTML = i.html();
          a.onclick = self.expand;

          i.replaceWith(a);
        })

        b.replaceWith(b.html());
      })

      target.replaceWith(target.html());

      e.preventDefault();
    }
  },


  mixins: [require('./login-listener')()]
}
