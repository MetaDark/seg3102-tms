'use strict';

var data = (function () {
  function urlencode(obj) {
    var arr = [];
    for (var key in obj) {
      arr.push(
        encodeURIComponent(key) + '=' +
        encodeURIComponent(obj[key]));
    }

    if (arr.length === 0) return '';
    return '?' + arr.join('&');
  }
  
  function request(method, url, obj) {
    var promise = new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.addEventListener('load', function(e) {
        var next = this.status === 200 ? resolve : reject;
        var response = this.responseText;
        if (!response) {
          next();
        } else {
          try {
            next(JSON.parse(response));
          } catch (e) {
            next(response);
          }
        }
      });
      
      var data, contentType;
      if (method !== 'GET') {
        data = JSON.stringify(obj);
        contentType = 'application/json';
      } else {
        url += urlencode(obj);
        contentType = 'application/x-www-form-urlencoded';
      }
      
      xhr.open(method, url);
      xhr.setRequestHeader('Content-Type', contentType);
      xhr.send(data);
    });
    
    return promise;
  }
  
  return {
    get: request.bind(null, 'GET'),
    put: request.bind(null, 'PUT'),
    post: request.bind(null, 'POST'),
    delete: request.bind(null, 'DELETE')
  };
})();
