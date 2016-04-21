var assert = require( 'assert' );
var nmsp = require( '../index' );

it( 'nmsp.extend should extend destination', function() {

    var expected = {
        a: 1,
        b: {
            c: 1,
            d: 1
        }
    };

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

    var test = nmsp.extend( dest, src );

    assert.deepEqual( test, expected );

});

it( 'nmsp.fromPath should create an object', function() {

    var expected = {
        a: {
            b: {
                c: {
                    d: {}
                }
            }
        }
    };

    var test = nmsp.fromPath( 'a.b.c.d' );

    assert.deepEqual( test, expected );

});

it( 'nmsp.atPath should return value at path', function () {

    var src = {
      a: {
        b: {
          c: {
            d: {}
          }
        }
      }
    };

    var shouldEqualObject = nmsp.atPath( 'a.b.c.d', src );

    assert.ok( shouldEqualObject );

    var shouldEqualUndefined = nmsp.atPath( 'a.b.c.d.e.f', src );

    assert.deepEqual( shouldEqualUndefined, undefined );

});

it( 'nmsp should create a namespace object', function() {

    var expectedValue = {};

    var test = nmsp();

    assert( test.nmsp );
    assert.deepEqual( test, expectedValue );

});

it( 'providing a object to nmsp should create a namespace with the expected value', function() {

    var expected = {
        a: 1,
        b: {
            c: 1,
            d: 1
        }
    };

    var test = nmsp( expected );

    assert.deepEqual( test, expected );

});

it( 'providing a path string to nmsp should create a namespace with the expected value', function() {

    var pathValue = 'a.b.c.d';

    var expected = {
        a: {
            b: {
                c: {
                    d: {}
                }
            }
        }
    };

    var test = nmsp( pathValue );

    assert.deepEqual( test, expected );

});

it( 'providing a value to test.extend should extend test with value', function() {

    var expected = {
        a: 1,
        b: {
            c: 1,
            d: 1
        }
    };

    var test = nmsp();

    test.extend({
        a: 1,
        b: {
            c: 1
        }
    });

    test.extend({
        b: {
            d: 1
        }
    });

    assert.deepEqual( test, expected );

});

it( 'providing a path to test.extend should extend test at path', function() {

    var expected = {
        a: 1,
        b: {
            c: 1,
            d: {
                e: {
                    f: 'f'
                }
            }
        }
    };

    var test = nmsp();

    test.extend({
        a: 1,
        b: {
            c: 1
        }
    });

    test.extend( 'b.d.e', {
        f: 'f'
    });

    assert.deepEqual( test, expected );

});
