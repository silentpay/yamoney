// Generated by CoffeeScript 1.6.1
var LazyList, OperationList, extend,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

extend = require('extend');

LazyList = require('./lazy-list');

OperationList = (function(_super) {

  __extends(OperationList, _super);

  function OperationList() {
    return OperationList.__super__.constructor.apply(this, arguments);
  }

  OperationList.prototype.info = function(callback) {
    var data;
    data = extend({
      details: true,
      start_record: this.$skip,
      records: this.$limit
    }, this.$filter);
    this.service.invoke({
      method: 'post',
      name: 'operation-history',
      data: data,
      callback: function(error, data) {
        if (error != null) {
          return callback(error);
        } else {
          return callback(error, data.operations);
        }
      }
    });
    return this;
  };

  return OperationList;

})(LazyList);

module.exports = OperationList;