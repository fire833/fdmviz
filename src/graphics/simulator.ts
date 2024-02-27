import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  BoxGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

export default class Simulator {
  private webgl: WebGLRenderer;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private controls: OrbitControls;

  private cube: Mesh;

  constructor() {
    // Set up renderer
    this.webgl = new WebGLRenderer();
    this.webgl.setSize(window.innerWidth, window.innerHeight); // Default to full size of the window.
    this.webgl.setAnimationLoop(() => {this.rerender()}); // Rerender the scene on every frame
        
    // Set up scene
    this.scene = new Scene();
    this.scene.background = new Color(0x323236);

    // Add a placeholder cube to the scene
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0x00ffff });
    this.cube = new Mesh(geometry, material);
    this.scene.add(this.cube);

    // Set up camera
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.camera.position.z = 5;

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
