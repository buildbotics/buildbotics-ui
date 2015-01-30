$bb = require('./buildbotics');

module.exports = {
  inherit: true,
  template: '#explore-template',


  data: function () {
    return {
      query: '',
      type: 'things',
      loading: false,
      things: [],
      profiles: [],
      tags: [],
    }
  },


  watch: {
    exploreType: function (value) {this.search();}
  },


  compiled: function () {
    this.search();
  },


  methods: {
    search: function () {
      var self = this;
      var exploreType = require('./app').exploreType;
      var type;

      switch (exploreType) {
      case 'creations': type = 'things'; break;
      case 'people': type = 'profiles'; break;
      default: type = exploreType; break;
      }

      this.type = type;
      this.loading = true;
      this.profiles = [];
      this.things = [];

      $bb.get(type, {data: {query: this.query, limit: 100}})
        .success(function (data) {self.$set(type, data)})
        .always(function () {self.loading = false})
    }
  }
}
