var CameraNavigator = require( 'camera-navigator' );
var ISEViewport = require( 'ise-viewport' );
var arrgen = require( 'arr-gen' );
var THREE = require( 'three' );

var container = document.getElementById( 'main' );
var viewport = ISEViewport( { container: container } );

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
      camNav.prev( )
    } else if ( 'next' === cmd ) {
      camNav.next();
    } else {
      camNav.navigateTo( cmd );
      camNav.save();
    }
    i++;
    if ( i < steps.length ) {
      cmd = steps[i];
      setTimeout( update, 1000 );
    }
  }

  update();
  // setTimeout( animateStandardViews, 1500 );
}

function animateStandardViews() {
  var view = stdViews[ Math.floor( random(0, 7) ) ];
  console.log( view );

  camNav.navigateTo( view, 500 );
  camNav.save();
  i++;
  if ( i < max ) {
    setTimeout( animateStandardViews, 200 );
  } else {
    i = 0;
    max = 5;
    setTimeout( animatePrevHistory, 1500 );
  }
}

function animatePrevHistory() {
  var dir;
  if ( !camNav.hasPrev() ) {
    dir = 'next';
  } else if ( !camNav.hasNext() ) {
    dir = 'prev';
  } else {
    dir = dirs[ Math.floor( random(0, 2) ) ];
  }
  console.log( dir );
  camNav[dir]();
  i++;
  if ( i < max ) {
    setTimeout( animateHistory, 1500 );
  }
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
