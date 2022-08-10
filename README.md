# nmsp #

[![NPM version](https://img.shields.io/npm/v/nmsp.svg)](https://www.npmjs.com/package/nmsp) [![Build Status](https://img.shields.io/travis/ryanfitzer/nmsp.svg)](https://travis-ci.org/ryanfitzer/nmsp?branch=master) ![Total downloads](https://img.shields.io/npm/dt/nmsp.svg) [![Maintainability](https://img.shields.io/codeclimate/maintainability/ryanfitzer/nmsp.svg)](https://codeclimate.com/github/ryanfitzer/nmsp/maintainability)

The most valuable use case for `nmsp` is in a browser environment where the data required by your application is provided by various legacy/3rd party sources (via embedded `<script>` tags, asynchronous requests, etc.).
  
  - Creates namespace instances that provide helpful methods for easy management.
  - Provides static methods for managing non-`nmsp` objects.
  - Supports [UMD](https://github.com/umdjs/umd) for flexible module loading support.
  - Tiny. Only 513 bytes, gzipped.
  - Supports all modern browsers, IE, NodeJS and Nashorn.

The typical solution has been to store everything in top-level object literal. The object literal approach definitely works, but it can become very fragile due to the potential for naming conflicts and changes/updates to your data during the life of your application. Managing your namespace(s) with `nmsp` significantly reduces this pain.

In addition, these data sources may need to be handled before your application's js bundles have been loaded (which means your [Lodash](https://lodash.com) utils aren't available). For example, when your application is loaded via a `<script>` tag at the end of the `<body>`, but various data sources are embedded via inline `<script>` tags throughout the `<body>` and `<head>`. The tiny size of `nmsp` helps to minimize the downsides of loading it in `<head>` of your document.

------
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [nmsp](#nmsp)
  - [Installation](#installation)
    - [CommonJS](#commonjs)
    - [AMD](#amd)
    - [Browser Global](#browser-global)
  - [Usage](#usage)
  - [Properties](#properties)
    - [`nmsp`](#nmsp-1)
  - [Static Methods](#static-methods)
    - [`nmsp.extend( dest, src )`](#nmspextend-dest-src-)
    - [`nmsp.atPath( path, src )`](#nmspatpath-path-src-)
    - [`nmsp.fromPath( path )`](#nmspfrompath-path-)
    - [`nmsp.plain( src )`](#nmspplain-src-)
  - [Instance Methods](#instance-methods)
    - [`nmsp( [initialValue] )`](#nmsp-initialvalue-)
    - [`nmsp#extend( [path], src )`](#nmspextend-path-src-)
    - [`nmsp#atPath( path )`](#nmspatpath-path-)
    - [`nmsp#plain()`](#nmspplain)
  - [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Installation ##


### CommonJS ###


Install the latest version from [npm](https://www.npmjs.com/package/nmsp):

```bash
npm install nmsp
```

Add the `nmsp` package to your app:

```js
const nmsp = require( 'nmsp' );
```

### AMD ###

The API is exported as an anonymous module. If you're not familiar with AMD, [RequireJS](https://requirejs.org/docs/start.html) is a great place to start.


### Browser Global ###

Download the latest [development](https://unpkg.com/nmsp/dist/nmsp.js) and [production](https://unpkg.com/nmsp/dist/nmsp.min.js) versions from [UNPKG](https://unpkg.com/nmsp/dist/). Once the script is loaded, the `nmsp` function can be accessed globally.

```html
<!-- When deploying, replace "nmsp.js" with "nmsp.min.js". -->
<script src="nmsp.js"></script>
```



## Usage ##


Create and extend namespace:
    
    // Supports a path (string or array) or an object
    const ns = nmsp( 'a.b.c' );
    
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

Identifies object as an `nmsp` namespace.

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

    const dest = {
      a: 1,
      b: {
        c: 1
      }
    };

    const src = {
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

  - `path` `{String|Array}` The path to search in the object.
  - `src` `{Object}` The object to search.

Returns:

  - `{*}`: The value at the provided path.

Example:

    const src = {
      a: {
        b: {
          c: {
            d: 'Come and get me!'
          }
        }
      }
    };

    const result = nmsp.atPath( 'a.b.c.d', src );
    
    // or
    
    const result = nmsp.atPath( [ 'a', 'b', 'c', 'd' ], src );

Result:

    'Come and get me!'


### `nmsp.fromPath( path )` ###

Create a nested object based on the provided path.

Arguments:

  - `path` `{String|Array}`: The path with which to model the object.

Returns:

  - `{Object}`: The object modeled after the provided path.

Example:

    const result = nmsp.fromPath( 'a.b.c.d' );
    
    // or
    
    const result = nmsp.fromPath( [ 'a', 'b', 'c', 'd' ] );

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
 
    const props = {
        foo: {
            value: 'Foo',
            enumerable: true
        }
    };
    
    const src = Object.create({
        bar: 'Bar'
    }, props );

    const result = nmsp.plain( src );

Results:

    assert.ok( 'foo' in src );
    assert.ok( 'bar' in src );
    assert.ok( 'foo' in result );
    assert.ok( !( 'bar' in result ) );
    


## Instance Methods ##


### `nmsp( [initialValue] )` ###

Create a namespace object with an API that enables easy extension. This function mutates the object passed as `initialValue`.

Arguments:

  - `[initialValue]` `{Object|String|Array}`: Create a namespace with an existing object, or use a path (ex: `'a.b.c'` or `[ 'a', 'b', 'c' ]` ) as the model from which to create the object.

Returns:

  - `{Object}`: A namespace object extended with the `nmsp` API.

Example with no `initialValue`:
    
    const ns = nmsp();

Example with an object as the `initialValue`:

    const ns = nmsp({
      foo: {
        bar: {
          baz: {}
        }
      }
    });

Example with a path string as the `initialValue`:

    const ns = nmsp( 'foo.bar.baz' );
    
Example with a path array as the `initialValue`:
    
    const ns = nmsp( [ 'foo', 'bar', 'baz' ] );



### `nmsp#extend( [path], src )` ###

Extend (recursively) the namespace object with a src value. A an optional `path` argument can be passed to extend the namespace object at a nested position.

If the value at the specified `path` resolves to:

  - an array, it is concatenated with the `src` value.
  - an object, it is recursively assigned with the properties of the `src` object.
  - a non-array or non-object, the value is overritten with the `src` value.

Arguments:

   - `[path]` `{String|Array}`: The position (ex: `'a.b.c'` or `[ 'a', 'b', 'c' ]` ) to extend in the namespace object.
   - `src` `{Mixed}`: The value that will extend the namespace object. If no `path` argument is provided, `src` must be an object.

Returns:

  - `{undefined}`

Example:

    const ns = nmsp( { a: {} } );

    ns.extend( 'a.b', {
      c: 'c'
    });
    
    // or
    
    ns.extend( [ 'a', 'b' ], {
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

  - `path` `{String|Array}` The path to search in the object.

Returns:

  - `{*}`: The value at the provided path.

Example:

    const ns = {
      a: {
        b: {
          c: {
            d: 'Come and get me!'
          }
        }
      }
    };
    
    nmsp( ns );

    const result = ns.atPath( 'a.b.c.d' );
    
    // or
    
    const result = ns.atPath( [ 'a', 'b', 'c', 'd' ] );

Result:

    'Come and get me!'


### `nmsp#plain()` ###

Create a plain object that consists of only the enumerable own properties of the instance object, removing the `nmsp` API.

Returns:

  - `{Object}`: A plain object with all non-enumerable non-own properties removed.

Example

    const ns = {
        foo: 'Foo'
    });
    
    nmsp( ns );

    const result = ns.plain();

Results:

    assert.ok( 'foo' in ns );
    assert.ok( 'nmsp' in ns );
    assert.ok( 'foo' in result );
    assert.ok( !( 'nmsp' in result ) );



## License ##

Copyright © 2016, [Ryan Fitzer](https://github.com/ryanfitzer). Released under the [MIT license](https://github.com/ryanfitzer/nmsp/blob/master/LICENSE).
