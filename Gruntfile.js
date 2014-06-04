module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
            all: [
                'dist'
            ]
        },
        
        copy: {
            all: {
                files: [
                    {expand: true, cwd: 'src/', src: 'instruct.js', dest: 'dist/', rename: function () {return 'dist/instruct.node.js'}},
                ]
            }
        },
                    
        jshint: {
            all: [
                'src/*.js'
            ]
        },     
            
        uglify: {
            "instruct.min.js": {
                src: "dist/instruct.browser.js",
                dest: "dist/instruct.browser.min.js"
            }
        },
        
        replace: {
          md5: {
            options: {
              patterns: [
                {
                  match: 'md5',
                  replacement: '\n<%= grunt.file.read("./src/lib/md5.min.js") %>'
                }
              ]
            },
            files: [
              {expand: true, cwd: 'dist', src: ['instruct.node.js'], dest: 'dist/', rename: function () {return 'dist/instruct.browser.js'}}
            ]
          }
        },
            
        notify_hooks: {
            options: {
              enabled: true,
              max_jshint_notifications: 1, // maximum number of notifications from jshint output
              title: "InstructJS" // defaults to the name in package.json, or will use project directory's name
            }
        }
    });
        
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-notify');
    
    grunt.registerTask('default', [
        'jshint:all',
        'clean:all',
        'copy:all',
        'replace:md5',
        'uglify:instruct.min.js'
    ]);   
};