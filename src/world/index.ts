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
  private currentScene!: ArtworkTitle;

  private nextScene!: ArtworkTitle;

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
      if(this.currentScene === 'screenSaver'){
        this.setArtworkTo("untitled");
      } else{
        this.setArtworkTo("screenSaver");
      }
    });
  }

  public setArtworkTo(title: ArtworkTitle) {
    if (!this.needTransition) {
      this.needTransition = true;
      this.capturedTime = this.clock.getElapsedTime();

      this.transitionMaterial.uniforms.tDiffuse1.value =
        this.artworks[this.currentScene].renderTarget.texture;

      this.nextScene = this.currentScene = title;

      this.transitionMaterial.uniforms.tDiffuse2.value =
        this.artworks[this.nextScene].renderTarget.texture;

      // const time = {
      //   normalizedTime: 0,
      // }
      // new TWEEN.Tween(time)
      // .to({ normalizedTime: Math.PI / 4 }, 1.5)
      // .start()
      // .onUpdate(() => {
      //   const t =
      //     (1 + Math.cos(4 * time.normalizedTime + Math.PI)) / 2;
      //   const transition = THREE.MathUtils.smoothstep(t, 0, 1);
      //   this.transitionMaterial.uniforms.uMixRatio.value = transition;
      // })
      // .onComplete(() => {
      //   console.log('complete');
      //   this.needTransition = false;
      //   this.transitionMaterial.uniforms.tDiffuse1.value =
      //   this.artworks[this.currentScene].renderTarget.texture;
      //   this.transitionMaterial.uniforms.uMixRatio.value = 0;
      // });
    }
  }

  private artworkTransition(elapsedTime: number) {
    if (this.needTransition) {
      const t = (1 + Math.cos(Math.min(2 * (elapsedTime - this.capturedTime) + Math.PI, Math.PI * 2))) / 2;
      const transition = THREE.MathUtils.smoothstep(t, 0, 1);
      this.transitionMaterial.uniforms.uMixRatio.value = transition;

      if(t === 1) {
        this.needTransition = false;
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

    this.artworks[this.currentScene].render(delta, true);
    this.artworks[this.nextScene].render(delta, true);
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.transitionScene, this.transitionCamera);

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
