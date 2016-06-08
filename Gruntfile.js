'use strict';

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig({

        jshint: {
            options: {
                jshintrc: true,
                reporter: require('jshint-stylish')
            },
            all: ['Gruntfile.js', 'src/module.js', 'lib/**/*.js', 'test/**/*.js']
        },
        // Automatically inject Bower components into the app
        wiredep: {
            test: {
                devDependencies: true,
                src: '<%= karma.unit.configFile %>',
                ignorePath: /\.\.\//,
                fileTypes: {
                    js: {
                        block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
                        detect: {
                            js: /'(.*\.js)'/gi
                        },
                        replace: {
                            js: '\'{{filePath}}\','
                        }
                    }
                }
            }
        },
        concat: {
            js: {
                src: [
                    'src/intro.js',
                    'src/module.js',
                    'lib/**/*.js',
                    'src/outro.js',
                ],
                dest: './dist/ng-infinite-scroll.js'
            }
        },
        uglify: {
            js: {
                src: ['./dist/ng-infinite-scroll.js'],
                dest: './dist/ng-infinite-scroll.min.js',
                options: {
                    sourceMap: true
                }
            }
        },
        // Test settings
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        }
    });

    grunt.registerTask('default', [
        'jshint',
        'wiredep',
        'concat',
        'uglify',
        //'karma'
    ]);
};