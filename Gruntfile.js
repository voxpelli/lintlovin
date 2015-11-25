'use strict';

var lintlovin = require('./');

module.exports = function (grunt) {
  lintlovin.initConfig(grunt, {}, {
    dependencyFiles: ['!bin/Gruntfile.default.js'],
    ignoreUnusedDependencies: [
      'dependency-check',
      'grunt-eslint',
      'grunt-contrib-watch',
      'grunt-lintspaces',
      'grunt-mocha-istanbul',
      'grunt-notify'
    ]
  });
};
