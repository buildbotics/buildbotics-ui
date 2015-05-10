$bb = require('./buildbotics');
util = require('./util');

var subsections = 'profiles things tags events'.split(' ');


function makeComponents() {
  var components = {};

  for (var i = 0; i < subsections.length; i++)
    components['explore-' + subsections[i]] = {
      inherit: true,
      template: '#explore-' + subsections[i] + '-template'
    }

  components['explore-search'] = {
    inherit: true,
    replace: true,
    template: '#explore-search-template'
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
    exploreType: function (value) {this.init();}
  },


  compiled: function () {
    this.init();
  },


  methods: {
    getType: function () {
      switch (this.exploreType) {
      case 'creations': return 'things';
      case 'people': return 'profiles';
      case 'activity': return 'events';
      default: return this.exploreType;
      }
    },


    init: function () {
      var params = util.parseQueryString();
      var type = this.getType();
      this.query = params.q;
      this.load();
    },


    clear: function () {
      location.search = '';
    },


    search: function () {
      this.query = this.query || '';
      location.search = '?q=' + encodeURIComponent(this.query);
    },


    load: function () {
      var type = this.getType();

      this.type = type;
      this.loading = true;
      this.profiles = [];
      this.things = [];
      this.tags = [];
      this.events = [];

      $bb.get(type, {data: {query: this.query, limit: 100}})
        .done(function (data) {this.$set(type, data)}.bind(this))
        .always(function () {this.loading = false}.bind(this))
    }
  }
}
