# Lintlovin

Lintlovin sets up your project for automatic linting, whitespace checking, and runs mocha tests (if you have any).

On install (`npm install @voxpelli/lintlovin --save-dev`) it will set up a Grunt file, `.editorconfig`, `.jshintrc`, and a git hook that runs test before you push. The gotcha here is that it will run tests on what is in you working directory, and not on the actual contents of the branch.

To run tests continually while editing run `grunt watch` in your project. To run tests manually just run `npm test`.

## ESLint options

By default uses [semistandard](https://github.com/Flet/semistandard), but this is easily overrideable through the `.eslintrc` in ones own project.

## Available Grunt tasks

The `npm`-based commands *don't* need [grunt-cli](https://github.com/gruntjs/grunt-cli), but the `grunt` commands do.

* **default** – the default task, the one invoked when running just `grunt`, will if no additional tasks are added just run the `test` task.
* **test** – lints all files to the defined ESLint and EditorConfig coding style guidelines and, unless `noMocha` has been set to `true`, runs all tests in a `test/`-folder if such a one exist, with the exclusion of any tests in a `test/integration/` folder. Can be invoked through either `grunt test` or `npm test`.
* **test-all** – like `test`, but also runs the tests in the `test/integration/` folder. Can be invoked through either `grunt test-all` or `npm run test-all`.
* **watch** – watches for file changes and runs `test` on any relevant change. Can be invoked through `grunt watch`.

## lintlovin.initConfig(grunt[, config] [, options])

To be run from the parent project's Gruntfile.js. Initializes the `grunt` object sent in with a basic task setup. Also allows additional task setups to be sent in through `config` and for altering the basic setup in some ways through `options`.

### Options

* **integrationWatch** – makes the `watch` task also run tests in `test/integration/`, which can be unfeasible in big projects, but nice in smaller ones. Defaults to `false`.
* **alwaysIntegration** – makes the `test` task also run tests in `test/integration/`, which can be unfeasible in big projects, but nice in smaller ones. Defaults to `false`.
* **jsFiles** – an array of additional files to watch and lint. By default `.js`-files in top folder or below the `bin/`, `cli/`, `lib/` or `test/` folders will be watched and linted. (Also any non-js file in `test/` will be watched and will thus retrigger a test when changed)
* **spaceFiles** – an array of additional files to just watch and whitespace lint.
* **dependencyFiles** – an array of additional files to just check for dependencies.
* **watchFiles** – an array of additional files to just watch.
* **enableCoverageEvent** – enables the [grunt-mocha-istanbul coverage event](https://github.com/pocesar/grunt-mocha-istanbul#the-coverage-event) on tests
* **extraDefaultTasks** – an array of additional tasks to add to the `default` task alias
* **extraTestTasks** – an array of additional tasks to add to the `test` task alias
* **extraTestAllTasks** – an array of additional tasks to add to the `test-all` task alias
* **extraWatchTasks** – an object of additional watch task definitions
* **noIntegration** – whether there are integration tests in `test/integration/` or not. Defaults to `true` if `test/integration/` exists.
* **noMocha** – disables the [Mocha](http://visionmedia.github.io/mocha/) tests. Mocha tests are otherwise run if a `test/`-folder is found in the parent project.
* **noTiming** – disables the [time-grunt](https://github.com/sindresorhus/time-grunt) performance output
* **noDependencyCheck** – disables the [dependency-check](https://github.com/maxogden/dependency-check) plugin
* **ignoreUnusedDependencies** – ignores the specified modules when looking for unused modules
