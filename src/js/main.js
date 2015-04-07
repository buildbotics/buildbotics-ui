function which(e) {
  e = e || window.event;
  return null === e.which ? e.button : e.which;
}


$(function () {
  // Detect incompatible browsers
  if (!Object.defineProperty) {
    $('#incompatible-browser')
      .show()
      .find('.page-content')
      .append(
        $('<button>')
          .addClass('success')
          .text('Update')
          .click(function () {location = 'http://whatbrowser.org/'})
      )

    return
  }

  // Vue debugging
  Vue.util.warn = function (msg) {console.debug('[Vue warn]: ' + msg)}
  //Vue.config.debug = true;

  // Vue app
  require('./app');

  // Routing
  require('./route').start();
})
