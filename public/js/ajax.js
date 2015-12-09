'use strict';

var ajax = (function () {
  var ajax = {
    onerror: null
  };
  
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
        // Parse response
        var response;
        if (this.responseText) {
          try {
            response = JSON.parse(this.responseText);
          } catch (e) {
            response = this.responseText;
          }
        }

        // Pass results back to caller 
        if (this.status >= 200 && this.status < 300) {
          resolve(response);
        } else {
          reject(response);
          if (ajax.onerror) {
            ajax.onerror(this);
          } else {
            reject(response);
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
      
      xhr.open(method, 'ajax/' + url);
      xhr.setRequestHeader('Content-Type', contentType);
      xhr.send(data);
    });
    
    return promise;
  }

  ajax.get = request.bind(null, 'GET');
  ajax.put = request.bind(null, 'PUT');
  ajax.post = request.bind(null, 'POST');
  ajax.delete = request.bind(null, 'DELETE');
  
  return ajax;
})();
