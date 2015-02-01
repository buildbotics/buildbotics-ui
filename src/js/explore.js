$bb = require('./buildbotics');


var subsections = 'profiles things tags events'.split(' ');


function makeComponents() {
  var components = {};

  for (var i = 0; i < subsections.length; i++)
    components['explore-' + subsections[i]] = {
      inherit: true,
      template: '#explore-' + subsections[i] + '-template'
    }

  return components;
}


module.exports = {
  inherit: true,
  template: '#explore-template',
  components: makeComponents(),


  data: function () {
    return {
      query: '',
      type: 'things',
      loading: false,
      things: [],
      profiles: [],
      tags: [],
      events: []
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
      case 'activity': type = 'events'; break;
      default: type = exploreType; break;
      }

      this.type = type;
      this.loading = true;
      this.profiles = [];
      this.things = [];
      this.tags = [];
      this.events = [];

      $bb.get(type, {data: {query: this.query, limit: 100}})
        .success(function (data) {self.$set(type, data)})
        .always(function () {self.loading = false})
    }
  }
}
