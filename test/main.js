var assert = require( 'assert' );
var nmsp = require( '../src/nmsp' );

describe( 'Static Methods', function () {

    it( 'nmsp.extend() should extend destination', function() {

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

        nmsp.extend( dest, src );

        assert.deepEqual( dest, expected );

    });

    it( 'nmsp.atPath() should accept a path array with dot notation', function () {

        var expected = {
            a: {
                b: {
                    'c.d': {
                        'd.e': 'foo'
                    }
                }
            }
        };

        var shouldEqualObject = nmsp.atPath( [ 'a', 'b', 'c.d', 'd.e' ], expected );

        assert.deepEqual( shouldEqualObject, 'foo' );

    });

    it( 'nmsp.atPath() should return value at path', function () {

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
        var shouldEqualObjectfromArray = nmsp.atPath( [ 'a', 'b', 'c', 'd' ], src );

        assert.ok( shouldEqualObject );
        assert.ok( shouldEqualObjectfromArray );

        var shouldEqualUndefined = nmsp.atPath( 'a.b.c.d.e.f', src );
        var shouldEqualUndefinedFromArray = nmsp.atPath( [ 'a', 'b', 'c', 'd', 'e', 'f' ], src );

        assert.deepEqual( shouldEqualUndefined, undefined );
        assert.deepEqual( shouldEqualUndefinedFromArray, undefined );

    });

    it( 'nmsp.fromPath() should return an object', function() {

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
        var testFromArray = nmsp.fromPath( [ 'a', 'b', 'c', 'd' ] );

        assert.deepEqual( test, expected );
        assert.deepEqual( testFromArray, expected );

    });

    it( 'nmsp.plain() should return a plain object', function () {

        var props = {
            foo: {
                value: 'Foo',
                enumerable: true
            }
        };

        var src = Object.create({
            bar: 'Bar'
        }, props );

        var test = nmsp.plain( src );

        assert.ok( 'foo' in src );
        assert.ok( 'bar' in src );

        assert.ok( 'foo' in test );
        assert.ok( !( 'bar' in test ) );

    });

});

describe( 'Instance Methods', function () {

    it( 'nmsp() should create a namespace', function() {

        var expectedValue = {};

        var test = nmsp();

        assert( test.nmsp );
        assert.deepEqual( test, expectedValue );

    });

    it( 'nmsp() should accept an object', function() {

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

    it( 'nmsp() should accept a path', function() {

        var expected = {
            a: {
                b: {
                    c: {
                        d: {}
                    }
                }
            }
        };

        var test = nmsp( 'a.b.c.d' );
        var testFromArray = nmsp( [ 'a', 'b', 'c', 'd' ] );

        assert.deepEqual( test, expected );
        assert.deepEqual( testFromArray, expected );

    });

    it( 'nmsp#atPath() should return value at provided path', function () {

        var expected = {
            d: true
        };

        var test = nmsp({
            a: {
                b: {
                    c: {
                        d: true
                    }
                }
            }
        });

        var actual = test.atPath( 'a.b.c' );
        var actualFromArray = test.atPath( [ 'a', 'b', 'c' ] );

        assert.deepEqual( actual, expected );
        assert.deepEqual( actualFromArray, expected );

    });

    it( 'nmsp#plain() should return a plain object', function() {

        var test = nmsp({
            bar: 'Bar'
        }).plain();

        assert.ok( 'bar' in test );
        assert.ok( !( 'nmsp' in test ) );

    });

    it( 'nmsp#extend() should accept an object', function() {

        var expected = {
            a: 1,
            b: {
                c: 1,
                d: 1
            }
        };

        var test = nmsp();

        var test2 = test.extend({
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

        assert.ok( typeof test2 === 'undefined' );
        assert.deepEqual( test, expected );

    });

    it( 'nmsp#extend() should accept a path', function() {

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
        var testFromArray = nmsp();

        test.extend({
            a: 1,
            b: {
                c: 1
            }
        });

        testFromArray.extend({
            a: 1,
            b: {
                c: 1
            }
        });

        test.extend( 'b.d.e', {
            f: 'f'
        });

        testFromArray.extend( [ 'b', 'd', 'e' ], {
            f: 'f'
        });

        assert.deepEqual( test, expected );
        assert.deepEqual( testFromArray, expected );

    });

    it( 'nmsp#extend() should return undefined', function() {

        var src = nmsp();

        var test = src.extend({
            a: 1
        });

        assert.ok( typeof test === 'undefined' );

    });

    it( 'nmsp() should accept an object and nmsp#extend() should accept an object', function() {

        var expected = {
            a: 1,
            b: {
                c: 1
            }
        };

        var test = nmsp({
            a: 1
        });

        test.extend({
            b: {
                c: 1
            }
        });

        assert.deepEqual( test, expected );

    });

    it( 'nmsp() should accept an object and nmsp#extend() should accept a path and an object', function() {

        var expected = {
            a: {
                b: {
                    c: 1
                }
            }
        };

        var test = nmsp({
            a: 1
        });

        var testFromArray = nmsp({
            a: 1
        });

        test.extend( 'a.b', {
            c: 1
        });

        testFromArray.extend( [ 'a', 'b' ], {
            c: 1
        });

        assert.deepEqual( test, expected );
        assert.deepEqual( testFromArray, expected );

    });

    it( 'nmsp() should accept a path and nmsp#extend() should accept a path and an object', function() {

        var expected = {
            a: {
                b: {
                    c: {
                        d: {}
                    }
                }
            }
        };

        var test = nmsp( 'a.b.c' );
        var testFromArray = nmsp( [ 'a', 'b', 'c' ] );

        test.extend( 'a.b.c.d', {} );
        testFromArray.extend( [ 'a', 'b', 'c', 'd' ], {} );

        assert.deepEqual( test, expected );
        assert.deepEqual( testFromArray, expected );

    });

});
