import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shader";

export class World {
  public sizes: { width: number; height: number; aspectRatio: number } = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight,
  };

  private hud!: HUD;

  /**
   * THREE JS
   */
  // Clock
  private clock!: THREE.Clock;

  // Transition Camera
  private transitionCamera!: THREE.OrthographicCamera;

  // Mesh
  private transitionMaterial!: THREE.ShaderMaterial;

  private transitionGeometry!: THREE.PlaneGeometry;

  private transitionMesh!: THREE.Mesh;

  // Scenes
  private transitionScene!: THREE.Scene;

  // Renderer
  private renderer!: THREE.WebGLRenderer;

  /**
   * Main artworks
   */

  private currentScene!: Artwork;

  private nextScene!: Artwork;

  private screenSaver!: Artwork;

  private artworks!: Artwork[];

  constructor() {
    /**
     * THREE JS
     */
    // Clock
    this.clock = new THREE.Clock();

    // Mesh
    const texture = new THREE.TextureLoader().load("textures/perlin.png");

    this.transitionGeometry = new THREE.PlaneGeometry(
      this.sizes.width,
      this.sizes.height
    );
    this.transitionMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tMixTexture: { value: texture },
        uMixRatio: { value: 0 },
        tDiffuse1: { value: null },
        tDiffuse2: { value: null },
      },
      vertexShader,
      fragmentShader,
    });

    this.transitionMesh = new THREE.Mesh(
      this.transitionGeometry,
      this.transitionMaterial
    );
    this.transitionMesh.position.set(0, 0, -2);

    // Transition Camera
    this.transitionCamera = new THREE.OrthographicCamera(
      window.innerWidth / -2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / -2,
      -10,
      10
    );

    // Transition scene
    this.transitionScene = new THREE.Scene();
    this.transitionScene.add(this.transitionCamera);
    this.transitionScene.add(this.transitionMesh);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#world-webgl")!,
    });

    this._resize();
  }

  initialize(hud: HUD) {
    /**
     * HUD
     */
    this.hud = hud;
  }

  animate() {
    this.hud.render();

    const t = (1 + Math.sin(2 * this.clock.getElapsedTime() / Math.PI)) / 2;
    const transition = THREE.MathUtils.smoothstep(t, 0.3, 0.7);
    this.transitionMaterial.uniforms.uMixRatio.value = transition;

    const delta = this.clock.getDelta();
    
    this.currentScene.render(delta, true);
    this.nextScene.render(delta, true);
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.transitionScene, this.transitionCamera);

    requestAnimationFrame(this.animate.bind(this));
  }

  public setScreenSaver(screenSaver: ScreenSaver) {
    this.currentScene = screenSaver;

    this.screenSaver = screenSaver;
    this.screenSaver.setRenderer(this.renderer);

    this.transitionMaterial.uniforms.tDiffuse1.value = this.screenSaver.renderTarget.texture;
  }

  public setArtworks(artworks: Artwork[]) {
    this.artworks = artworks;

    for(const artwork of artworks) {
      artwork.setRenderer(this.renderer);
    }

    if(artworks.length) {
      this.nextScene = artworks[0];
      this.transitionMaterial.uniforms.tDiffuse2.value = this.nextScene.renderTarget.texture;
    }
  }

  transition() {}

  // NOTE: 일단 단일 기기인 아이패드에서만 사용 예정이니 resize는 미구현인체로 남겨둔다
  private _resize() {
    // Update sizes
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  resize() {
    this._resize();
    this.hud.resize();
  }
}
