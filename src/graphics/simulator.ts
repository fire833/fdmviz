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
  private scene: Scene;
  private webgl: WebGLRenderer;
  private camera: PerspectiveCamera;

  private cube: Mesh;

  constructor() {
    this.scene = new Scene();
    this.scene.background = new Color(0x303030);
    this.webgl = new WebGLRenderer();
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    this.camera.position.z = 5;
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new Mesh(geometry, material);
    this.scene.add(this.cube);

    // Default to full size of the window.
    this.webgl.setSize(window.innerWidth, window.innerHeight);
  }

  public render() {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.webgl.render(this.scene, this.camera);
  }

  public getHTMLElement(): HTMLElement {
    return this.webgl.domElement;
  }
}
