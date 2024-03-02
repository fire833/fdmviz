import {
  AmbientLight,
  Color,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

export default class Simulator {
  private webgl: WebGLRenderer;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private controls: OrbitControls;

  private mesh: Mesh | null;

  constructor() {
    // Set up renderer
    this.webgl = new WebGLRenderer({ antialias: true });
    this.webgl.setSize(window.innerWidth, window.innerHeight); // Default to full size of the window.
    this.webgl.setAnimationLoop(() => {
      this.rerender();
    }); // Rerender the scene on every frame

    // Set up scene
    this.scene = new Scene();
    this.scene.background = new Color(0x323236);

    // Add some lights
    const ambientLight = new AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directLight = new DirectionalLight(0xffffff, 3);
    directLight.position.set(5, 15, 35);
    this.scene.add(directLight);

    const directLight2 = new DirectionalLight(0xffffff, 3);
    directLight2.position.set(5, -15, -35);
    this.scene.add(directLight2);

    // Initialize the mesh to null to appease TypeScript
    this.mesh = null;

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
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.3;
  }

  // Upload the mesh being displayed based on a certain fileURL
  public uploadMesh(fileURL: string = 'utah_teapot.stl') {
    // Remove existing
    if (this.mesh != null) this.scene.remove(this.mesh);

    // Define the mesh material
    const material = new MeshStandardMaterial({
      color: 0x4bcde9,
      roughness: 0.5,
    });

    // Load STL
    const loader = new STLLoader();
    loader.load(
      fileURL,
      (geometry) => {
        geometry.rotateX(-Math.PI / 2); // Change coordinate system from STL to 3js
        this.mesh = new Mesh(geometry, material);
        this.scene.add(this.mesh);
      },
      (xhr) => {
        console.log(
          'Loading object: ' + (xhr.loaded / xhr.total) * 100 + '% loaded',
        );
      },
      (error) => {
        console.log(error);
      },
    );
  }

  public updateScene() {
    // Update view based on controls (mouse)
    this.controls.update();
  }

  public rerender() {
    this.updateScene();
    this.webgl.render(this.scene, this.camera);
  }

  public getHTMLElement(): HTMLElement {
    return this.webgl.domElement;
  }
}
