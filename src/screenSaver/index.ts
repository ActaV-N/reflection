import * as THREE from "three";
import { backgroundFragmentShader, backgroundVertexShader } from './shaders';

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

  /**
   * Objects
   */
  private mainSphere!: THREE.Mesh;

  private planeBackground!: THREE.Mesh;

  constructor() {
    /**
     * THREE JS
     */
    // Texture
    const textureLoader = new THREE.TextureLoader();
    const sphereTexture = textureLoader.load("textures/sphere.png");

    // Camera
    this.camera = new THREE.PerspectiveCamera(50, this.sizes.aspectRatio);
    this.camera.position.set(0, 0, 3);

    /**
     * Meshes
     */
    // Text sphere
    const mainSphereGeometry = new THREE.SphereGeometry(0.5);
    const mainSphereMaterial = new THREE.MeshBasicMaterial({
      map: sphereTexture,
      alphaHash: true,
      side: THREE.DoubleSide,
    });
    this.mainSphere = new THREE.Mesh(mainSphereGeometry, mainSphereMaterial);
    this.mainSphere.rotation.reorder("XZY");
    this.mainSphere.position.set(0, 0, 2);

    // Main sphere
    const planeBackgroundGeometry = new THREE.PlaneGeometry(15, 15);
    const planeBackgroundMaterial = new THREE.ShaderMaterial({
      vertexShader: backgroundVertexShader,
      fragmentShader: backgroundFragmentShader,
    });

    this.planeBackground = new THREE.Mesh(planeBackgroundGeometry, planeBackgroundMaterial);
    this.planeBackground.position.set(0, 0, -5);

    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#f7f7f7");
    this.scene.add(this.camera);

    // Adding objects
    this.scene.add(this.mainSphere);
    this.scene.add(this.planeBackground);

    // renderTarget
    this.renderTarget = new THREE.WebGLRenderTarget(
      this.sizes.width,
      this.sizes.height,
    )!;
  }

  render(delta: number, rtt: boolean): void {
    if (this.mainSphere) {
      this.mainSphere.rotation.x = Math.PI / 20;
      this.mainSphere.rotation.z = -Math.PI / 20;

      this.mainSphere.rotation.y += 0.02;
    }

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
  }
}
