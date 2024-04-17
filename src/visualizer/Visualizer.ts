import { get } from 'svelte/store';
import {
  AmbientLight,
  BufferGeometry,
  Clock,
  Color,
  DirectionalLight,
  DynamicDrawUsage,
  Float32BufferAttribute,
  Group,
  LineSegments,
  Mesh,
  MeshNormalMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  RawShaderMaterial,
  Scene,
  Sphere,
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
  showSurfaceUVs,
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
import { clearLoading, startLoading } from '../displayLoading';
import layerFrag from './shaders/layerShader.frag';
import layerVert from './shaders/layerShader.vert';
import { generateUVs, getNormalMap, getUVMap } from './textures/NormalMap';

import Simulator from './simulation/Simulator';

// BUFFER GEOMETRY

const maxPolygons = 30000;
const vertices = Array(3 * maxPolygons).fill(0);

const meshBufferGeometry = new BufferGeometry();
const buffer = new Float32BufferAttribute(vertices, 3);
buffer.setUsage(DynamicDrawUsage);
meshBufferGeometry.setAttribute('position', buffer);

const mesh2 = new Mesh(
  meshBufferGeometry,
  new MeshPhysicalMaterial({
    color: new Color('white'),
    roughness: 0.4,
  }),
);
mesh2.castShadow = true;
mesh2.receiveShadow = true;

export default class Visualizer {
  private webgl: WebGLRenderer;
  private camera: PerspectiveCamera;
  private controls: OrbitControls;

  container = document.getElementById('container');

  // Scene state
  private simulator: Simulator;
  private scene: Scene;
  private clock: Clock; // Timer for physics/animations
  private group: Group; // Holds the mesh and normals
  private mesh: Mesh;
  private normals: LineSegments;
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
    this.mesh = new Mesh();
    this.normals = new LineSegments();

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
    this.group = new Group();

    //Comment next line and uncomment line after to get marchiing cubes by itself
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

    this.simulator = new Simulator();
  }

  // Subscribe to user settings to update simulator
  public createSubscriptions() {
    fileURL.subscribe(async (value: string) => {
      await this.uploadMesh(value);
      this.resetPhysics();
      this.rescaleCamera();
    });

    viewMode.subscribe((mode: ViewMode) => {
      // Update our material regardless of the mode we are in.
      // We want the visualizer to be consistent with app state always.
      this.updateMeshMaterial();
      switch (mode) {
        case ViewMode.RAW_STL:
          break;
        case ViewMode.TEXTURE:
          break;
        case ViewMode.SHADER:
          break;
        case ViewMode.SIMULATION: {
          // TODO: get rendering of voxelspace working, and reduce the compute time for generating the voxel.
          // if (this.voxelspace === undefined)
          //   this.voxelspace = new VoxelSpace(50, 50, 50, this.mesh);
          this.resetPhysics();
          break;
        }
      }
    });

    layerHeight.subscribe(() => this.updateMeshMaterial());

    orbit.subscribe((value: boolean) => {
      this.controls.autoRotate = value;
    });

    showVertexNormals.subscribe((value: boolean) => {
      if (this.normals) this.normals.visible = value;
    });

    showSurfaceNormals.subscribe(() => this.updateMeshMaterial());

    showSurfaceUVs.subscribe(() => this.updateMeshMaterial());

    smoothGeometry.subscribe((value) => {
      this.uploadMesh(get(fileURL), value);
    });
  }

  public async updateMeshMaterial() {
    if (get(showSurfaceNormals)) {
      // Turn on normal material
      this.mesh.material = new MeshNormalMaterial();
      return;
    }

    if (get(showSurfaceUVs)) {
      // Turn on UV material
      generateUVs(this.mesh);

      this.mesh.material = new MeshPhysicalMaterial({
        color: new Color('white'),
        roughness: 0.4,
        map: await getUVMap(),
      });
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
      generateUVs(this.mesh);

      this.mesh.material = new MeshPhysicalMaterial({
        color: materialColor,
        roughness: 0.4,
        normalMap: await getNormalMap(),
        normalScale: new Vector2(0.6, 0.01),
      });

      return;
    }
    if (get(viewMode) == ViewMode.SIMULATION) {
      //Turn on Marching cubes
      this.group.clear();
      this.group.add(mesh2);

      return;
    }

    // Default, turn on standard material
    this.mesh.material = new MeshStandardMaterial({
      color: materialColor,
      roughness: 0.5,
    });
  }

  public populateObject(geometry: BufferGeometry, smoothGeometry: boolean) {
    geometry.rotateX(-Math.PI / 2); // Change coordinate system from STL to 3js
    this.mesh = new Mesh(geometry, undefined);
    if (smoothGeometry) {
      geometry = toCreasedNormals(geometry, Math.PI / 5);
      geometry = mergeVertices(geometry);
      geometry.computeVertexNormals();
    }
    this.normals = new VertexNormalsHelper(this.mesh, 1, 0xa4036f);
    this.group.add(this.mesh);
    this.group.add(this.normals);

    if (this.normals) this.normals.visible = get(showVertexNormals);
    this.updateMeshMaterial();
  }

  // Upload the mesh being displayed based on a certain fileURL
  //
  // utah_teapot.stl
  public async uploadMesh(
    fileURL: string = 'utah_teapot.stl',
    doSmoothGeometry: boolean = get(smoothGeometry),
  ) {
    let loadingMessage = `Loading ...${fileURL.slice(-30)}`;
    startLoading(loadingMessage);
    // Remove previous mesh
    this.group.clear();

    // Load STL
    const loader = new STLLoader();
    let geometry: BufferGeometry = await loader.loadAsync(fileURL);
    this.populateObject(geometry, doSmoothGeometry);

    clearLoading(loadingMessage);
  }

  // Rescale the camera to fit and be centered on the mesh
  public rescaleCamera() {
    const mesh = this.mesh;
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
    this.clock = new Clock();
    this.simulator.reset();
  }

  public updateScene() {
    // Update view based on controls (mouse)
    this.controls.update();

    // Update simulation
    if (get(viewMode) == ViewMode.SIMULATION) {
      this.simulator.update(this.clock.getDelta() * this.simSpeed); // Update the physics model
      this.simulator.updateMesh(meshBufferGeometry); // Regenerate the mesh based on the simulator state
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
