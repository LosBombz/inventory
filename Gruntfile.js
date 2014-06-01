'use strict';
var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 9000;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'lodash'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);

    // load all grunt tasks from the node_modules directory
    // without having to register them manualy *magic*
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var appConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        config: appConfig,
        watch: {
            options: {
                nospawn: true,
                livereload: true

            },

            // watch for changes in sass files
            styles: {
                files: '<%= compass.dev.options.sassDir %>/{,*/}{,*/}*.scss',
                tasks: ['compass:dev']
            },

            // live reload page on changes made to these files
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= config.app %>/{,*/}*.html',
                    '<%= config.app %>/styles/{,*/}*.scss',
                    '{.tmp,<%= config.app %>}/scripts/{,*/}*.js',
                    '<%= config.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                    '<%= config.app %>/scripts/templates/*.{ejs,mustache,hbs}'
                ]
            }
        },

        // connect server
        connect: {
            options: {

                port: SERVER_PORT,
                // change this to '0.0.0.0' to access the server from outside
                // hostname: 'localhost'
                hostname: '0.0.0.0'
            },

            // live reload server settings
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, appConfig.app)
                        ];
                    }
                }
            },

            // dist server settings to test built code
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, appConfig.dist)
                        ];
                    }
                }
            }
        },

        // open a new browser tab with the server
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            },
        },

        // clean temp folder and dist folder
        clean: {
            dist: ['.tmp', '<%= config.dist %>/*'],
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= config.app %>/scripts/{,*/}*.js',
                '!<%= config.app %>/scripts/libs/*'
            ]
        },
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    baseUrl: '<%= config.app %>/scripts',
                    mainConfigFile: '<%= config.app %>/scripts/require.config.js',
                    name: 'bower_components/almond/almond',
                    out: '<%= config.dist %>/scripts/app.built.js',
                    preserveLicenseComments: false,
                    inlineText: true,
                    wrap: true,
                    include: ['app.main'],
                    insertRequire: ['app.main']
                },
                optimize: 'uglify'
            }
        },
        //compass tasks
        compass: {
            dist: {
                options: {
                    sassDir: '<%= config.app %>/styles/sass',
                    cssDir: '<%= config.dist %>/styles',
                    outputStyle: 'compressed',
                    imageDir: '<%= config.dist %>/images',
                    fontsDir: '<%= config.dist %>/fonts',
                    relativeAssets: true,
                    noLineComments: true,
                    environment: 'production'
                }
            },
            dev: {
                options: {
                    sassDir: '<%= config.app %>/styles/sass',
                    cssDir: '<%= config.app %>/styles/css',
                    imageDir: '<%= config.app %>/images',
                    fontsDir: '<%= config.app %>/fonts',
                    relativeAssets: true,
                    environment: 'development'
                }
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/images',
                    src: '**/*.{png,jpg,jpeg}',
                    dest: '<%= config.dist %>/images'
                }]
            }
        },
        processhtml: {
            dist: {
                files: {
                    '<%= config.dist %>/index.html': ['<%= config.app %>/index.html']
                }
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess',
                        'images/{,*/}*.{webp,gif}',
                        'fonts/{,*/}*.*',
                        'audio/{,*/}*.*',
                        'scripts/vendor/*.js'

                    ]
                }]
            }
        }
    });


    grunt.registerTask('s', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open:server', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'connect:livereload',
            'open:server',
            'watch'
        ]);
    });


    grunt.registerTask('build', [
        'clean:dist',
        'requirejs',
        'imagemin',
        'compass',
        'copy',
        'processhtml'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'build'
    ]);
};
