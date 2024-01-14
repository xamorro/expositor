import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import './style.css'
import { gsap } from "gsap";
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 
                 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import CANNON from 'cannon';



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
    position: new THREE.Vector3(-15, 0, 25),
    element: document.querySelector('.point-0')
  },
  {
    position: new THREE.Vector3(-47, 0, 25),
    element: document.querySelector('.point-1')
  },
  {
    position: new THREE.Vector3(17, 0, 25),
    element: document.querySelector('.point-2')
  },
  {
    position: new THREE.Vector3(50, - 1.3, 25),
    element: document.querySelector('.point-3')
  }
]

//----------------ON CLICK----------------

document.querySelector(".point-0 .label").addEventListener('click', function () {
  CameraPiano();
});
document.querySelector(".point-1 .label").addEventListener('click', function () {
  CameraGuitar();
});
document.querySelector(".point-2 .label").addEventListener('click', function () {
  CameraViolin();
});
document.querySelector(".point-3 .label").addEventListener('click', function () {
  CameraOrgano();
});

document.querySelector(".point-0 .return").addEventListener('click', function () {
  ReturnPage(piano.position);
});
document.querySelector(".point-1 .return").addEventListener('click', function () {
  ReturnPage(guitar.position);
});
document.querySelector(".point-2 .return").addEventListener('click', function () {
  ReturnPage(violin.position);
});
document.querySelector(".point-3 .return").addEventListener('click', function () {
  ReturnPage(organ.position);
});

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

const material = new THREE.MeshStandardMaterial({ color: 0xf00650 });
const material2 = new THREE.MeshStandardMaterial({ color: 0xd0d0d0 });

const PlaneGeometry = new THREE.PlaneGeometry();
const plane = new THREE.Mesh(PlaneGeometry, material);
plane.position.set(-10, -30, 30);
plane.scale.set(100, 100, 100);
plane.rotation.set(4.7, 0, 0);
plane.castShadow = true;
plane.receiveShadow = true;
scene.add(plane);

const SphereGeometry = new THREE.SphereGeometry();
const sphere = new THREE.Mesh(SphereGeometry, material);
sphere.position.set(0, 10, 0);
sphere.scale.set(1, 1, 1);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);



//---------------------CAMERA CONTROL----------------------
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.set(0, 5, 80)
//camera.rotation.set(0, 30, 2)
//camera.lookAt(new THREE.Vector3(0, 0, 0))

const renderer = new THREE.WebGLRenderer()
//Activar ombres
renderer.shadowMap.enabled = true
//Si volem aplicar un altre algoritme
//renderer.shadowMap.type = THREE.VSMShadowMap

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;

// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true;

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
  light.castShadow = true
  scene.add(light);
}


//--------------------VR Controller-------------------------------
const controller1 = renderer.xr.getController( 0 );
const controller2 = renderer.xr.getController( 1 );


function onSelectStart() {
  this.userData.isSelecting = true;
}

function onSelectEnd() {
  this.userData.isSelecting = false;
}

controller1.addEventListener( 'selectstart', onSelectStart);
controller1.addEventListener( 'selectend', onSelectEnd );
controller1.addEventListener( 'connected', function ( event ) {
    this.add( buildController( event.data ) );
} );

controller2.addEventListener( 'selectstart', onSelectStart);
controller2.addEventListener( 'selectend',  onSelectEnd);
controller2.addEventListener( 'connected', function ( event ) {
    this.add( buildController( event.data ) );
} );

controller2.addEventListener( 'disconnected', function () {
  this.remove( this.children[ 0 ] );
} );

scene.add(controller1)
scene.add(controller2)

const controllerModelFactory = new XRControllerModelFactory();
const controllerGrip1 = renderer.xr.getControllerGrip( 0 );
controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
scene.add( controllerGrip1 );

const controllerGrip2 = renderer.xr.getControllerGrip( 1 );
controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
scene.add( controllerGrip2 );

function buildController( data ) {
  let geometry, material;
  switch ( data.targetRayMode ) {

      case 'tracked-pointer':
          geometry = new THREE.BufferGeometry();
          geometry.setAttribute( 'position', 
                         new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) )
          geometry.setAttribute( 'color', 
                         new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) )
          material = new THREE.LineBasicMaterial( 
                        { 
                          vertexColors: true, 
                          blending: THREE.AdditiveBlending
                        }
           )
          return new THREE.Line( geometry, material )
          case 'gaze':

          geometry = new THREE.RingGeometry( 0.02, 0.04, 32 ).translate(0,0, - 1)
          material = new THREE.MeshBasicMaterial( { 
                      opacity: 0.5, 
                      transparent: true
           } )
          return new THREE.Mesh( geometry, material )
  }
}

