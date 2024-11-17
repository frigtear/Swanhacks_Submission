import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';


const server_address = "ws://3.147.205.233:80/"

export function storeInput() {
    const studentName = document.getElementById("nameButton").value;
    if (studentName.trim() === '') {
        alert('Please type a name!'); // Alert if the input is empty
        return;
    }
    
    const displayArea = document.getElementById('displayName'); // Locate the display element
    displayArea.textContent = `Hello, ${studentName}!`; // Update the text dynamically

    // Load font and add name to the scene
    const fontLoader = new FontLoader();
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
        const textGeometry = new TextGeometry(studentName, {
            font: font,
            size: 0.5,
            height: 0.2,
        });
        const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(-0.65, -1.3, 2.5); // Adjust the position as needed
        scene.add(textMesh);
    });

    Client.connect(server_address, studentName)
        .then(() => {
            console.log("Connected Successfully!");
        })
        .catch((error) => {
            console.error("Failed to connect:", error);
        });
}


class Client{
    static socket = null
    static isConnected = null

    static async connect(server_address, student_name) {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket(server_address);

            this.socket.onopen = () => {
           
                this.isConnected = true;

                const identity = {
                    "Type":"Identification",
                    "Name":student_name
                }

                this.socket.send(JSON.stringify(identity))

				console.log("Connected to server");
                resolve();
            };

            this.socket.onerror = (error) => {
                console.error("WebSocket error:", error);
                this.isConnected = false;
                reject(error);
            };

            this.socket.onclose = () => {
                console.log("Connection closed");
                this.isConnected = false;
            };

            this.socket.onmessage = async (event) =>{
                const order = JSON.parse(event.data);
                const action = order["Action"]
                Client.execute_order(action)
            }
        });  
    }

    static execute_order(action){
        if (action == "Kill_order"){
            die();
        }
        else if (action == "Hat_change"){
            hatChange();
        }
    }
}




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
let isHat = true

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
function hatChange() {
	if (isHat) {
		scene.remove(hat);
		scene.remove(hat_brim);
		isHat = false;
	} else {
		scene.add(hat);
		scene.add(hat_brim);
		moveTo(hat, 0, 1.1, 0);
		moveTo(hat_brim, 0, 1.04, 2);
		isHat = true;
	}
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
