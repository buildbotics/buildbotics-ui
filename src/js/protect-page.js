'use strict'

var notify = require('./notify');


module.exports = function (config) {
  config = config || {};

  var defaultMessage = 'Are you sure you want to leave?';

  config.leave = config.leave || {
    type: 'question',
    title: defaultMessage,
    buttons: [
      {label: 'Leave', response: 'leave'},
      {label: 'Stay'}
    ]
  }

  config.unload = config.unload || {
    message: defaultMessage
  }


  return {
    ready: function () {
      require('./route').on(this.checkLeave)
      window.addEventListener('beforeunload', this.onBeforeUnload);
    },


    beforeDestroy: function () {
      require('./route').off(this.checkLeave)
      window.removeEventListener('beforeunload', this.onBeforeUnload);
    },


    methods: {
      canLeave: function () {return true},
      onLeave: function (response, defer) {defer.resolve()},


      onBeforeUnload: function (e) {
        if (this.canLeave()) return;

        e = e || window.event;
        if (e) e = e.returnValue = config.unload.message; // For IE and Firefox
        return config.unload.message; // For Safari
      },


      checkLeave: function () {
        if (this.canLeave()) return;

        var defer = $.Deferred();

        notify.notify(config.leave)
          .done(function (response) {this.onLeave(response, defer)}.bind(this))
          .fail(function () {defer.reject()})

        return defer.promise();
      }
    }
  }
}
