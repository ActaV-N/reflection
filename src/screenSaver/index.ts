import * as THREE from "three";
export class MainScreenSaver implements ScreenSaver {
  /**
   * setting properties
   */
  private sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight,
  };

  /**
   * THREE JS
   */
  // Clock
  private clock!: THREE.Clock;

  // camera
  private camera!: THREE.PerspectiveCamera;

  // scene
  private scene!: THREE.Scene;

  // renderer
  private renderer!: THREE.WebGLRenderer;

  constructor() {
    /**
     * THREE JS
     */
    // Clock
    this.clock = new THREE.Clock();

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, this.sizes.aspectRatio);
    this.camera.position.set(0, 0, 3);

    // Meshes
    const testGeometry = new THREE.BoxGeometry(1, 1, 1);
    const testMaterial = new THREE.MeshBasicMaterial({color: 'red'});
    const testMesh = new THREE.Mesh(testGeometry, testMaterial);

    // scene
    this.scene = new THREE.Scene();
    this.scene.add(testMesh);
    this.scene.add(this.camera);

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#world-webgl")!,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
  }

  animate(): void {
    this.renderer.render(this.scene, this.camera);
  }

  resize(): void {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;
    this.sizes.aspectRatio = window.innerWidth / window.innerHeight;

    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}
