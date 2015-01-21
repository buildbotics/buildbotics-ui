'use strict'


module.exports = {
  replace: true,
  template: '#carousel-template',
  paramAttributes: ['media'],


  ready: function () {
    $(this.$el).slick({dots: true});
  },


  methods: {
    isImage: function (type) {
      return /^image\//.test(type);
    }
  }
}
