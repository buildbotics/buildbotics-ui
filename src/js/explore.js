$bb = require('./buildbotics');

module.exports = {
  template: '#explore-template',

  data: function () {
    return {
      query: '',
      type: 'things',
      loading: false,
      things: [],
      profiles: []
    }
  },


  compiled: function () {
    this.type = location.hash == '#people' ? 'profiles' : 'things';
    this.search();
  },


  methods: {
    search: function () {
      var self = this;
      var type = this.type;

      location.hash = type == 'things' ? 'creations' : 'people';
      this.loading = true;

      $bb.get(type, {data: {query: this.query}})
        .success(function (data) {
          self.profiles = [];
          self.things = [];

          if (type == 'things') self.things = data;
          else self.profiles = data;
        })

        .always(function () {
          self.loading = false;
        })
    }
  }
}
