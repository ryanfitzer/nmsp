/*! github.com/ryanfitzer/nmsp/blob/master/LICENSE */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        module.exports = factory();
    } else {
        // Browser globals
        root.nmsp = factory();
    }
}(this, function ( exports ) {

    var exports = {};
    var toString = Object.prototype.toString;

    /**
     * Test if a value is an Object.
     *
     * @example
     *  if ( !isObject( someValue ) ) return;
     *
     * @param value {*} The value to test.
     * @returns {Boolean}
     */
    function isObject( value ) {

        return toString.call( value ) === toString.call( {} );
    }

    /**
     * Assign (recursively) the properties of a source object to
     * a destination object. If a `context` object is provided,
     * the returned function will use it as the destination to extend.
     *
     * @example
     *  var extendWithContext = extend( myAwesomeContext );
     *  extendWithContext( myAwesomeSource );
     *  extendWithContext( anotherAwesomeSource );
     *  // or
     *  var extender = extend();
     *  var totesExtended = extender( myTotesDest, myTotesSrc );
     *
     * @param [context] {Object} The object to use as the returned function's destination
     * @returns {Function} The function accepts a `dest` and `src` object as arguments.
     */
    function extend( context ) {

        return function ( dest, src ) {

            if ( context ) {
                src = dest;
                dest = context;
            }

            Object.keys( src ).forEach( function ( key ) {

                if ( isObject( src[ key ] ) ) {

                    dest[ key ] = isObject( dest[ key ] ) ? dest[ key ] : {};
                    
                    extend( dest[ key ] )( src[ key ] );

                }
                else {

                    dest[ key ] = src[ key ];
                }
            });

            return dest;
        }
    };

    /**
     * Get the value at a path in a source object. If a `context` object is provided,
     * the returned function will use it as the source.
     *
     * @example
     *  var atPathWithContext = atPath( myAwesomeContext );
     *  var myAwesomeValue = atPathWithContext( 'my.awesome.prop' );
     *  var myEvenMoreAwesomeValue = atPathWithContext( 'my.even.more.awesome.prop' );
     *  // or
     *  var getAtDatPath = atPath();
     *  var gimmeSomeDatValue = getAtThatPath( 'dat.prop.tho', datSrcTho );
     *
     * @param [context] {Object} The object to use as the returned function's `src` argument.
     * @param path {String} The path to search in the object.
     * @param src {Object} The object to search.
     * @returns {Function} The function accepts a `path` and `src` object as arguments and returns the value found at `path`.
     */
    function atPath( context ) {

        return function ( path, src ) {

            src = context || src;

            return path.split( '.' ).reduce( function ( accum, key ) {

                return accum && accum[ key ];

            }, src );
        }
    };

    /**
     * Create a nested object based on the provided path.
     *
     * @example
     *  var objFromPath = fromPath( 'one.two.three` );
     *  // { one: { two: { three: {} } } }
     *
     * @param path {String} The path to model the object.
     * @returns {Object}
     */
    function fromPath( path ) {

        var accumulator = {};

        var test = path.split( '.' ).reduce( function ( accum, key ) {

            accum[ key ] = {};

            return accum[ key ];

        }, accumulator );

        return accumulator;
    };

    /**
     * Create a plain object that consists of only the enumerable own properties of a source object.
     *
     * @example
     *  var myNameSpace = nmsp( { some: { data: {} } } );
     *  myNameSpace.extend( 'some.other.data', { the: 'data' } );
     *  var plainObj = myNameSpace.plain();
     *
     * @param store {Object} The object to return as a plain object.
     * @returns {Object}
     */
    function plain( store ) {

        return function( src ) {

            src = store || src;
            
            // @support: IE9+ does not support Object.assign( {}, src );
            return Object.keys( src ).reduce( function ( accum, key ) {
                
                accum[ key ] = src[ key ];
                
                return accum;
                
            }, {} );
        }
    }

    /**
     * Create an object with an API that enables easy extension.
     *
     * @example
     *  var myNameSpace = nmsp();
     *  myNameSpace.extend( { some: { data: {} } } );
     *  myNameSpace.extend( 'some.other.data', { the: 'data' } );
     *  // or
     *  var myNameSpace = nmsp( { some: { data: {} } } );
     *  myNameSpace.extend( 'some.other.data', { the: 'data' } );
     *
     *  // {
     *  //     some: {
     *  //         data: {},
     *  //         other: {
     *  //             data: {
     *  //                 the: 'data'
     *  //             }
     *  //         }
     *  //     }
     *  // }
     *
     * @param [initialValue] {Object|String} The initial object to assign to the namespace. A path string (ex: `'a.b.c.d'` ) can be passes as the model a new abject.
     * @returns `{Object}` An object extended with the `nmsp` API.
     */
    function nmsp( initialValue ) {

        var extendStore
            , store = Object.create( {} )
            ;

        if ( isObject( initialValue ) ) {
            store = initialValue;
        }
        else if ( typeof initialValue === 'string' ) {
            store = fromPath( initialValue );
        }

        extendStore = extend( store );

        return Object.defineProperties( store, {

            nmsp: {
                value: true
            },

            extend: {
                value: function ( dest, src ) {

                    if ( !src )  {

                        extendStore( dest );
                    }
                    else {

                        extendStore( fromPath( dest ) );
                        extend( atPath( store )( dest ) )( src );
                    }
                }
            },

            atPath: {
                value: atPath( store )
            },

            plain: {
                value: plain( store )
            }
        });
    }

    exports = nmsp;
    exports.extend = extend();
    exports.atPath = atPath();
    exports.plain = plain();
    exports.fromPath = fromPath;

    return exports;
}));
