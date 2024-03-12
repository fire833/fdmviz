import { get } from 'svelte/store';
import {
  AmbientLight,
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshNormalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  Sphere,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import {
  layerHeight,
  showSurfaceNormals,
  showVertexNormals,
  viewMode,
} from '../stores';

import layerFrag from '../graphics/layerShader.frag';
import layerVert from '../graphics/layerShader.vert';
import { ViewMode } from '../types';

export default class Simulator {
  private webgl: WebGLRenderer;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private controls: OrbitControls;

  private object: Group; // Holds the mesh

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
    this.object = new Group();
    this.scene.add(this.object);

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
    let normals = this.object.getObjectByName('normals');
    if (normals) normals.visible = show;
  }

  public updateMeshMaterial() {
    let mesh = this.object.getObjectByName('mesh');
    if (mesh instanceof Mesh) {
      if (get(showSurfaceNormals)) {
        // Turn on normal material
        mesh.material = new MeshNormalMaterial();
        return;
      }

      let materialColor = new Color('hsl(153, 60%, 71%)');

      if (get(viewMode) == ViewMode.RAW_STL) {
        // Turn on standard material
        mesh.material = new MeshStandardMaterial({
          color: materialColor,
          roughness: 0.5,
        });
      }
      if (get(viewMode) == ViewMode.SHADER) {
        // Turn on shader material
        let uniforms = {
          color: { type: 'vec3', value: materialColor },
          layerHeight: { type: 'float', value: get(layerHeight) },
        };

        mesh.material = new ShaderMaterial({
          uniforms: uniforms,
          vertexShader: layerVert,
          fragmentShader: layerFrag,
        });
      }
    }
  }

  public populateObject(geometry: BufferGeometry) {
    geometry.rotateX(-Math.PI / 2); // Change coordinate system from STL to 3js
    let mesh = new Mesh(geometry, undefined);
    let normals = new VertexNormalsHelper(mesh, 1, 0xa4036f);
    mesh.name = 'mesh';
    normals.name = 'normals';
    this.object.add(mesh);
    this.object.add(normals);
    this.setVertexNormals(get(showVertexNormals));
    this.updateMeshMaterial();
    this.rescaleCamera(mesh);
  }

  // Upload the mesh being displayed based on a certain fileURL
  //
  // utah_teapot.stl
  public uploadMesh(fileURL: string = 'utah_teapot.stl') {
    // Remove previous mesh
    this.object.clear();

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

  public showPhysics() {
    if (get(viewMode) == ViewMode.PARTICLE_SIM) {
      this.object.position.setX(
        this.object.position.x + Math.sin(this.sceneTimer) / 20,
      );
      this.object.position.setY(
        this.object.position.y + Math.cos(this.sceneTimer) / 20,
      );
    }
  }

  public updateScene() {
    // Update view based on controls (mouse)
    this.controls.update();
  }
  public animate() {
    this.sceneTimer += 6;
    this.updateScene();
    this.webgl.render(this.scene, this.camera);
    this.showPhysics();
  }

  public getHTMLElement(): HTMLElement {
    return this.webgl.domElement;
  }
}
