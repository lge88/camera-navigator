var CameraNavigator = require( 'camera-navigator' );
var ISEViewport = require( 'ise-viewport' );
var arrgen = require( 'arr-gen' );
var THREE = require( 'three' );

var container = document.getElementById( 'main' );
var viewport = ISEViewport( { container: container } );

var scene = viewport.scene;
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

var i = 0, max = 14;
var stdViews = [ 'top', 'right', 'front', 'bottom', 'left', 'back', 'equalAxis' ];
setInterval( function() {
  var c = camNav.standardCameras[ stdViews[i] ];
  camNav.navigateTo( c );
  i++;
  if ( i >= stdViews.length ) {
    i = 0;
  }
}, 2000 );

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
