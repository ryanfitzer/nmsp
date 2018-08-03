module.exports = function( grunt ) {

    /* Configure */
    grunt.initConfig({

        uglify: {
            dist: {
                options: {
                    report: 'gzip', // grunt --verbose
                    compress: true
                },
                files: {
                    'nmsp.min.js': [ 'nmsp.js' ]
                }
            }
        }
    });

    grunt.loadNpmTasks( 'grunt-contrib-uglify' );

    grunt.registerTask( 'default', [
        'uglify'
    ]);
};
