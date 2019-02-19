'use strict';

if ( process.env.NODE_ENV === 'production' ) {

    module.exports = require( './dist/nmsp.min.js' );

}
else {

    module.exports = require( './dist/nmsp.js' );

}