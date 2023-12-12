import * as THREE from "three";
import { vertexShader, perlinTransition as fragmentShader } from "./shader";

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

  private capturedTime: number = 0;

  // Transition Camera
  private transitionCamera!: THREE.OrthographicCamera;

  // Transition
  private transitionMaterial!: THREE.ShaderMaterial;

  private transitionGeometry!: THREE.PlaneGeometry;

  private transitionMesh!: THREE.Mesh;

  // Scenes
  private transitionScene!: THREE.Scene;

  // Renderer
  private renderer!: THREE.WebGLRenderer;

  /**
   * Artworks
   */
  public currentScene!: ArtworkTitle;

  public nextScene!: ArtworkTitle;

  private artworks!: Record<ArtworkTitle, Artwork>;

  private needTransition: boolean = false;

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
        uResolution: { value: new THREE.Vector4() },
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
    this.hud.addEventListener("open", () => {
      if (this.currentScene === "screenSaver") {
        this.setArtworkTo("untitled");
      }
    });
  }

  public setArtworkTo(title: ArtworkTitle) {
    if (!this.needTransition) {
      this.needTransition = true;
      this.capturedTime = this.clock.getElapsedTime();

      this.transitionMaterial.uniforms.tDiffuse1.value =
        this.artworks[this.currentScene].renderTarget.texture;

      this.nextScene = title;

      this.transitionMaterial.uniforms.tDiffuse2.value =
        this.artworks[this.nextScene].renderTarget.texture;
    }
  }

  private artworkTransition(elapsedTime: number) {
    if (this.needTransition) {
      const t =
        (1 +
          Math.cos(
            Math.min(
              2 * (elapsedTime - this.capturedTime) + Math.PI,
              Math.PI * 2
            )
          )) /
        2;
      const transition = THREE.MathUtils.smoothstep(t, 0, 1);
      this.transitionMaterial.uniforms.uMixRatio.value = transition;

      if (t === 1) {
        this.needTransition = false;
        this.currentScene = this.nextScene;
        this.transitionMaterial.uniforms.tDiffuse1.value =
          this.artworks[this.currentScene].renderTarget.texture;
        this.transitionMaterial.uniforms.uMixRatio.value = 0;
      }
    }
  }

  animate() {
    // HUD
    this.hud.render();

    // Time
    const elapsedTime = this.clock.getElapsedTime();
    const delta = this.clock.getDelta();

    this.artworkTransition(elapsedTime);

    const transitionValue = this.transitionMaterial.uniforms.uMixRatio.value;

    if (transitionValue === 0) {
      this.artworks[this.currentScene].render(delta, false);
    } else if (transitionValue === 1) {
      this.artworks[this.nextScene].render(delta, false);
    } else {
      this.artworks[this.currentScene].render(delta, true);
      this.artworks[this.nextScene].render(delta, true);
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.transitionScene, this.transitionCamera);
    }

    requestAnimationFrame(this.animate.bind(this));
  }

  public setProject(
    screenSaver: Artwork,
    artworks: Omit<Record<ArtworkTitle, Artwork>, "screenSaver">
  ) {
    const firstArtworkTitle = Object.keys(artworks)[0] as ArtworkTitle;
    this.currentScene = "screenSaver";
    this.nextScene = firstArtworkTitle;

    this.artworks = {
      ...artworks,
      screenSaver,
    };
    const firstArtwork = this.artworks[firstArtworkTitle];

    for (const artwork of Object.values(this.artworks)) {
      artwork.setRenderer(this.renderer);
    }

    this.transitionMaterial.uniforms.tDiffuse1.value =
      this.artworks.screenSaver.renderTarget.texture;
    this.transitionMaterial.uniforms.tDiffuse2.value =
      firstArtwork.renderTarget.texture;
  }

  // NOTE: 일단 단일 기기인 아이패드에서만 사용 예정이니 resize는 미구현인체로 남겨둔다
  private _resize() {
    // Update sizes
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.setResolution();
  }

  // NOTE: transition2.glsl을 사용할 때 필요한 Uniform이라 필요없을수도 있다.
  private setResolution() {
    if (this.transitionMaterial) {
      this.transitionMaterial.uniforms.uResolution.value.x = this.sizes.width;
      this.transitionMaterial.uniforms.uResolution.value.y = this.sizes.height;
      this.transitionMaterial.uniforms.uResolution.value.z = 1;
      this.transitionMaterial.uniforms.uResolution.value.w = 1;
    }
  }

  resize() {
    this._resize();
    this.hud.resize();
  }
}
