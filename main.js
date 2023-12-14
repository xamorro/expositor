import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import './style.css'
import { gsap } from "gsap";

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

const SphereGeometry = new THREE.SphereGeometry();
const sphere = new THREE.Mesh(SphereGeometry, material);
sphere.position.set(-10, 20, 30);
sphere.scale.set(10, 10, 10);
sphere.castShadow = true;
sphere.receiveShadow = true;
//scene.add(sphere);

const PlaneGeometry = new THREE.PlaneGeometry();
const plane = new THREE.Mesh(PlaneGeometry, material);
plane.position.set(-10, 10, 30);
plane.scale.set(100, 100, 100);
plane.rotation.set(5, 0, 0);
plane.castShadow = true;
plane.receiveShadow = true;
//scene.add(plane);


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






const guitar = new THREE.Object3D()
ImportGLTF("Models/bass_guitar_low_poly_freebie.glb", guitar, new THREE.Vector3(15, 15, 15));
guitar.position.set(-55, 14, 25);
scene.add(guitar);

const piano = new THREE.Object3D()
ImportGLTF("Models/old_piano.glb", piano, new THREE.Vector3(0.2, 0.2, 0.2));
piano.position.set(-15, 4, 25);
scene.add(piano);

const violin = new THREE.Object3D()
ImportGLTF("Models/stylized_violin.glb", violin, new THREE.Vector3(30, 30, 30), new THREE.Vector3(0, 35, 0));
violin.position.set(15, 13, 25);
scene.add(violin);

const organ = new THREE.Object3D()
ImportGLTF("Models/pipe_organ_espresso_machine.glb", organ, new THREE.Vector3(15, 15, 15));
organ.position.set(45, 5, 25);
scene.add(organ);

const theatre = new THREE.Object3D()
ImportGLTF("Models/theatre_cheap_template.glb", theatre, new THREE.Vector3(2, 2, 2), new THREE.Vector3(0, 3.15, 0));
theatre.position.set(0, 3.5, 0);
scene.add(theatre);



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

