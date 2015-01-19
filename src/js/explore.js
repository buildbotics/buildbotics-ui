$bb = require('./buildbotics');

module.exports = {
  template: '#explore-template',

  data: function () {
    return {
      query: '',
      things: []
    }
  },

  compiled: function () {
    this.search();
  },

  methods: {
    search: function () {
      var self = this;

      $bb.get('things', {data: {query: this.query}})
        .success(function (things) {
          self.things = things;
        })
    }
  }
}
