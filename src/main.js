import './styles/style.css'

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFloader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

//loaders
const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
gltfLoader.setDRACOLoader(dracoLoader)

//lenis smooth scroll basic setup
const lenis = new Lenis()

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)


//canvas
const canvas = document.querySelector('canvas.webgl')

//scene
const scene = new THREE.Scene()

//window sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
//responsive
window.addEventListener('resize', () => {
    sizes.height = window.innerHeight
    sizes.width = window.innerWidth

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)

})

//camera that resizes with window
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(0, 0, 1.2)
scene.add(camera)

//renderer does the job of rendering the graphics
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true, 
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

//lights to the scene
const mainLight = new THREE.PointLight(0xffffff, 40)
mainLight.position.set(-1, -1, 5)

const mainLight2 = new THREE.PointLight(0xffffff, 10, 4)
mainLight.position.set(-1, -3, 5)

const rectLight = new THREE.RectAreaLight(0xffffff, 1, 2, 2)
rectLight.position.set(0, 0, 0)

const spotLight = new THREE.SpotLight(0xffffff, 3, 100, 0.2, 0.5)
spotLight.position.set(-1, -1, 5)
spotLight.castShadow = true

const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
directionalLight.position.set(0, 0, 0)
directionalLight.castShadow = true

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
scene.add(mainLight, directionalLight, ambientLight, spotLight)

/*geometry
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshNormalMaterial()
const mesh = new THREE.Mesh (geometry, material)
scene.add(mesh)

mesh.rotation.x = lenis.progress * 20

lenis.on('scroll', () => {
    mesh.rotation.x = lenis.progress * 20
  }) 
*/





// tilt the camera at the start
camera.rotation.z = -0.35

//loading the 3d model 
gltfLoader.load(
    'https://uploads-ssl.webflow.com/662676bf25192d1f9d50ace1/66292cd56c610fe524a5ff03_pen5.glb.txt',
    //'https://uploads-ssl.webflow.com/662676bf25192d1f9d50ace1/66290fa9906de84aa3cc9427_pen3.glb.txt',
    //'https://uploads-ssl.webflow.com/662676bf25192d1f9d50ace1/6627f2c298815d5d097b710d_compressed.glb.txt',
   
    (gltf) => {

        let model = gltf.scene

        console.log(model)
        
        model.position.y = -0.2
        //model.position.z = 0.0001
        //model.rotation.x = -180

        model.scale.set(1,1,1)

        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        
        scene.add(model)
        //gsap animation
        let tl = gsap
        .timeline({
           scrollTrigger: {
              trigger: '.animated-element',
              start: "25% 50%", //top of the section animated element hits the bottom
              end: "top top", //top of the section hits the top of the viewport`
              scrub: true
            }
         })
        tl
        .to(camera.rotation, {
           z:0          
        })
        let tl2 = gsap
        .timeline({
           scrollTrigger: {
              trigger: '.animated-element-two',
              start: "80% bottom", //top of the section animated element hits the bottom of the viewport
              end: "80% top", //center of the section hits the center of the viewport
              markers: false,
              scrub: true
            }
         })
        tl2
        .to(camera.position, {
           y: -1.2          
        })
        
        
        lenis.on('scroll', () => {
            //console.log(lenis.progress)
            
                model.rotation.x = lenis.progress * 50  
                //model.rotation.z = lenis.progress * 0.05 

               
            
          })
          

         
    }
)




//animate mesh
const animate = () => {
    
    requestAnimationFrame( animate )

    


    renderer.render(scene, camera)
}
animate()




