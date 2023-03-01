"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _errors = require("@feathersjs/errors");
const errorHandler = error => {
  if (error.response) {
    // console.log(error.response.status);
    // console.log(error.response.data);
    switch (error.response.status) {
      case '':
        //   break;
        // case '':
        break;
      default:
    }
  } else {
    // console.log(error.message);
    throw new _errors.BadRequest(error.message);
  }
};
var _default = errorHandler;
exports.default = _default;