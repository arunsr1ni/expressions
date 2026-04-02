module.exports = function (eleventyConfig) {
  // Pass CSS and JS through as-is
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");

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

  // Split multi-paragraph text into <p> tags
  eleventyConfig.addFilter("paragraphs", (text) => {
    if (!text) return "";
    return text
      .trim()
      .split(/\n\s*\n/)
      .map((p) => `<p class="poem-synopsis-text">${p.trim().replace(/\n/g, " ")}</p>`)
      .join("\n");
  });

  return {
    pathPrefix: "/expressions/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
