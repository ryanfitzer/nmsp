/*! nmsp 1.0 | github.com/ryanfitzer/nmsp/blob/master/LICENSE */
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
     * Assign, recursively, the properties of a source object to
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

                    dest[ key ] = dest[ key ] || {};

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
     * @param src {String} The object to search.
     * @returns {Function} The function accepts a `path` and `src` object as arguments and returns the value found at `path`.
     */
    function atPath( context ) {

        return function ( path, src ) {

            src = context || src;

            return path.split( '.' ).reduce( function ( prevValue, key ) {

                return prevValue && prevValue[ key ];

            }, src );
        }
    };

    /**
     * Creates a nested object based on the provided path.
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

        path.split( '.' ).reduce( function ( prevValue, key ) {

            prevValue[ key ] = {};

            return prevValue[ key ];

        }, accumulator );

        return accumulator;
    };

    /**
     * Creates an object with methods that enable easy extension.
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
     * @param initialValue {Object|String} The initial object or path (ex: 'a.b.c.d' ) to assign to the namespace.
     */
    function nmsp( initialValue ) {

        var store = Object.create( {} )
            , extendStore = extend( store )
            ;

        if ( isObject( initialValue ) ) {
            store = initialValue;
        }
        else if ( typeof initialValue === 'string' ) {
            store = fromPath( initialValue );
        }

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

            atPath: atPath( store )
        });
    }

    exports = nmsp;
    exports.extend = extend();
    exports.atPath = atPath();
    exports.fromPath = fromPath;

    return exports;
}));
