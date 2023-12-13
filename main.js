import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import './style.css'

//Loader de models GLTF
let loader = null
//Loader de textures

const scene = new THREE.Scene()

const fov = 60;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;

//--------------------------------HTML,JAVA,CSS--------------------------------

const points = [
  {
    position: new THREE.Vector3(-15, 0,  25),
    element: document.querySelector('.point-0')
  },
  {
    position: new THREE.Vector3(-47, 0,  25),
    element: document.querySelector('.point-1')
  },
  {
    position: new THREE.Vector3(17, 0,  25),
    element: document.querySelector('.point-2')
  },
  {
    position: new THREE.Vector3(50, - 1.3,  25),
    element: document.querySelector('.point-3')
  }
  ]

//--------------------------------RAYCAST--------------------------------


const raycaster = new THREE.Raycaster()

//Raycast linia origen direccio
// const rayOrigin = new THREE.Vector3(-43, 10, 30)
// const rayDirection = new THREE.Vector3(10, 0, 0)


//RATOLI RAYCAST
const mouse = new THREE.Vector2()
  mouse.x = -1
  mouse.y = - 1;
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  //console.log(mouse)
})




// const arrowHelper = new THREE.ArrowHelper(rayDirection, rayOrigin, 200);
// scene.add(arrowHelper)

// const geometry = new THREE.SphereGeometry(5, 32, 16);
// const material = new THREE.MeshStandardMaterial({ color: 0xf00650 });
// const material2 = new THREE.MeshStandardMaterial({ color: 0xf07550 });
// const material3 = new THREE.MeshStandardMaterial({ color: 0xf03450 });
// const sphere = new THREE.Mesh(geometry, material);
// sphere.position.set(-10, 10, 30);
// scene.add(sphere);

// const sphere2 = new THREE.Mesh(geometry, material2);
// sphere2.position.set(10, 50, 30);
// scene.add(sphere2);

// const sphere3 = new THREE.Mesh(geometry, material3);
// sphere3.position.set(30, 10, 30);
// scene.add(sphere3);

// const clock = new THREE.Clock()


//---------------------CAMERA CONTROL----------------------
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.set(0, 30, 130)
camera.rotation.set(0, 30, 2)
camera.lookAt(new THREE.Vector3(0, 0, 0))

const renderer = new THREE.WebGLRenderer()
//Activar ombres
renderer.shadowMap.enabled = true
//Si volem aplicar un altre algoritme
//renderer.shadowMap.type = THREE.VSMShadowMap

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;

////////ENTORN/////////////////
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMap = cubeTextureLoader.load([
  'textures/environmentMaps/galaxia/px.png',
  'textures/environmentMaps/galaxia/nx.png',
  'textures/environmentMaps/galaxia/py.png',
  'textures/environmentMaps/galaxia/ny.png',
  'textures/environmentMaps/galaxia/pz.png',
  'textures/environmentMaps/galaxia/nz.png'
])

scene.background = environmentMap

//------------------CREAM UN PUNT DE LLUM ENMITJ-------------------------
{
  const color = 0xFFFFFF;
  const intensity = 20000;
  const light = new THREE.PointLight(color, intensity);
  light.position.y = 70
  light.position.z = 65
  scene.add(light);
}

// array d’objectes dels quals hem d’actualitzar la rotació.
const objects = [];


// //plane
// const planeGeo = new THREE.PlaneGeometry(180, 180)
// const planeMat = new THREE.MeshStandardMaterial({
//   color: 0xffffff
// })
// const plane = new THREE.Mesh(planeGeo, planeMat)
// plane.receiveShadow = true
// plane.position.y = -6
// plane.rotation.x = Math.PI * -0.5
// scene.add(plane)


let piano = null;
ImportGLTF("Models/old_piano.glb", piano, new THREE.Vector3(-15, 6, 25), new THREE.Vector3(0.2, 0.2, 0.2));
let guitar = null;
ImportGLTF("Models/bass_guitar_low_poly_freebie.glb", guitar, new THREE.Vector3(-55,14, 25), new THREE.Vector3(15, 15, 15));
let organ = null;
ImportGLTF("Models/pipe_organ_espresso_machine.glb", organ, new THREE.Vector3(45, 5, 25), new THREE.Vector3(15, 15, 15));
let violin = null;
ImportGLTF("Models/stylized_violin.glb", violin, new THREE.Vector3(15, 13, 25), new THREE.Vector3(30, 30, 30), new THREE.Vector3(0,35,0));
let theatre = null;
ImportGLTF("Models/theatre_cheap_template.glb", theatre, new THREE.Vector3(0, 3.5, 0), new THREE.Vector3(2, 2, 2), new THREE.Vector3(0,3.15,0));

