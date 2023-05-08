import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import {Pane} from 'tweakpane';


const pane = new Pane();


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Scene
const scene = new THREE.Scene()

const material = new THREE.MeshBasicMaterial({ 
    color: 0xff0000,
})

// Create an empty BufferGeometry
const geometry = new THREE.BoxGeometry(1,1,1)

const PARAMS = {
    color: '#ff0000',
    spin: () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })
    },
    download: () => {
        const link = document.createElement('a');
        link.download = 'download.png';
        link.href = document.getElementById("myCanvas").toDataURL('image/png');
        link.click()  
    }
  };
  


// Object
const mesh = new THREE.Mesh(
    geometry,
    material
)
scene.add(mesh)

const folderMesh = pane.addFolder({
    title: 'Mesh',
    expanded: false,
})

const folderPositionMesh = folderMesh.addFolder({
    title: 'position',
    expand: true,
})



folderPositionMesh.addInput(mesh.position, "x", {
    label: "x",
    min: -20,
    max: 20,
    step: 0.1
})

folderPositionMesh.addInput(mesh.position, "y", {
    label: "y",
    min: -20,
    max: 20,
    step: 0.1
})

folderPositionMesh.addInput(mesh.position, "z", {
    label: "z",
    min: -20,
    max: 20,
    step: 0.1
})

const folderRotationMesh = folderMesh.addFolder({
    title: 'rotation',
    expand: true,
})

const meshRotX = folderRotationMesh.addInput(mesh.rotation, "x", {
    label: "axis x",
    min: -180,
    max: 180,
    step: 1
})

const meshRotY = folderRotationMesh.addInput(mesh.rotation, "y", {
    label: "axis y",
    min: -180,
    max: 180,
    step: 1
})

const meshRotZ = folderRotationMesh.addInput(mesh.rotation, "z", {
    label: "axis z",
    min: -180,
    max: 180,
    step: 1
})

meshRotZ.on('change', function(ev) {
    mesh.rotation.z = ev.value * Math.PI/180
  });

meshRotX.on('change', function(ev) {
    mesh.rotation.x = ev.value * Math.PI/180
});

meshRotY.on('change', function(ev) {
    mesh.rotation.y = ev.value * Math.PI/180
});

folderMesh.addInput(mesh.material, "wireframe")
folderMesh.addInput(mesh, "visible")
folderMesh.addInput(PARAMS, "color").on("change",(e)=>{
    material.color.set(new THREE.Color(e.value))
})

folderMesh.addButton({
    title: 'spin'
}).on("click",PARAMS.spin)

folderMesh.addButton({
    title: 'download'
}).on("click",PARAMS.download)


// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height,0.1,100)
camera.position.z = 2
camera.lookAt(mesh.position)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    preserveDrawingBuffer: true

})
renderer.setSize(sizes.width, sizes.height)
// Controls
const controls = new OrbitControls(camera, canvas)

controls.enableDamping = true

let darkMode = true

window.addEventListener('keypress',(event)=>{
    if(event.code == 'KeyR'){
        mesh.position.set(0,0,0)
        mesh.rotation.set(0,0,0)
        pane.refresh()
        camera.position.set(0,0,5)
        controls.target.set(0,0,0)
    }

    if (event.code == 'KeyO'){
        (darkMode) ? 
            renderer.setClearColor( 0xffffff, 1): 
            renderer.setClearColor( 0x000000, 1)
        darkMode = !darkMode
    }
})

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
		// Update camera
    camera.aspect = sizes.width / sizes.height
		camera.updateProjectionMatrix()
    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () =>
{
    if(!document.fullscreenElement)
    {
        canvas.requestFullscreen()
    }
    else
    {
        document.exitFullscreen()
    }
})




const tick = () =>
{
    controls.update()
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()