function handleController( controller ) {
  if ( controller.userData.isSelecting ) {
      // Acció en prémer el botó de Select del controlador
      console.log('Selecting')
  }
}

// gsap.to(sphere.position, {
//   duration: 1,
//   x: 0, //DRETA ESQUERRA
//   y: 30, //ADALT ABAIX
//   z: 0,
//   yoyo: true,
//   repeat: -1, // repetir indef
//   ease: "power1.inOut", // tipus de transcisió
// });

//------------MON-----------------------//
const world = new CANNON.World()
world.gravity.set(0, - 9.82, 0)

const sphereShape = new CANNON.Sphere(1)

const sphereBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 0, 0),
  shape: sphereShape
})
world.addBody(sphereBody)

// phisic plane MON
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(0, -1, 0),
  shape: floorShape
})
world.addBody(floorBody)

const clock = new THREE.Clock()
let oldElapsedTime = 0











const guitar = new THREE.Object3D()
ImportGLTF("Models/bass_guitar_low_poly_freebie.glb", guitar, new THREE.Vector3(5, 5, 5));
guitar.position.set(-18, 3, -25);
scene.add(guitar);

const piano = new THREE.Object3D()
ImportGLTF("Models/old_piano.glb", piano, new THREE.Vector3(0.05, 0.05, 0.05));
piano.position.set(-5, 0, -25);
scene.add(piano);

const violin = new THREE.Object3D()
ImportGLTF("Models/stylized_violin.glb", violin, new THREE.Vector3(10, 10, 10), new THREE.Vector3(0, 35, 0));
violin.position.set(5, 1.5, -25);
scene.add(violin);

const organ = new THREE.Object3D()
ImportGLTF("Models/pipe_organ_espresso_machine.glb", organ, new THREE.Vector3(5, 5, 5));
organ.position.set(15, -1, -25);
scene.add(organ);

const theatre = new THREE.Object3D()
ImportGLTF("Models/theatre_cheap_template.glb", theatre, new THREE.Vector3(2, 2, 2), new THREE.Vector3(0, 3.15, 0));
theatre.position.set(0, -5.5, -25);
//scene.add(theatre);



//FUNCTIONS ANIMACIONS CAMERA
function CameraPiano() {
  // Exemple d´animació amb GSAP, efecte yoyo amb la càmera
  console.log("holaaa")
  gsap.to(camera.position, {
    duration: 3,
    x: -15,
    y: 20,
    z: 80,
    //yoyo: true,
    // repeat: -1, // repetir indef
    ease: "power1.inOut", // tipus de transcisió
    onUpdate: function () {
      camera.lookAt(piano.position)
    },
    onComplete: function () {
     document.querySelector('.point-0 .info').style.opacity = "1"
     document.querySelector('.point-0 .return').style.opacity = "1"
    }
   });

  gsap.to(piano.scale, {
    duration: 1,
    y: 1.10,
    yoyo: true,
    repeat: -1, // repetir indef
    ease: "power1.inOut", // tipus de transcisió
  });
}

//----------------------------------------------------------
function CameraGuitar() {
  // Exemple d´animació amb GSAP, efecte yoyo amb la càmera
  console.log("holaaa")
  gsap.to(camera.position, {
    duration: 3,
    x: -55,
    y: 20,
    z: 80, 
    ease: "power1.inOut", // tipus de transcisió
    onUpdate: function () {
      camera.lookAt(guitar.position)
    },
    onComplete: function () {
     document.querySelector('.point-1 .info').style.opacity = "1"
     document.querySelector('.point-1 .return').style.opacity = "1"
    }
  });

  gsap.to(guitar.scale, {
    duration: 1,
    y: 1.10,
    yoyo: true,
    repeat: -1, // repetir indef
    ease: "power1.inOut", // tipus de transcisió
  });
}

//----------------------------------------------------------
function CameraViolin() {
  // Exemple d´animació amb GSAP, efecte yoyo amb la càmera
  console.log("holaaa")
  gsap.to(camera.position, {
    duration: 3,
    x: 15,
    y: 20,
    z: 80,
    ease: "power1.inOut", // tipus de transcisió
    onUpdate: function () {
      camera.lookAt(violin.position)
    },
    onComplete: function () {
      document.querySelector('.point-2 .info').style.opacity = "1"
      document.querySelector('.point-2 .return').style.opacity = "1"
     }
  });

  gsap.to(violin.scale, {
    duration: 1,
    y: 1.10,
    yoyo: true,
    repeat: -1, // repetir indef
    ease: "power1.inOut", // tipus de transcisió
  });
}


