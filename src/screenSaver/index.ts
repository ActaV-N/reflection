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
  // camera
  private camera!: THREE.PerspectiveCamera;

  // scene
  private scene!: THREE.Scene;

  private renderer!: THREE.WebGLRenderer;

  // renderTarget
  public renderTarget!: THREE.WebGLRenderTarget;

  constructor() {
    /**
     * THREE JS
     */
    // Camera
    this.camera = new THREE.PerspectiveCamera(75, this.sizes.aspectRatio);
    this.camera.position.set(0, 0, 3);

    // Meshes
    const testGeometry = new THREE.BoxGeometry(1, 1, 1);
    const testMaterial = new THREE.MeshBasicMaterial({ color: "red" });
    const testMesh = new THREE.Mesh(testGeometry, testMaterial);

    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#F4FDFF')
    this.scene.add(testMesh);
    this.scene.add(this.camera);

    // renderTarget
    // NOTE: for what?
    this.renderTarget = new THREE.WebGLRenderTarget(
      this.sizes.width,
      this.sizes.height,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
      }
    )!;
  }

  render(delta: number, rtt: boolean): void {
    if(rtt) {
      this.renderer.setRenderTarget(this.renderTarget);
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
    } else{
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
  }
}
