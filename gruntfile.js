module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        
        less : {
            development: {
                files: {
                    'src/css/<%= pkg.name %>.css': ['src/less/<%= pkg.name %>.less']
                }
            }
        },
        
        cssmin: {
            target: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/css',
                        src: '<%= pkg.name %>.css',
                        dest: 'dist',
                        ext: '.min.css'
                    }
                ]
            }
        },
        
        copy: {
            js: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/js',
                        src: '*.js',
                        dest: 'dist'
                    }
                ]
            },
            plugins: {
                files: [
                    {
                        expand: true,
                        cwd: 'bower_components/jquery/dist',
                        src: 'jquery.min.js',
                        dest: 'lib/jquery'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/jquery-ui',
                        src: ['jquery-ui.min.js', 'themes/ui-lightness/jquery-ui.min.css'],
                        dest: 'lib/jquery',
                        rename: function (dest, src) {          // The `dest` and `src` values can be passed into the function
                            return dest + '/' + src.replace('themes/ui-lightness/', ''); // The `src` is being renamed; the `dest` remains the same
                        }
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/jquery-ui-touch-punch-improved',
                        src: 'jquery.ui.touch-punch-improved.js',
                        dest: 'lib/jquery'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap/dist',
                        src: '**',
                        dest: 'lib/bootstrap'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/lobibox/dist',
                        src: '**',
                        dest: 'lib/lobibox'
                    }
                ]
            },
            css: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/css',
                        src: '*.css',
                        dest: 'dist'
                    }
                ]
            }
        },
        
        uglify: {
            options: {
                mangle: false
            },
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/js',
                        src: '*.js',
                        dest: 'dist',
                        ext: '.min.js'
                    }
                ]
            }
        },
        
        watch: {
            scripts: {
                files: ['src/js/*.js'],
                tasks: ['copy:js', 'uglify']
            },
            css: {
                files: 'src/less/*.less',
                tasks: ['less', 'cssmin', 'copy:css']
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('default', ['less', 'cssmin', 'copy', 'uglify', 'watch']);
};