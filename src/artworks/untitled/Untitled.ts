import * as THREE from "three";
import { fragmentShader, vertexShader } from "./shaders";
import { Hud } from "../../hud";
import { World } from "../../world";
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
  private artworkMaterial!: THREE.ShaderMaterial;

  /**
   * animation
   */
  private grab: number = 0.02;

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
      -1,
      1000,
    );
    this.camera.position.set(0, 0, 0);
    this.camera.quaternion.setFromEuler(new THREE.Euler(0, 0, 0));

    // Clock
    this.clock = new THREE.Clock();

    // Meshes
    const planeGeometry = new THREE.PlaneGeometry(
      (1000 * window.innerWidth) / window.innerHeight,
      1000,
    );

    this.artworkMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uResolution: {
          value: new THREE.Vector2(this.sizes.width, this.sizes.height),
        },
        uTime: {
          value: 0,
        },
        uGrab: {
          value: 0.02,
        },
      },
    });
    const planeMesh = new THREE.Mesh(planeGeometry, this.artworkMaterial);
    planeMesh.position.set(0, -1, 0);

    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#f7f7f7");
    this.scene.add(planeMesh);
    this.scene.add(this.camera);

    // renderTarget
    this.renderTarget = new THREE.WebGLRenderTarget(
      this.sizes.width,
      this.sizes.height,
    )!;

    // Event listener
    // 의존 관계가 이상하다....
    // TODO: refactor
    const hud = Hud.of();
    const world = World.getWorld();
    hud.addEventListener("grab", (e) => {
      if (world.currentScene === "untitled") {
        this.grab = 1.5;
      }
    });

    hud.addEventListener("handlost", (e) => {
      if (world.currentScene === "untitled") {
        this.grab = 0.02;
      }
    });

    hud.addEventListener("open", (e) => {
      if (world.currentScene === "untitled") {
        this.grab = 0.02;
      }
    });
  }

  render(delta: number, rtt: boolean): void {
    const time = this.clock.getElapsedTime();
    this.artworkMaterial.uniforms.uGrab.value =
      this.artworkMaterial.uniforms.uGrab.value +
      (this.grab - this.artworkMaterial.uniforms.uGrab.value) * 0.03;
    if (rtt) {
      this.renderer.setRenderTarget(this.renderTarget);
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
    } else {
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.scene, this.camera);
    }
    this.artworkMaterial.uniforms.uTime.value = time;
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
