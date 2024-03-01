import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  BoxGeometry,
  Color,
  Mesh,
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

  private mesh: Mesh | null;

  constructor() {
    // Set up renderer
    this.webgl = new WebGLRenderer({antialias: true});
    this.webgl.setSize(window.innerWidth, window.innerHeight); // Default to full size of the window.
    this.webgl.setAnimationLoop(() => {this.rerender()}); // Rerender the scene on every frame
        
    // Set up scene
    this.scene = new Scene();
    this.scene.background = new Color(0x323236);

    // Set up meshes
    this.mesh = null; // Initialize this to null to appease TypeScript
    this.updateMesh();

    // Set up camera
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.camera.position.z = 20;
    this.camera.position.y = 10;

    // Add orbit controls for the mouse
    this.controls = new OrbitControls(this.camera, this.webgl.domElement);
    this.controls.autoRotate = true;
  }

  // Update the mesh being displayed based on a certain fileURL
  public updateMesh(fileURL: string = 'utah_teapot.stl') {

    // Remove existing mesh
    this.scene.clear();

    // Define the mesh material
    const material = new MeshPhysicalMaterial({
        color: 0x00ff00,
        metalness: 0.25,
        roughness: 0.1,
        opacity: 1.0,
        transparent: true,
        transmission: 0.99,
        clearcoat: 1.0,
        clearcoatRoughness: 0.25
    })

    // Load STL
    const loader = new STLLoader();
    loader.load(
      fileURL,
      (geometry) => {
          geometry.rotateX(-Math.PI/2); // Change coordinate system from STL to 3js
          this.mesh = new Mesh(geometry, material);
          this.scene.add(this.mesh);
      },
      (xhr) => {
          console.log('Loading object: ' + (xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
          console.log(error)
      }
    );
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
