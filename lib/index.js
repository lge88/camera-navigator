
var THREE = require( 'three' );
var Tween = require( 'tween' );

module.exports = exports = CameraNavigator;


function CameraNavigator( camera ) {

  if ( !(this instanceof CameraNavigator) ) { return new CameraNavigator( object ); }

  var standardCameras = [];
  var cameraStack = [];

  var scope = this;
  this.camera = camera;

  this.standardCameras = [
    [ 'top', [ 0, 0, 1 ], [ -1, 0, 0 ] ],
    [ 'bottom', [ 0, 0, -1 ], [ 1, 0, 0 ] ],
    [ 'right', [ 0, 1, 0 ], [ 0, 0, 1 ] ],
    [ 'left', [ 0, -1, 0 ], [ 0, 0, 1 ] ],
    [ 'front', [ 1, 0, 0 ], [ 0, 0, 1 ] ],
    [ 'back', [ -1, 0, 0 ], [ 0, 0, 1 ] ],
    [ 'equalAxis', [ 1, 1, 1 ], [ 0, 0, 1 ] ]
  ].map( function( o ) {
    var c = camera.clone();
    c.name = o[0] + '_camera';
    c.position.fromArray( o[1] ).multiplyScalar( 500 );
    // c.up.fromArray( o[2] );
    c.lookAt( new THREE.Vector3( 0, 0, 0 ) );
    return [c, o[0]];
  } ).reduce( function( prev, cur ) {
    prev[cur[1]] = cur[0];
    return prev;
  }, {} );

  this.MAX_STACK_LENGTH = 10;
  this.prevStack = [];
  this.nextStack = [];

  function findCamera( name ) {
    if ( scope.standardCameras[name] ) {
      return scope.standardCameras[name];
    } else {
      var ret = null;
      this.cameraStack.some( function( c ) {
        if ( c.name === name ) {
          ret = c;
          return true
        } else {
          return false;
        }
      } );
      return ret;
    }
  }

  // API
  this.navigateTo = function( targetCamera, duration, done ) {
    var cam = scope.camera;
    duration || ( duration = 1000 );

    if ( typeof targetCamera === 'string' ) {
      targetCamera = findCamera( targetCamera );
    }

    if ( !targetCamera ) { throw new Error( 'Can\'t find camera' ); }

    // make sure going the short route
    [ 'x', 'y', 'z' ].forEach( function( dir ) {
      var rad1 = cam.rotation[dir];
      var rad2 = targetCamera.rotation[dir];
      var dt = rad2 -rad1;
      if ( dt > Math.PI ) {
        cam.rotation[dir] += 2*Math.PI;
      } else if ( dt < -Math.PI ) {
        cam.rotation[dir] -= 2*Math.PI;
      }
    } );

    var from =  {
      px: cam.position.x,
      py: cam.position.y,
      pz: cam.position.z,
      rx: cam.rotation.x,
      ry: cam.rotation.y,
      rz: cam.rotation.z
    };

    var to = {
      px: targetCamera.position.x,
      py: targetCamera.position.y,
      pz: targetCamera.position.z,
      rx: targetCamera.rotation.x,
      ry: targetCamera.rotation.y,
      rz: targetCamera.rotation.z
    };

    if ( targetCamera instanceof THREE.PerspectiveCamera ) {
      from.aspect = cam.aspect;
      to.aspect = targetCamera.aspect;
      from.fov = cam.fov;
      to.fov = targetCamera.fov;
    }

    var tween = Tween( from ).to( to ).duration( duration );

    tween.update( function( o ) {
      cam.position.x = o.px;
      cam.position.y = o.py;
      cam.position.z = o.pz;
      cam.rotation.x = o.rx;
      cam.rotation.y = o.ry;
      cam.rotation.z = o.rz;
    } );

    tween.on( 'end', function() {
      animate = function() {};
      if ( typeof done === 'function' ) { done(); }
    } );

    function animate() {
      requestAnimationFrame( animate );
      tween.update();
    }

    animate();

  };

  this.save = function( cam ) {
    if ( !cam ) {
      cam = scope.camera;
    }
    scope.prevStack.push( cam.clone() );
    if ( scope.prevStack.length > scope.MAX_STACK_LENGTH ) {
      scope.preStack.shift();
    }
    scope.nextStack = [];
  };

  this.prev = this.previous = function( duration, done ) {
    var c = scope.prevStack.pop();

    scope.nextStack.push( c );
    if ( c ) {
      scope.navigateTo( c, duration, done );
    }
  };

  this.hasPrev = this.hasPrevious = function() {
    return this.prevStack.length > 0;
  };

  this.next = function( duration, done ) {
    var c = scope.nextStack.pop();
    scope.prevStack.push( c );
    if ( c ) {
      scope.navigateTo( c, duration, done );
    }
  };

  this.hasNext = function() {
    return this.nextStack.length > 0;
  };

  return scope;
};

CameraNavigator.prototype = Object.create( THREE.EventDispatcher.prototype );
