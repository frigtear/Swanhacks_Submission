import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.SphereGeometry(2);
const green = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
const sphere = new THREE.Mesh( geometry, green );
scene.add( sphere );

const g2 = new THREE.SphereGeometry(0.25);
const blue = new THREE.MeshStandardMaterial( {color: 0x0000ff});
const eye = new THREE.Mesh(g2, blue);
const eye2 = new THREE.Mesh(g2, blue);
scene.add(eye);
scene.add(eye2);

const straight_mouth = new THREE.BoxGeometry(1.3, 0.1, 0.1);
const red = new THREE.MeshStandardMaterial( {color: 0xff0000});
const smile_mouth = new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI*2, Math.PI/2, Math.PI);
const frown_mouth = new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI*2, 3*Math.PI/2, Math.PI);
let mouth = new THREE.Mesh(smile_mouth, red);
scene.add(mouth);

const g3 = new THREE.SphereGeometry(1.5);
const hat = new THREE.Mesh(g3,red);queueMicrotask
scene.add(hat);

const g4 = new THREE.BoxGeometry(2.5, 0.2, 0.1);
const hat_brim = new THREE.Mesh(g4,red);queueMicrotask
scene.add(hat_brim);

moveTo(eye, 0.5, 0.4, 2);
moveTo(eye2, -0.5, 0.4, 2);
moveTo(mouth, 0, -0.5, 2);
moveTo(hat, 0, 1.1, 0);
moveTo(hat_brim, 0, 1.04, 2);

function moveTo(obj, x, y, z) {
	obj.position.x = x
	obj.position.y = y
	obj.position.z = z
}

function die() {
	scene.remove(mouth);
	mouth = new THREE.Mesh(straight_mouth, red);
	scene.add(mouth);
	moveTo(mouth, 0, -0.5, 2);
	const lineMaterial = new THREE.LineBasicMaterial({
		color: 0x0000ff
	});
	const l1 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.25, 0.15, 2), new THREE.Vector3(0.75, 0.65, 2)]);
	const l2 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.25, 0.65, 2), new THREE.Vector3(0.75, 0.15, 2)]);
	const l3 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.25, 0.15, 2), new THREE.Vector3(-0.75, 0.65, 2)]);
	const l4 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.25, 0.65, 2), new THREE.Vector3(-0.75, 0.15, 2)]);
	scene.add(new THREE.Line(l1, lineMaterial));
	scene.add(new THREE.Line(l2, lineMaterial));
	scene.add(new THREE.Line(l3, lineMaterial));
	scene.add(new THREE.Line(l4, lineMaterial));
	scene.remove(eye);
	scene.remove(eye2);
}

camera.position.z = 5;
die();
function animate() {
	renderer.render( scene, camera );
}

function addLighting(scene) {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(2, 2, 5);
    scene.add(light);
  
    const ambientLight = new THREE.AmbientLight(0x404040);
}
  
addLighting(scene);
//die();
renderer.setAnimationLoop(animate);
