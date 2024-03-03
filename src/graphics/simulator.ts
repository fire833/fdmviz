import {
  AmbientLight,
  Box3,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  Sphere,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

export default class Simulator {
  private webgl: WebGLRenderer;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private controls: OrbitControls;

  private mesh: Mesh;

  constructor() {
    // Set up renderer
    this.webgl = new WebGLRenderer({ antialias: true, alpha: true });
    this.webgl.setSize(window.innerWidth, window.innerHeight); // Default to full size of the window.
    this.webgl.setAnimationLoop(() => {
      this.rerender();
    }); // Rerender the scene on every frame

    // Set up scene
    this.scene = new Scene();

    // Add some lights
    const ambientLight = new AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directLight = new DirectionalLight('hsl(194, 70%, 90%)', 3);
    directLight.position.set(5, 15, 35);
    this.scene.add(directLight);

    const directLight2 = new DirectionalLight('hsl(194, 40%, 60%)', 3);
    directLight2.position.set(5, -15, -35);
    this.scene.add(directLight2);

    // Initialize the mesh to an empty mesh
    this.mesh = new Mesh();

    // Set up camera
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    // Add orbit controls for the mouse
    this.controls = new OrbitControls(this.camera, this.webgl.domElement);
    this.controls.autoRotate = true;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.3;
  }

  // Upload the mesh being displayed based on a certain fileURL
  public uploadMesh(fileURL: string = 'utah_teapot.stl') {
    // Remove previous mesh
    this.scene.remove(this.mesh);

    // Define the mesh material
    const material = new MeshStandardMaterial({
      color: 'hsl(153, 60%, 71%)',
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
        this.rescaleCamera();
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

  // Rescale the camera to fit and be centered on the current mesh
  public rescaleCamera() {
    // Get the center of the bounding box
    let boundingBox = new Box3().setFromObject(this.mesh);
    let center = new Vector3();
    boundingBox.getCenter(center);

    // Calculate the radius away the camera should be
    const sphere = new Sphere();
    boundingBox.getBoundingSphere(sphere);

    // Center the camera's orbit and initial position
    this.controls.target.copy(center);
    this.camera.position.x = center.x; // Aligned with front of object
    this.camera.position.y = center.y + sphere.radius; // At the top of the object
    this.camera.position.z = center.z + sphere.radius * 2; // 2 radius's back
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
