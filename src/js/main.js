function which(e) {
  e = e || window.event;
  return null === e.which ? e.button : e.which;
}


$(function () {
  // Smooth scrolling
  window.addEventListener('click', function (e) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey ||
        e.defaultPrevented) return;

    // Ensure link
    var el = e.target;
    while (el && 'A' !== el.nodeName) el = el.parentNode;
    if (!el || 'A' !== el.nodeName) return;

    // Ensure hash
    var link = el.getAttribute('href');
    if (!el.hash || link == '#') return;

    if (location.pathname.replace(/^\//, '') ==
        el.pathname.replace(/^\//, '') &&
        location.hostname == el.hostname) {
      var target = $(el.hash);
      target = target.length ? target : $('[name=' + el.hash.slice(1) +']');

      if (target.length) {
        e.preventDefault();
        $("html, body").animate(
          {scrollTop: target.offset().top}, 1000, 'swing',
          function () {location.hash = el.hash})
        return false
      }
    }
  }, false)

  // Vue debugging
  Vue.util.warn = function (msg) {console.debug('[Vue warn]: ' + msg)}
  //Vue.config.debug = true;

  // Vue app
  require('./app');

  // Routing
  require('./route');
})
