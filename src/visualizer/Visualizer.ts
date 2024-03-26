import { get } from 'svelte/store';
import {
  AmbientLight,
  BufferGeometry,
  Clock,
  Color,
  DirectionalLight,
  LineSegments,
  Mesh,
  MeshNormalMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  RawShaderMaterial,
  RepeatWrapping,
  Scene,
  Sphere,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

import {
  fileURL,
  layerHeight,
  orbit,
  showSurfaceNormals,
  showVertexNormals,
  simSpeed,
  smoothGeometry,
  viewMode,
} from '../stores';
import { ViewMode } from '../types';

import {
  mergeVertices,
  toCreasedNormals,
} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import layerFrag from './shaders/layerShader.frag';
import layerVert from './shaders/layerShader.vert';
import { PhysicsObject } from './simulation/PhysicsObject';
import { generateUVs } from './textures/NormalMap';

export default class Visualizer {
  private webgl: WebGLRenderer;
  private camera: PerspectiveCamera;
  private controls: OrbitControls;

  // Scene state
  private scene: Scene;
  private clock: Clock; // Timer for physics/animations
  private group: PhysicsObject; // Holds the mesh and normals
  private mesh: Mesh | undefined;
  private normals: LineSegments | undefined;
  private simSpeed: number;

  constructor() {
    // Set up renderer
    this.webgl = new WebGLRenderer({ antialias: true, alpha: true });
    this.webgl.setSize(window.innerWidth, window.innerHeight); // Default to full size of the window.
    this.webgl.setAnimationLoop(() => {
      this.animate();
    }); // Rerender the scene on every frame

    // Set up scene
    this.scene = new Scene();
    this.clock = new Clock(); // Autostart on first call

    this.simSpeed = get(simSpeed);
    simSpeed.subscribe((value) => {
      this.simSpeed = value;
    });

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
    this.group = new PhysicsObject();
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
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.3;
    this.controls.autoRotate = get(orbit);
    this.createSubscriptions();
  }

  // Subscribe to user settings to update simulator
  public createSubscriptions() {
    fileURL.subscribe((value: string) => {
      this.uploadMesh(value);
      this.resetPhysics();
    });

    viewMode.subscribe(() => {
      this.updateMeshMaterial();
      this.resetPhysics();
    });

    layerHeight.subscribe(() => this.updateMeshMaterial());

    orbit.subscribe((value: boolean) => {
      this.controls.autoRotate = value;
    });

    showVertexNormals.subscribe((value: boolean) => {
      if (this.normals) this.normals.visible = value;
    });

    showSurfaceNormals.subscribe(() => this.updateMeshMaterial());

    smoothGeometry.subscribe(() => {
      this.uploadMesh(get(fileURL));
      this.resetPhysics();
    });
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

    if (get(viewMode) == ViewMode.TEXTURE) {
      // Turn on standard material with normal map
      const normalTexture = new TextureLoader().load('alan_warburton.png');
      const scale = get(layerHeight) * 2;
      normalTexture.repeat = new Vector2(1 / scale, 1 / scale);
      normalTexture.wrapS = RepeatWrapping;
      normalTexture.wrapT = RepeatWrapping;
      generateUVs(this.mesh);

      this.mesh.material = new MeshPhysicalMaterial({
        color: materialColor,
        roughness: 0.4,
        normalMap: normalTexture,
        normalScale: new Vector2(0.6, 0.01),
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
    if (get(smoothGeometry)) {
      geometry = toCreasedNormals(geometry, Math.PI / 3);
      geometry = mergeVertices(geometry);
      geometry.computeVertexNormals();
    }
    this.normals = new VertexNormalsHelper(this.mesh, 1, 0xa4036f);
    this.group.add(this.mesh);
    this.group.add(this.normals);
    if (this.normals) this.normals.visible = get(showVertexNormals);
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

  public resetPhysics() {
    if (get(viewMode) == ViewMode.SIMULATION) {
      this.clock = new Clock();
      this.group.position.y = 0;
      this.group.v = new Vector3(0, 10, 0);
      this.group.a = new Vector3(0, -10, 0); // Accelerate downwards
    }
  }

  public updatePhysics(delta: number) {
    this.group.stepPhysics(delta);
  }

  public updateScene() {
    // Update view based on controls (mouse)
    this.controls.update();
    // Update the physics model
    if (get(viewMode) == ViewMode.SIMULATION) {
      this.updatePhysics(this.clock.getDelta() * this.simSpeed);
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
