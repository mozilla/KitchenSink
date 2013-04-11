define(function (require, exports, module) {
/*
slick
*/"use strict"

module.exports = "document" in window ? require("./finder") : { parse: require("./parser") }

  return module.exports;

});
