# nmsp #

[![nmsp on npm](https://badge.fury.io/js/nmsp.svg)](https://www.npmjs.com/package/nmsp) [![Build Status](https://api.travis-ci.org/ryanfitzer/nmsp.svg?branch=master)](https://travis-ci.org/ryanfitzer/nmsp?branch=master) [![Coverage Status](https://coveralls.io/repos/github/ryanfitzer/nmsp/badge.svg?branch=master)](https://coveralls.io/github/ryanfitzer/nmsp?branch=master) [![Code Climate](https://codeclimate.com/github/ryanfitzer/nmsp/badges/gpa.svg)](https://codeclimate.com/github/ryanfitzer/nmsp)

A tiny module (479 bytes gzipped) for creating, managing and extending your namespaces in the browser (IE9+) and NodeJS (4.0.0+).

The most valuable use case for `nmsp` is in a browser environment where the data required by your application is provided by various legacy/3rd party sources (via embedded `<script>` tags, asynchronous requests, etc.).

The typical solution has been to store everything in top-level object literal. The object literal approach definitely works, but it can become very fragile due to the potential for naming conflicts and changes/updates to your data during the life of your application. Managing your namespace(s) with `nmsp` significantly reduces this pain.

In addition, these data sources may need to be handled before your application is even loaded (where you may have something like [Lodash](https://lodash.com) available). For example, when your application is loaded via a `<script>` tag at the end of the `<body>`, but various data sources may need to be embedded throughout the `<body>` and `<head>`. The tiny size of `nmsp` helps to minimize the downsides of loading it in `<head>` of your document.



## Features ##
  
  - Creates namespace instances that provide helpful methods for easy management.
  - Provides static methods for managing non-`nmsp` objects.
  - Supports [UMD](https://github.com/umdjs/umd) for flexible module loading support.
  - Tiny. Only 479 bytes, gzipped.
  - Support IE9+ and NodeJS 4.0.0+.



## Install ##

    $ npm install nmsp --save



## Usage ##

Browser (supports UMD):

    <script src="node_modules/nmsp/nmsp.js"></script>

Node:

    const nmsp = require( 'nmsp' );

Create and extend namespace:
    
    // Supports a path string or an object
    var ns = nmsp( 'a.b.c' );
    
    // Add a `d` property into the `b` member
    ns.extend( 'a.b', { d: 'd' } );
    
    // Add an `e` property into the `a` member
    ns.extend( 'a.e', { f: 'f' } );
    
    // Add a top-level property
    ns.extend( { g: 'g' } );

Result:

    {
      a: {
        b: {
          c: {},
          d: 'd',
        },
        e: {
          f: 'f'
        }
      },
      g: 'g'
    }



## Properties ##


### `nmsp` ###

Identifies an `nmsp` namespace.

  - Type: `Boolean`
  - Value: `true`



## Static Methods ##


### `nmsp.extend( dest, src )` ###

Assign (recursively) the properties of a source object to a destination object. This method mutates the `dest` object. Existing properties that resolve to objects will be extended, all other values are overwritten.

Arguments:

   - `dest` `{Object}`: The object to extend.
   - `src` `{Object}`: The object to merge into the destination.

Returns:

  - `{Object}`: The extended destination object. 

Example:

    var dest = {
      a: 1,
      b: {
        c: 1
      }
    };

    var src = {
      b: {
        d: 1
      }
    };

    nmsp.extend( dest, src );
    
Result:

    {
      a: 1,
      b: {
        c: 1,
        d: 1
      }
    }


### `nmsp.atPath( path, src )` ###

Get the value at a path in a source object.

Arguments:

  - `path` `{String}` The path to search in the object.
  - `src` `{Object}` The object to search.

Returns:

  - `{*}`: The value at the provided path.

Example:

    var src = {
      a: {
        b: {
          c: {
            d: 'Come and get me!'
          }
        }
      }
    };

    var result = nmsp.atPath( 'a.b.c.d', src );

Result:

    'Come and get me!'


### `nmsp.fromPath( path )` ###

Create a nested object based on the provided path.

Arguments:

  - `path` `{String}`: The path with which to model the object.

Returns:

  - `{Object}`: The object modeled after the provided path.

Example:

    var result = nmsp.fromPath( 'a.b.c.d' );

Result:

    {
      a: {
        b: {
          c: {
            d: {}
          }
        }
      }
    }


### `nmsp.plain( src )` ###

Create a plain object that consists of only the enumerable own properties of a source object.

Arguments:

  - `src` `{Object}`: The source object.

Returns:

  - `{Object}`: A plain object with all non-enumerable non-own properties removed.

Example
 
    var props = {
        foo: {
            value: 'Foo',
            enumerable: true
        }
    };
    
    var src = Object.create({
        bar: 'Bar'
    }, props );

    var result = nmsp.plain( src );

Results:

    assert.ok( 'foo' in src );
    assert.ok( 'bar' in src );
    assert.ok( 'foo' in result );
    assert.ok( !( 'bar' in result ) );
    


## Instance Methods ##


### `nmsp( [initialValue] )` ###

Create a namespace object with an API that enables easy extension. This function mutates the object passed as `initialValue`.

Arguments:

  - `[initialValue]` `{String|Object}`: Create a namespace with an existing object. A path string (ex: `'a.b.c'` ) can be passed as the model for the namespace.

Returns:

  - `{Object}`: An object extended with the `nmsp` API.

Example:
    
    var a = nmsp();
    
    var b = nmsp( 'foo.bar.baz' );
    
    var c = {};
    nmsp( c );



### `nmsp#extend( [path], src )` ###

Assign (recursively) the properties of the source object to instance object. Existing properties that resolve to objects will be extended, all other types are overwritten.

Arguments:

   - `[path]` `{String}`: A path string (ex: `'a.b.c'` ) as the destination to extend within the object.
   - `src` `{Object}`: The object to merge into the destination.

Returns:

  - `{undefined}`

Example:

    var ns = nmsp( { a: {} } );

    ns.extend( 'a.b', {
      c: 'c'
    });
    
    
Result:

    {
      a: {
        b: {
          c: 'c'
        }
      }
    }


### `nmsp#atPath( path )` ###

Get the value at a path in the instance object.

Arguments:

  - `path` `{String}` The path to search in the object.

Returns:

  - `{*}`: The value at the provided path.

Example:

    var ns = {
      a: {
        b: {
          c: {
            d: 'Come and get me!'
          }
        }
      }
    };
    
    nmsp( ns );

    var result = ns.atPath( 'a.b.c.d' );

Result:

    'Come and get me!'


### `nmsp#plain()` ###

Create a plain object that consists of only the enumerable own properties of the instance object, removing the `nmsp` API.

Returns:

  - `{Object}`: A plain object with all non-enumerable non-own properties removed.

Example

    var ns = {
        foo: 'Foo'
    });
    
    nmsp( ns );

    var result = ns.plain();

Results:

    assert.ok( 'foo' in ns );
    assert.ok( 'nmsp' in ns );
    assert.ok( 'foo' in result );
    assert.ok( !( 'nmsp' in result ) );



## License ##

Copyright © 2016, [Ryan Fitzer](https://github.com/ryanfitzer). Released under the [MIT license](https://github.com/ryanfitzer/nmsp/blob/master/LICENSE).

