'use strict'


function api_cb(method, url, data, config) {
  config = $.extend({
    type: method,
    url: '/api/' + url,
    dataType: 'json'
  }, config);

  if (typeof data == 'object') {
    config.data = JSON.stringify(data);
    config.contentType = 'application/json; charset=utf-8';
  }

  // Add authorization header
  var sid = $.cookie('buildbotics.sid');
  if (sid) {
    var auth = 'Token ' + sid;
    config.headers = $.extend({Authorization: auth}, config.headers);
  }

  var error_cb = function () {};

  var promise = $.ajax(config)
    .error(function (xhr, status, error) {
      try {
        error_cb($.parseJSON(xhr.responseText), xhr, status, error);
      } catch(e) {
        error_cb(undefined, xhr, status, error);
      }
    })

  promise.error = function (cb) {
    error_cb = cb || error_cb;
    return promise;
  }

  return promise;
}


module.exports = {
  get: function (url, config) {
    return api_cb('GET', url, undefined, config);
  },


  put: function(url, data, config) {
    return api_cb('PUT', url, data, config);
  },


  post: function(url, data, config) {
    return api_cb('POST', url, data, config);
  },


  delete: function (url, config) {
    return api_cb('DELETE', url, undefined, config);
  }
}
