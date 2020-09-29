module.exports = function (config) {
  "use strict";

  require("./karma.conf")(config);
  config.set({

    // test results reporter to use
    // possible values: "dots", "progress", "coverage"
    reporters: ["progress"],

    // start these browsers
    browsers: ["ChromeHeadless"],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true

  });
};
