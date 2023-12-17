import * as THREE from "three";
export class Untitled implements Artwork {
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
  // camera
  private camera!: THREE.PerspectiveCamera;

  // scene
  private scene!: THREE.Scene;

  // renderTarget
  public renderTarget!: THREE.WebGLRenderTarget;

  // renderer
  private renderer!: THREE.WebGLRenderer;

  constructor() {
    /**
     * THREE JS
     */
    // Camera
    this.camera = new THREE.PerspectiveCamera(75, this.sizes.aspectRatio);
    this.camera.position.set(0, 0, 3);

    // Meshes
    const testGeometry = new THREE.CircleGeometry(1, 32);
    const testMaterial = new THREE.MeshBasicMaterial({ color: "#1e1e1e" });
    const testMesh = new THREE.Mesh(testGeometry, testMaterial);
    testMesh.position.set(0, -1, 0);

    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#f7f7f7");
    this.scene.add(testMesh);
    this.scene.add(this.camera);

    // renderTarget
    this.renderTarget = new THREE.WebGLRenderTarget(
      this.sizes.width,
      this.sizes.height,
    )!;
  }

  render(delta: number, rtt: boolean): void {
    if (rtt) {
      this.renderer.setRenderTarget(this.renderTarget);
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
    } else {
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.scene, this.camera);
    }
  }

  setRenderer(renderer: THREE.WebGLRenderer): void {
    this.renderer = renderer;
  }

  resize(): void {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;
    this.sizes.aspectRatio = window.innerWidth / window.innerHeight;

    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}
