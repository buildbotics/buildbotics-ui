function which(e) {
  e = e || window.event;
  return null === e.which ? e.button : e.which;
}


$(function () {
  // Vue debugging
  Vue.util.warn = function (msg) {console.debug('[Vue warn]: ' + msg)}
  //Vue.config.debug = true;

  // Vue app
  require('./app');

  // Routing
  require('./route').start();
})
