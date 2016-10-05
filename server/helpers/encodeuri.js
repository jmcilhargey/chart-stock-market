"use strict";

module.exports = function(uri) {
  return encodeURIComponent(uri).replace(/[!'()*]/g, (char) => {
    return "%" + char.charCodeAt(0).toString(16);
  });
}
