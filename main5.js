import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { STLLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7d72b6);
const light = new THREE.AmbientLight( 0xE1E1E1, 0.3); // soft white light
const hemisphereLight = new THREE.HemisphereLight(0x94D8FB, 0x9CFF2D,0.3);
const width = window.innerWidth * 0.8;  // Ancho del área de la pantalla
const height = window.innerHeight * 0.8;  // Altura del área de la pantalla

scene.add( light );
scene.add( hemisphereLight );
//const camera = new THREE.Camera();
//const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const directionalLight = new THREE.DirectionalLight(0xd9c795, 1); // Luz direccional
directionalLight.position.set(0, 5, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);



 // Camera
 const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
 camera.position.set(0, 10, 0);
 //camera.lookAt(scene.position);


 //camera.fov = 90; // Ajusta el valor según sea necesario
 //const aspectRatio = width / height;
//camera.aspect = aspectRatio;
// camera.updateProjectionMatrix(); // Actualiza la matriz de proyección
const renderer = new THREE.WebGLRenderer();
//renderer.setSize(width, height);
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);

/* const newFocusPoint = new THREE.Vector3(0, 0, 0);  // Define las coordenadas del nuevo punto de enfoque
camera.lookAt(newFocusPoint);  // Cambia el punto de enfoque de la cámara
controls.target.copy(newFocusPoint);  */ // Actualiza el punto de enfoque de OrbitControls

camera.updateProjectionMatrix();
controls.update();

controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
document.body.appendChild(renderer.domElement);



function loadSTLModel(path, position) {
    return new Promise((resolve, reject) => {
        const loader = new STLLoader();
        loader.load(path, (geometry) => {
            /* const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }); */
            //const material = new THREE.MeshBasicMaterial();
            const material = new THREE.MeshStandardMaterial({
                color: 0xffff56,
                metalness: 0.5,
                roughness: 0.5,
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(position);
            mesh.scale.set(0.1, 0.1, 0.1);
                 // Rotar el objeto 3D alrededor de su eje Y por 180 grados
                 mesh.rotateY(Math.PI); // Math.PI es 180 grados en radianes
                 //mesh.rotation.z = Math.PI/3;  // Rotación de 45 grados alrededor del eje X
                 //mesh.rotation.y = Math.PI / 3;  // Rotación de 60 grados alrededor del eje Y
                 //mesh.rotation.z = Math.PI / 6;  // Rotación de 30 grados alrededor del eje Z    
            scene.add(mesh);
            resolve();
        }, undefined, reject);
    });
}

async function init() {
    const modelPath1 = '1-I-libson.stl';
    const modelPath2 = '0-S-libson.stl';
    const modelPath3 = 'BiteAverage_Normal Bite.stl';


    await Promise.all([
        loadSTLModel(modelPath1, new THREE.Vector3(0, 0, 1)),
        loadSTLModel(modelPath2, new THREE.Vector3(0, 0, 2)),
        //loadSTLModel(modelPath3, new THREE.Vector3(0, 0, 0)),
    ]);

    /* camera.position.z = 1;
    camera.position.x = 1; */
    //camera.position.y = 0;

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    //camera.aspect = window.innerWidth / window.innerHeight;
    //camera.updateProjectionMatrix();
    //renderer.setSize(window.innerWidth, window.innerHeight);

    const newWidth = window.innerWidth * 0.5;
    const newHeight = window.innerHeight * 0.5;

    renderer.setSize(newWidth, newHeight);
 
   const newAspectRatio = newWidth / newHeight;
    camera.aspect = newAspectRatio;
    camera.updateProjectionMatrix(); 
}); 

init();

