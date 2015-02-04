'use strict'

var page = require('page.min');
var app = require('./app');
var $bb = require('./buildbotics');


function page_debug(ctx, next) {
  console.debug(JSON.stringify(ctx));
  next();
}


function explore_page(ctx) {
  app.currentPage = 'explore';
  app.$set('exploreType', ctx.params.type);
}


function tag_page(ctx) {
  app.currentPage = 'tag';
  app.tag = ctx.params.tag;
}


function profile_page(ctx) {
  var profile = ctx.params.profile;
  console.debug('/' + profile + '#' + ctx.hash);

  if (app.currentPage == 'profile' && app.profileData.profile &&
      app.profileData.profile.name == profile) {
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

  if (app.currentPage == 'thing' && app.thingData.thing &&
      app.thingData.thing.owner == profile &&
      app.thingData.thing.name == thing) {
    app.subsection = ctx.hash;
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


//page('*', page_debug);
page('/', function () {app.currentPage = 'home'});
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
