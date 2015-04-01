module.exports = {
  create: function (config, cb) {
    if (typeof config == 'string') {
      var labels = config.split(' ');
      var config = [];

      for (var i = 0; i < labels.length; i++)
        config.push({label: labels[i], response: labels[i]})
    }

    var buttons = [];

    for (var i = 0; i < config.length; i++) {
      // Label
      var button = $('<button>').html(config[i].label);

      // General callback
      if (cb && typeof config[i].response != 'undefined')
        (function (response) {
          button.click(function () {cb(response)})
        })(config[i].response);

      // Per button callback
      if (config[i].cb) button.click(config[i].cb);

      // Title
      if (config[i].title) button.attr('title', config[i].title);

      // Icon
      if (config[i].icon)
        $('<div>')
        .addClass('fa fa-' + config[i].icon)
        .prependTo(button);

      // CSS class
      if (config[i].klass) button.addClass(config[i].klass);

      buttons.push(button);
    }

    return buttons;
  }
}
