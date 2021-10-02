module.exports = function(eleventyConfig) {
  
  eleventyConfig.addPassthroughCopy("js/index.min.js");
  eleventyConfig.addPassthroughCopy("images");
  
  // Return your Object options:
  return {
    dir: {
      output: "_site",
      data: "_data"
    }
  }
};