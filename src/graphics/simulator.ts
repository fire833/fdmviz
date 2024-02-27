import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  BoxGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

export default class Simulator {
  private webgl: WebGLRenderer;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private controls: OrbitControls;

  private mesh: Mesh;

  constructor() {
    // Set up renderer
    this.webgl = new WebGLRenderer();
    this.webgl.setSize(window.innerWidth, window.innerHeight); // Default to full size of the window.
    this.webgl.setAnimationLoop(() => {this.rerender()}); // Rerender the scene on every frame
        
    // Set up scene
    this.scene = new Scene();
    this.scene.background = new Color(0x323236);

    // Add a placeholder object to the scene
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshPhysicalMaterial({
        color: 0xb2ffc8,
        metalness: 0.25,
        roughness: 0.1,
        opacity: 1.0,
        transparent: true,
        transmission: 0.99,
        clearcoat: 1.0,
        clearcoatRoughness: 0.25
    })
    this.mesh = new Mesh(geometry, material);

    // Add STL
    const loader = new STLLoader();
    loader.load(
        'benchy.stl',
        (geometry) => {
            geometry.rotateX(-Math.PI/2);
            this.mesh = new Mesh(geometry, material);
            this.scene.add(this.mesh);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    );

    // Set up camera
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.camera.position.z = 70;
    this.camera.position.y = 40;

    // Add orbit controls for the mouse
    this.controls = new OrbitControls(this.camera, this.webgl.domElement);
    this.controls.autoRotate = true;
  }

  public update() {
    // Update views based on controls (mouse)
    this.controls.update();
  }

  public rerender() {
    // Update the scene
    this.update();
    // Render the frame
    this.webgl.render(this.scene, this.camera);
  }

  public getHTMLElement(): HTMLElement {
    return this.webgl.domElement;
  }
}
