'use strict';

var fsModule = require('fs');
var pathModule = require('path');

exports.initConfig = function (grunt, config, options) {
  config = config || {};
  options = options || {};

  if (!options.noTiming) {
    require('time-grunt')(grunt);
  }
  if (options.noMocha === undefined) {
    options.noMocha = !fsModule.existsSync('test');
  }

  if (options.noMocha) {
    options.noIntegration = true;
  } else if (options.noIntegration === undefined) {
    options.noIntegration = !fsModule.existsSync('test/integration');
  }

  // Default task options
  var defaults = {
    pkg: grunt.file.readJSON('package.json'),
    eslint: {
      src: [
        '*.js',
        'lib/**/*.js',
        'test/**/*.js',
        'bin/**/*.js',
        'cli/**/*.js',
        'tasks/**/*.js'
      ].concat(options.jsFiles || [])
    },
    lintspaces: {
      files: [
        '<%= eslint.src %>'
      ].concat(options.spaceFiles || []),
      options: {
        editorconfig: '.editorconfig',
        ignores: ['js-comments']
      }
    },
    watch: Object.assign({
      basic: {
        files: [
          '<%= lintspaces.files %>',
          'test/**/*'
        ].concat(options.watchFiles || []),
        tasks: [!options.noMocha && options.integrationWatch ? 'test-all' : 'test']
      }
    }, options.extraWatchTasks || {})
  };

  if (!options.noDependencyCheck) {
    defaults['dependency-check'] = {
      files: ['<%= eslint.src %>'].concat(options.dependencyFiles || []),
      options: {
        excludeUnusedDev: true,
        ignoreUnused: options.ignoreUnusedDependencies || []
      }
    };
  }

  if (!options.noMocha) {
    defaults.mocha_istanbul = {
      options: {
        ui: 'tdd',
        coverage: options.enableCoverageEvent === true,
        reportFormats: ['lcov']
      },
      basic: {
        src: options.alwaysIntegration || (options.integrationTravis && process.env.TRAVIS)
          ? ['test/**/*.js']
          : ['test/**/*.js', '!test/integration/**/*.js']
      },
      integration: {
        src: ['test/integration/**/*.js']
      }
    };
  }

  grunt.initConfig(Object.assign(defaults, config));

  var plugins = [
    'grunt-notify',
    'grunt-lintspaces',
    'grunt-eslint',
    'grunt-contrib-watch'
  ];

  var testTasks = ['lintspaces', 'eslint', 'setTestEnv'];
  var integrationTestTasks = ['test'];

  if (!options.noDependencyCheck) {
    plugins.push('dependency-check');
    testTasks.push('dependency-check');
  }

  if (!options.noMocha) {
    plugins.push('grunt-mocha-istanbul');
    testTasks.push('mocha_istanbul:basic');

    if (!options.noIntegration && !options.alwaysIntegration) {
      integrationTestTasks.push('mocha_istanbul:integration');
    }
  }

  testTasks = testTasks.concat(options.extraTestTasks || []);
  integrationTestTasks = integrationTestTasks.concat(options.extraTestAllTasks || []);

  // Manually load the plugins so that we don't pollute the parent module
  // with loads of peer dependencies.
  plugins.forEach(function (name) {
    var cwd;
    // Uhm, HACK! But WTF Grunt!
    if (fsModule.existsSync(pathModule.join(__dirname, '/node_modules/', name))) {
      cwd = process.cwd();
      process.chdir(__dirname);
    }

    grunt.loadNpmTasks(name);

    if (cwd) {
      process.chdir(cwd);
    }
  });

  // Whenever we have some special built tasks, add them into the /tasks folder and uncomment the line below
  // grunt.loadTasks(pathModule.join(__dirname, 'tasks'));

  grunt.registerTask('setTestEnv', 'Ensure that environment (database etc) is set up for testing', function () {
    process.env.NODE_ENV = 'test';
  });

  grunt.registerTask('test', testTasks);
  grunt.registerTask('test-all', integrationTestTasks);
  grunt.registerTask('default', ['test'].concat(options.extraDefaultTasks || []));
};
