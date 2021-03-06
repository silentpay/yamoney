// Generated by CoffeeScript 1.9.3
var Client, HTTPS, Iconv, QS;

HTTPS = require('https');

Iconv = require('iconv-lite');

QS = require('qs');

Client = (function() {
  var REQUEST_CHARSET, SERVER_NAME, SERVER_PORT;

  SERVER_NAME = 'money.yandex.ru';

  SERVER_PORT = 443;

  REQUEST_CHARSET = 'utf-8';

  function Client(options) {
    var ref, ref1, ref2, ref3;
    if (options == null) {
      options = Object.create(null);
    }
    this._host = (ref = options.host) != null ? ref : SERVER_NAME;
    this._port = (ref1 = options.port) != null ? ref1 : SERVER_PORT;
    this._charset = (ref2 = options.charset) != null ? ref2 : REQUEST_CHARSET;
    this._token = (ref3 = options.token) != null ? ref3 : null;
    this._headers = Object.create(null);
  }

  Client.prototype.setHeader = function(name, value) {
    this._headers[name] = value;
    return this;
  };

  Client.prototype.removeHeader = function(name) {
    delete this._headers[name];
    return this;
  };

  Client.prototype._requestOptions = function(name, blob) {
    var fullHeaders, headers, key, options, path, ref, value;
    path = '/api/' + name;
    headers = {
      'Authorization': 'Bearer ' + this._token,
      'Content-Type': 'application/x-www-form-urlencoded; charset=' + this._charset,
      'Content-Length': blob.length
    };
    fullHeaders = Object.create(null);
    ref = this._headers;
    for (key in ref) {
      value = ref[key];
      fullHeaders[key] = value;
    }
    for (key in headers) {
      value = headers[key];
      fullHeaders[key] = value;
    }
    options = {
      host: this._host,
      port: this._port,
      method: 'POST',
      path: path,
      headers: fullHeaders
    };
    return options;
  };

  Client.prototype._responseHandler = function(callback) {
    return (function(_this) {
      return function(response) {
        var chunks;
        chunks = [];
        response.on('readable', function() {
          var chunk;
          chunk = response.read();
          if (chunk != null) {
            chunks.push(chunk);
          }
        });
        response.on('end', function() {
          var blob, error, firstDigit, output;
          if (typeof callback !== 'function') {
            return;
          }
          blob = Buffer.concat(chunks);
          firstDigit = Math.floor(response.statusCode / 100);
          switch (firstDigit) {
            case 2:
              try {
                output = JSON.parse(Iconv.decode(blob, 'utf-8') || '{}');
                callback(null, output);
              } catch (_error) {
                error = _error;
                callback(error);
              }
              break;
            case 4:
              callback(new Error(response.headers['www-authenticate']));
              break;
            default:
              callback(new Error('Unexpected status code'));
          }
        });
      };
    })(this);
  };

  Client.prototype._errorHandler = function(callback) {
    return (function(_this) {
      return function(error) {
        if (typeof callback === "function") {
          callback(error);
        }
      };
    })(this);
  };

  Client.prototype.invokeMethod = function(name, input, callback) {
    var blob, request;
    blob = Iconv.encode(QS.stringify(input), this._charset);
    request = HTTPS.request(this._requestOptions(name, blob));
    request.on('response', this._responseHandler(callback));
    request.on('error', this._errorHandler(callback));
    request.end(blob);
    return this;
  };

  Client.prototype.setToken = function(token) {
    this._token = token;
    return this;
  };

  Client.prototype.removeToken = function() {
    this._token = null;
    return this;
  };

  Client.prototype.revokeToken = function(callback) {
    return this.invokeMethod('revoke', null, (function(_this) {
      return function(error) {
        if (error == null) {
          _this._token = null;
        }
        return typeof callback === "function" ? callback(error) : void 0;
      };
    })(this));
  };

  Client.prototype.accountInfo = function(callback) {
    return this.invokeMethod('account-info', null, callback);
  };

  Client.prototype.operationDetails = function(id, callback) {
    return this.invokeMethod('operation-details', {
      operation_id: id
    }, callback);
  };

  Client.prototype.operationHistory = function(selector, callback) {
    return this.invokeMethod('operation-history', selector, callback);
  };

  Client.prototype.requestPayment = function(options, callback) {
    return this.invokeMethod('request-payment', options, callback);
  };

  Client.prototype.processPayment = function(options, callback) {
    return this.invokeMethod('process-payment', options, callback);
  };

  return Client;

})();

module.exports = Client;
