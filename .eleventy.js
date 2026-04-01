module.exports = function (eleventyConfig) {
  // Pass CSS through as-is
  eleventyConfig.addPassthroughCopy("src/css");

  // Poems collection sorted newest-first
  eleventyConfig.addCollection("poems", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/poems/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Human-readable date filter: "April 1, 2026"
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  });

  // ISO date filter for <time datetime="...">
  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return new Date(dateObj).toISOString().split("T")[0];
  });

  // Current build year for footer copyright
  eleventyConfig.addFilter("buildYear", () => {
    return new Date().getFullYear();
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
