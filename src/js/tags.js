'use strict'

var cloud = require('./tag-cloud.js');


module.exports = {
  replace: true,
  template: '<div class="tag-cloud"></div>',
  paramAttributes: ['tags'],


  watch: {
    tags: function () {
      if (!this.tags || !this.tags.length) return;

      var words = [];

      for (var i = 0; i < this.tags.length; i++) {
        var tag = this.tags[i];

        words.push({
          text: tag.name,
          weight: tag.count,
          link: {
            href: '/tags/' + tag.name,
            title: 'The tag "' + tag.name + '" occurs ' + tag.count + ' times.'
          }
        })
      }

      $(this.$el).html('');

      cloud(this.$el, words, {
        width: $(this.$el).width(),
        height: $(this.$el).width() / 1.618
      });
    }
  }
}
