import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.CircleGeometry(2);
const green = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const circle = new THREE.Mesh( geometry, green );
scene.add( circle );


const g2 = new THREE.CircleGeometry(0.25);
const blue = new THREE.MeshBasicMaterial( {color: 0x0000ff});
const eye = new THREE.Mesh(g2, blue);
const eye2 = new THREE.Mesh(g2, blue);
scene.add(eye);
scene.add(eye2);

const g3 = new THREE.CircleGeometry(0.5, 32, Math.PI, Math.PI);
const red = new THREE.MeshBasicMaterial( {color: 0xff0000});
const mouth = new THREE.Mesh(g3, red)
scene.add(mouth)

moveTo(eye, 0.5, 0.7, 2);
moveTo(eye2, -0.5, 0.7, 2);
moveTo(mouth, 0, 0.2, 2);

function moveTo(obj, x, y, z) {
	obj.position.x = x
	obj.position.y = y
	obj.position.z = z
}

camera.position.z = 5;

function animate() {

	renderer.render( scene, camera );
	
}

renderer.setAnimationLoop( animate );