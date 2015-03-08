'use strict'

var page = require('page');
var app = require('./app');
var $bb = require('./buildbotics');


function page_debug(ctx, next) {
  console.debug(JSON.stringify(ctx));
  next();
}


var callbacks = [];
var backingOut = false;
function page_callback(ctx, next) {
  if (backingOut) return;

  var results = [];

  for (var i = 0; i < callbacks.length; i++)
    results.push(callbacks[i](ctx));

  $.when.apply($, results)
    .done(next)
    .fail(function () {
      setTimeout(function () {
        backingOut = true;
        history.back();
        page.len--;
        backingOut = false;
      })
    })
}


function docs_page(ctx, next) {
  var page = ctx.params.page;
  $.get('/docs/' + page + '.html')
    .done(function (html) {
      var re = /^<h1[^>]+>(.*)<\/h1>([\s\S]*)$/;
      var m = re.exec(html);
      var title = m[1];
      var content = m[2];

      app.currentPage = 'docs';
      app.$set('docTitle', title);
      app.$set('docContent', content);

      window.scrollTo(0, 0);

    }).fail(function () {next()})
}


function explore_page(ctx) {
  app.currentPage = 'explore';
  app.$set('exploreType', ctx.params.type);
}


function tag_page(ctx) {
  app.currentPage = 'tag';
  app.tag = ctx.params.tag;
}


function scroll_to(selector, cb) {
  console.debug('scroll_to(' + selector + ')');

  if (!selector || selector == '#') selector = 'html,body';

  var target = $(selector);
  target = target.length ? target : $('[name=' + selector.slice(1) +']');

  if (target.length)
    $("html, body").animate(
      {scrollTop: target.offset().top}, 1000, 'swing', function () {
        if (cb) cb();
      })

  else if (cb) cb();
}


function profile_page(ctx) {
  var profile = ctx.params.profile;
  console.debug('/' + profile + '#' + ctx.hash);

  if (app.currentPage == 'profile' && app.profileData.profile &&
      app.profileData.profile.name == profile) {

    scroll_to('#' + ctx.hash);
    app.subsection = ctx.hash;
    return;
  }

  app.currentPage = 'loading';

  $bb.get('profiles/' + profile)
    .done(function (data) {
      app.profileData = data;
      app.currentPage = 'profile';
      app.subsection = ctx.hash;

    }).fail(function (data) {
      app.currentPage = 'not-found';
    })
}


function thing_page(ctx) {
  var profile = ctx.params.profile;
  var thing = ctx.params.thing;
  console.debug('/' + profile + '/' + thing + '#' + ctx.hash);

  if (app.currentPage == 'thing' && app.thingData.thing &&
      app.thingData.thing.owner == profile &&
      app.thingData.thing.name == thing) {
    app.subsection = ctx.hash;
    scroll_to('#' + ctx.hash);
    return;
  }

  app.currentPage = 'loading';

  $bb.get('profiles/' + profile + '/things/' + thing)
    .done(function (data) {
      app.thingData = data;
      app.currentPage = 'thing';

      if (/comment-\d+/.test(ctx.hash)) app.subsection = 'comments';
      else app.subsection = ctx.hash;

    }).fail(function (data) {
      app.currentPage = 'not-found';
    })
}


module.exports = {
  start: function () {
    //page('*', page_debug);
    page('*', page_callback);
    page('/', function () {app.currentPage = 'home'});
    page('/docs/:page', docs_page);
    page('/explore/:type', explore_page);
    page('/learn', function () {app.currentPage = 'learn'});
    page('/create', function () {app.currentPage = 'create'});
    page('/login', function () {app.currentPage = 'login'});
    page('/register', function () {app.currentPage = 'register'});
    page('/tags/:tag', tag_page);
    page('/:profile', profile_page);
    page('/:profile/:thing', thing_page);
    page(function () {app.currentPage = 'not-found'});
    page();
  },


  on: function (cb) {
    callbacks.push(cb);
  },


  off: function (cb) {
    var index = callbacks.indexOf(cb);
    if (-1 < index) callbacks.splice(index, 1);
  }
}