//cridam sa funcio tick q mos renderiza
tick();

//Per a cada objecte de s'array mouli sa Y cada x temps
function tick(time) {
  time *= 0.001;
//  if (piano) {

//  }



let sceneReady = false
const loadingManager = new THREE.LoadingManager(
// Loaded
() => {
// ...

window.setTimeout(() =>
{
sceneReady = true
}, 2000)
},

// ...
)


// Update controls
controls.update()
// Recorrer cada punt de l’array points
for(const point of points) 
{
  const screenPosition = point.position.clone()
  screenPosition.project(camera)
  

  const translateX = screenPosition.x * window.innerWidth * 0.5
  const translateY = -screenPosition.y * window.innerHeight * 0.5
  point.element.style.transform = `translateX(${translateX}px)translateY(${translateY}px)`

}
  //------------- Anima objectes abaix cap a dalt
  // const elapsedTime = clock.getElapsedTime()

  // sphere.position.y = Math.sin(elapsedTime * 4.3) * 5.5 + 15
  // sphere2.position.y = Math.sin(elapsedTime * 0.8) * 5.5 + 15
  // sphere3.position.y = Math.sin(elapsedTime * 1.4) * 1.5 + 15
 //------------- ---------------------------------
 
  //   rayDirection.normalize()

  //----------------RAYCASTER LINIA -----------
              // raycaster.set(rayOrigin, rayDirection)
  //------------------------------------------------
  
  // if(sceneReady) {
  //   for(const point of points) {
    
  //   const screenPosition = point.position.clone()
  //   screenPosition.project(camera)

  //   //raycaster.setFromCamera(screenPosition, camera)
  //   const intersects = raycaster.intersectObjects(scene.children, true)

  //   if(intersects.length === 0) {
  //     point.element.classList.add('visible')
  //     }
  //     else {
  //       const intersectionDistance = intersects[0].distance
  //       const pointDistance = point.position.distanceTo(camera.position)
  //       if(intersectionDistance < pointDistance) {
  //         point.element.classList.remove('visible')
  //       }
  //       else {
  //       point.element.classList.add('visible')
  //       }
  //     }
  //   }
  // }
  


  // const objectsToTest = [sphere, sphere2, sphere3,]
  // const ObjecteSol = [sphere]
  // //   //Feim q es raycast interectiu amb 1 sol objecte o varis
  // const intersects = raycaster.intersectObjects(objectsToTest)
  // //   console.log(intersects)

  // //----------------RAYCASTER MOUSE -----------
  // raycaster.setFromCamera(mouse, camera)
  // //------------------------------------------------

  // //   //const objectsToTest = raycaster.intersectObjects([sphere, sphere2, sphere3])
  // //   //console.log(intersects)



  // for (const intersect of intersects) {
  //   console.log("Canvi Color DAMUNT")
  //   intersect.object.material.color.set('#0000ff')
  // }

  // for(const object of objectsToTest) {
  //   if(!intersects.find(intersect => intersect.object === object)) {
  //     object.material.color.set('#ff0000')
  //   }
  // }




  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}



function ImportGLTF(path, object3d, position, scale, rotation) {
  //Instanciem el loader de models GLTF
  const loader = new GLTFLoader();

  //Carregam el fitxer
  loader.load(
    //Ruta al model
    path,
    //FUNCIONS DE CALLBACK
    function (gltf) {
      object3d = gltf.scene;
      object3d.position.set(position.x, position.y, position.z);
      object3d.scale.set(scale.x, scale.y, scale.z);
        if (rotation)
        {
          object3d.rotation.set(rotation.x,rotation.y,rotation.z);
        }
      scene.add(object3d);

    },
    function (xhr) {
      //Aquesta funció de callback es crida mentre es carrega el model
      //i podem mostrar el progrés de càrrega
      //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      //callback per quan hi ha un error. El podem mostrar per consola.
      //console.error(error);
    }
  );










}

