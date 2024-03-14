import { get } from 'svelte/store';
import {
  AmbientLight,
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
  LineSegments,
  Mesh,
  MeshNormalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  RawShaderMaterial,
  Scene,
  Sphere,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

import layerFrag from '../graphics/layerShader.frag';
import layerVert from '../graphics/layerShader.vert';
import {
  layerHeight,
  showSurfaceNormals,
  showVertexNormals,
  viewMode,
} from '../stores';
import { ViewMode } from '../types';

export default class Simulator {
  private webgl: WebGLRenderer;
  private camera: PerspectiveCamera;
  private controls: OrbitControls;

  // Scene state
  private scene: Scene;
  private group: Group; // Holds the mesh and normals
  private mesh: Mesh | undefined;
  private normals: LineSegments | undefined;
  private sceneTimer: number = 0;

  constructor() {
    // Set up renderer
    this.webgl = new WebGLRenderer({ antialias: true, alpha: true });
    this.webgl.setSize(window.innerWidth, window.innerHeight); // Default to full size of the window.
    this.webgl.setAnimationLoop(() => {
      this.animate();
    }); // Rerender the scene on every frame

    // Set up scene
    this.scene = new Scene();

    // Add some lights
    const ambientLight = new AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directLight = new DirectionalLight('hsl(0, 0%, 100%)', 3);
    directLight.position.set(5, 15, 35);
    this.scene.add(directLight);

    const directLight2 = new DirectionalLight('hsl(0, 0%, 100%)', 2);
    directLight2.position.set(5, -15, -35);
    this.scene.add(directLight2);

    // Initialize the group containing the mesh
    this.group = new Group();
    this.scene.add(this.group);

    // Set up camera
    this.camera = new PerspectiveCamera(
      60,
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

  public setVertexNormals(show: boolean) {
    if (this.normals) this.normals.visible = show;
  }

  public updateMeshMaterial() {
    if (!this.mesh) return;

    if (get(showSurfaceNormals)) {
      // Turn on normal material
      this.mesh.material = new MeshNormalMaterial();
      return;
    }

    let materialColor = new Color('hsl(153, 60%, 71%)');

    if (get(viewMode) == ViewMode.SHADER) {
      // Turn on shader material
      let uniforms = {
        color: { type: 'vec3', value: materialColor },
        layerHeight: { type: 'float', value: get(layerHeight) },
      };
      this.mesh.material = new RawShaderMaterial({
        uniforms: uniforms,
        vertexShader: layerVert,
        fragmentShader: layerFrag,
      });
      return;
    }

    // Default, turn on standard material
    this.mesh.material = new MeshStandardMaterial({
      color: materialColor,
      roughness: 0.5,
    });
  }

  public populateObject(geometry: BufferGeometry) {
    geometry.rotateX(-Math.PI / 2); // Change coordinate system from STL to 3js
    this.mesh = new Mesh(geometry, undefined);
    this.normals = new VertexNormalsHelper(this.mesh, 1, 0xa4036f);
    this.group.add(this.mesh);
    this.group.add(this.normals);
    this.setVertexNormals(get(showVertexNormals));
    this.updateMeshMaterial();
    this.rescaleCamera(this.mesh);
  }

  // Upload the mesh being displayed based on a certain fileURL
  //
  // utah_teapot.stl
  public uploadMesh(fileURL: string = 'utah_teapot.stl') {
    // Remove previous mesh
    this.group.clear();

    // Load STL
    const loader = new STLLoader();
    loader.load(
      fileURL,
      (geometry: BufferGeometry) => {
        this.populateObject(geometry);
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

  // Rescale the camera to fit and be centered on the mesh
  public rescaleCamera(mesh: Mesh) {
    // Compute the bounding sphere
    mesh.geometry.computeBoundingSphere();
    if (!mesh.geometry.boundingSphere) return;

    const sphere: Sphere = mesh.geometry.boundingSphere;
    const center: Vector3 = mesh.geometry.boundingSphere.center;

    // Center the camera's orbit and initial position on the circle
    this.controls.target.copy(center);
    this.camera.position.x = center.x; // Aligned with front of object
    this.camera.position.y = center.y + sphere.radius * 0.9; // At the top of the object
    this.camera.position.z = center.z + sphere.radius * 1.8; // 2 radius's back
  }

  public updatePhysics(t: number) {
    this.group.position.setX(this.group.position.x + Math.sin(t / 200) / 20);
    this.group.position.setY(this.group.position.y + Math.cos(t / 200) / 20);
  }

  public updateScene() {
    // Update view based on controls (mouse)
    this.controls.update();
    // Update the physics model
    if (get(viewMode) == ViewMode.PARTICLE_SIM) {
      this.sceneTimer += 6;
      this.updatePhysics(this.sceneTimer);
    }
  }

  public animate() {
    this.updateScene();
    this.webgl.render(this.scene, this.camera);
  }

  public getHTMLElement(): HTMLElement {
    return this.webgl.domElement;
  }
}
