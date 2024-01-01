import * as THREE from "three";
import { fragmentShader, vertexShader } from "./shaders";
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

  // clock
  private clock!: THREE.Clock;

  // scene
  private scene!: THREE.Scene;

  // renderTarget
  public renderTarget!: THREE.WebGLRenderTarget;

  // renderer
  private renderer!: THREE.WebGLRenderer;

  /**
   * Meshes
   */
  // Geometry

  // Material
  private testMaterial!: THREE.ShaderMaterial;

  constructor() {
    /**
     * THREE JS
     */
    // Camera
    this.camera = new THREE.PerspectiveCamera(75, this.sizes.aspectRatio);
    this.camera.position.set(0, 0, 3);

    // Clock
    this.clock = new THREE.Clock();

    // Meshes
    const testGeometry = new THREE.PlaneGeometry(15, 15);

    this.testMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uResolution: {
          value: new THREE.Vector2(this.sizes.width, this.sizes.height),
        },
        uTime: {
          value: 0,
        },
      },
    });
    const testMesh = new THREE.Mesh(testGeometry, this.testMaterial);
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
    const time = this.clock.getElapsedTime();
    if (rtt) {
      this.renderer.setRenderTarget(this.renderTarget);
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
    } else {
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.scene, this.camera);
    }
    this.testMaterial.uniforms.uTime.value = time;
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
