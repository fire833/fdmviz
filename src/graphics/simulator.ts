import { get } from 'svelte/store';
import {
  AmbientLight,
  BufferGeometry,
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
import { showSurfaceNormals, showVertexNormals } from '../stores';

import fragShader from '../graphics/layers.frag?raw';

export default class Simulator {
  private webgl: WebGLRenderer;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private controls: OrbitControls;

  private object: Group; // Holds the mesh

  constructor() {
    // Set up renderer
    this.webgl = new WebGLRenderer({ antialias: true, alpha: true });
    this.webgl.setSize(window.innerWidth, window.innerHeight); // Default to full size of the window.
    this.webgl.setAnimationLoop(() => {
      this.render();
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

  public setMeshMaterial(show: boolean) {
    let mesh = this.object.getObjectByName('mesh');
    if (mesh! instanceof Mesh) {
      if (show) {
        // Show normal map material
        mesh.material = new MeshNormalMaterial();
      } else {
        // Show standard material
        mesh.material = new MeshStandardMaterial({
          color: 'hsl(153, 60%, 71%)',
          roughness: 0.5,
        });

        mesh.material = this.getShaderMaterial();
      }
    }
  }

  public getShaderMaterial() {
    // Create Shader Material
    var shaderMaterial = new ShaderMaterial({
      uniforms: {
        near: { value: this.camera.near }, // Pass the near plane value
        far: { value: this.camera.far }, // Pass the far plane value
      },
      fragmentShader: fragShader,
    });

    return shaderMaterial;
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
    this.setMeshMaterial(get(showSurfaceNormals));
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

  public updateScene() {
    // Update view based on controls (mouse)
    this.controls.update();
  }

  public render() {
    this.updateScene();
    this.webgl.render(this.scene, this.camera);
  }

  public getHTMLElement(): HTMLElement {
    return this.webgl.domElement;
  }
}
