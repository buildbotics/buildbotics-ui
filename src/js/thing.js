'use strict'

var subsections = 'overview files comments';
var fields = 'title url license tags description';


module.exports = {
  template: '#thing-template',


  created: function () {
    var self = this;
    var app = require('./app');

    // Import thing data
    $.each(app.thingData, function (key, value) {self.$set(key, value);});

    // Get licenses
    this.$set('licenses', app.licenses);

    // Split tags
    if (this.thing.tags)
      this.tags = this.thing.tags.split(',')
      .filter(function (e) {return e})
  },


  methods: {
    isOwner: function () {
      return require('./app').isUser(this.thing.owner);
    },


    onSave: function (fields, accept) {
      var $bb = require('./buildbotics');
      $bb.put(this.getAPIURL(), fields).success(accept);
    },


    getAPIURL: function () {
      return 'profiles/' + this.thing.owner + '/things/' + this.thing.name;
    }
  },


  mixins: [
    require('./subsections')('thing', subsections),
    require('./field-editor')('thing', fields)
  ]
}
