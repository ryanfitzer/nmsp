module.exports = function ( grunt ) {

    grunt.initConfig( {

        copy: {
            dist: {
                src: './src/nmsp.js',
                dest: './dist/nmsp.js'
            }
        },
        uglify: {
            options: {
                report: 'gzip', // requires `grunt --verbose`
                compress: {
                    drop_console: true
                }
            },
            dist: {
                src: './src/nmsp.js',
                dest: './dist/nmsp.min.js'
            }
        }
    } );

    grunt.loadNpmTasks( 'grunt-contrib-copy' );

    grunt.loadNpmTasks( 'grunt-contrib-uglify' );

    grunt.registerTask( 'default', [
        'copy',
        'uglify'
    ] );

};
