const Moment = require('moment');

module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter('date', function(value, format) {
    return Moment(value).format(format);
  });
};