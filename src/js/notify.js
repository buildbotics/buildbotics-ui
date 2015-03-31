'use strict'

var buttons = require('./buttons');


module.exports = new Vue({
  methods: {
    // From overlay
    overlayClick: function () {
      this.defer.reject();
      this.close();
    },


    response: function (response) {
      if (typeof response == 'undefined') this.defer.reject();
      else this.defer.resolve(response);
      this.close();
    },


    close: function () {
      this.dialog.remove();
      this.removeOverlay();
    },


    notify: function (config) {
      switch (typeof config.body) {
      case 'undefined': break;
      case 'string': break;
      default: config.body = JSON.stringify(config.body);
      }

      config.type = config.type || 'info';

      if (!config.icon)
        switch (config.type) {
        case 'error': config.icon = 'exclamation-circle'; break;
        case 'warn': config.icon = 'exclamation-triangle'; break;
        case 'question': config.icon = 'question-circle'; break;
        default: config.icon = 'info-circle';
        }

      config.buttons = config.buttons || [{label: 'Ok', klass: 'success'}];
      var btns = buttons.create(config.buttons, this.response);

      this.dialog = $('<div>')
        .addClass('notify-dialog');

      $('<div>')
        .addClass('notify-dialog-header')
        .append($('<div>').addClass('fa fa-' + config.icon + ' ' + config.type))
        .append(config.title)
        .appendTo(this.dialog);

      $('<div>')
        .addClass('notify-dialog-body')
        .text(config.body)
        .appendTo(this.dialog);

      if (btns.length)
        $('<div>')
        .addClass('notify-dialog-footer')
        .append(btns)
        .appendTo(this.dialog);

      this.addOverlay();
      this.dialog.appendTo('body');

      this.defer = $.Deferred();
      return this.defer.promise();
    },


    message: function (title, body, buttons) {
      this.notify({title: title, body: body, buttons: buttons});
    },


    error: function (title, body, buttons) {
      this.notify({title: title, body: body, type: 'error', buttons: buttons});
    },


    warning: function (title, body, buttons) {
      this.notify({title: title, body: body, type: 'warn', buttons: buttons});
    },


    info: function (title, body, buttons) {
      this.notify({title: title, body: body, type: 'info', buttons: buttons});
    },


    question: function (title, body, buttons) {
      this.notify({title: title, body: body, type: 'question',
                   buttons: buttons});
    }
  },


  mixins: [require('./overlay')('notify')]
})
