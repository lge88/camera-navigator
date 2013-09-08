var CameraNavigator = require( 'camera-navigator' );
var ISEViewport = require( 'ise-viewport' );
var arrgen = require( 'arr-gen' );
var THREE = require( 'three' );

var viewport = ISEViewport();

var scene = viewport.scene;
var sceneHelpers = viewport.sceneHelpers;
var camera = viewport.camera;

arrgen( 10, function( i ) {
  return {
    x: random( -100, 100 ),
    y: random( -100, 100 ),
    z: random( -100, 100 )
  };
} ).map( function( pos ) {
  var c = cube();
  c.position.copy( pos );
  return c;
} ).forEach( function( c ) {
  scene.add( c );
} );

var camNav = new CameraNavigator( camera );
camNav.save();

var steps = [
  'top',
  'front',
  'right',
  'equalAxis',
  'prev',
  'prev',
  'prev',
  'prev'
];

doit();

function doit() {
  var i = 0, cmd = steps[i];

  function update() {
    console.log( cmd );
    if ( 'prev' === cmd ) {
      camNav.prev( 500 )
    } else if ( 'next' === cmd ) {
      camNav.next( 500 );
    } else {
      camNav.navigateTo( cmd, 500 );
      camNav.save();
    }
    i++;
    if ( i < steps.length ) {
      cmd = steps[i];
      setTimeout( update, 1000 );
    }
  }

  update();
}

function cube( w, h, t ) {
  var shininess = 50;
  var specular = 0x333333;
  var bumpScale = 1;
  var shading = THREE.SmoothShading;
  var m = new THREE.Mesh(
    new THREE.CubeGeometry( w || 40, h || 40, t || 40 ),
    new THREE.MeshPhongMaterial( {
      color: randomColor(),
      ambient: 0x000000,
      specular: 0x00ffaa,
      shininess: shininess,
      metal: true,
      shading: shading
    } )
  );
  m.material.wireframe = false;
  return m;
}

function randomColor() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}

function random( a, b ) {
  return Math.random()*( b - a ) + a;
}