//----------------------------------------------------------
function CameraOrgano() {
  // Exemple d´animació amb GSAP, efecte yoyo amb la càmera
  console.log("holaaa")
  gsap.to(camera.position, {
    duration: 3,
    x: 45,
    y: 20,
    z: 80,
    ease: "power1.inOut", // tipus de transcisió
    onStart: function(){
      document.querySelector('.point-3 .label ').style.opacity = "0"
    },
    
    onUpdate: function () {
      camera.lookAt(organ.position)
    },
    onComplete: function () {
      document.querySelector('.point-3 .info').style.opacity = "1"
      document.querySelector('.point-3 .return').style.opacity = "1"
     }
  });

  gsap.to(organ.scale, {
    duration: 1,
    y: 1.10,
    yoyo: true,
    repeat: -1, // repetir indef
    ease: "power1.inOut", // tipus de transcisió
  });
}

//----------------------------------------------------------
function ReturnPage(object) {
  // Exemple d´animació amb GSAP, efecte yoyo amb la càmera
  console.log("vuelvo")
  gsap.to(camera.position, {
    duration: 3,
    x: 0,
    y: 30,
    z: 130, // repetir indef
    ease: "power1.inOut", // tipus de transcisió
    onStart: function(){
      if (object == piano.position){
        document.querySelector('.point-0 .info').style.opacity = "0"
        document.querySelector('.point-0 .return').style.opacity = "0"
      }else if (object == guitar.position){
        document.querySelector('.point-1 .info').style.opacity = "0"
        document.querySelector('.point-1 .return').style.opacity = "0"
      }else if (object == violin.position){
        document.querySelector('.point-2 .info').style.opacity = "0"
        document.querySelector('.point-2 .return').style.opacity = "0"
      }else if (object == organ.position){
        document.querySelector('.point-3 .info').style.opacity = "0"
        document.querySelector('.point-3 .return').style.opacity = "0"
      }
    },
    onUpdate: function () {
      camera.lookAt(object)
    },
    onComplete: function () {
      camera.lookAt(0,0,0)
      if (object == piano.position){
        document.querySelector('.point-0 .label').style.opacity = "1"
        gsap.killTweensOf(piano.scale);
      }else if (object == guitar.position){
        document.querySelector('.point-1 .label').style.opacity = "1"
        gsap.killTweensOf(guitar.scale);
      }else if (object == violin.position){
        document.querySelector('.point-2 .label').style.opacity = "1"
        gsap.killTweensOf(violin.scale);
      }else if (object == organ.position){
        document.querySelector('.point-3 .label').style.opacity = "1"
        gsap.killTweensOf(organ.scale);
      }
    }
  });
}





//----------------------------------------------------------








// gsap.to(camera.position, {
//   duration: 10,
//   x: 100, //DRETA ESQUERRA
//   y: 40, //ADALT ABAIX
//   z: 20,
//   yoyo: true,
//   repeat: -1, // repetir indef
//   ease: "power1.inOut", // tipus de transcisió
// });



//cridam sa funcio tick q mos renderiza
tick();

//Per a cada objecte de s'array mouli sa Y cada x temps
function tick(time) {
  time *= 0.001;




  let sceneReady = false
  const loadingManager = new THREE.LoadingManager(
    // Loaded
    () => {
      // ...

      window.setTimeout(() => {
        sceneReady = true
      }, 2000)
    },

    // ...
  )
  handleController( controller1 );
  handleController( controller2 );


  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  // Update physics
  world.step(1 / 60, deltaTime, 3)
  console.log(sphereBody.position.y)
  sphere.position.copy(sphereBody.position)
  plane.position.copy(floorBody.position)

  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI * 0.5)

  // Update controls
  //controls.update()
  // Recorrer cada punt de l’array points
  for (const point of points) {
    const screenPosition = point.position.clone()
    screenPosition.project(camera)


    const translateX = screenPosition.x * window.innerWidth * 0.5
    const translateY = -screenPosition.y * window.innerHeight * 0.5
    point.element.style.transform = `translateX(${translateX}px)translateY(${translateY}px)`

  }

  renderer.render(scene, camera)
  renderer.setAnimationLoop(tick);
}

let model = null

function ImportGLTF(path, object3d, scale, rotation) {
  //Instanciem el loader de models GLTF
  const loader = new GLTFLoader();

  //Carregam el fitxer
  loader.load(
    //Ruta al model
    path,
    //FUNCIONS DE CALLBACK
    function (gltf) {
      model = gltf.scene;
      model.scale.set(scale.x, scale.y, scale.z);
      if (rotation) {
        model.rotation.set(rotation.x, rotation.y, rotation.z);
      }
      // model.traverse(function(model){
      //   if(model.isMesh){
      //     model.castShadow=true;
      // //   }

      //   });
      model.castShadow = true
      model.receiveShadow = true
      object3d.add(model);

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

