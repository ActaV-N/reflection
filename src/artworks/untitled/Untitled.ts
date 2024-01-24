import * as THREE from "three";
import { fragmentShader, vertexShader } from "./shaders";
import SplineLoader from "@splinetool/loader";
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
  private camera!: THREE.OrthographicCamera;

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
    this.camera = new THREE.OrthographicCamera(
      window.innerWidth / -2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / -2,
      -50000,
      10000,
    );
    this.camera.position.set(0, 0, 0);
    this.camera.quaternion.setFromEuler(new THREE.Euler(0, 0, 0));

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

    /**
     * Spline
     */
    const loader = new SplineLoader();
    loader.load(
      "https://prod.spline.design/xKDM9wdP28w009HY/scene.splinecode",
      (splineScene) => {
        this.scene.add(splineScene);
      },
    );
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
    this.renderer.setAnimationLoop(this.render.bind(this, 0, false));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
  }

  resize(): void {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;
    this.sizes.aspectRatio = window.innerWidth / window.innerHeight;

    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}
