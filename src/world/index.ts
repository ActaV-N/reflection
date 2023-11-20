export class World {
  public sizes: { width: number; height: number; } = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  private hud!: HUD;

  constructor(){
    // const canvas = document.querySelector('#world-webgl')!;
  }

  initialize(hud: HUD) {
    /**
     * HUD
     */
    this.hud = hud;
    // this.hud.addEventListener('click', (point) => {
    //   console.log(point);
    // });
  }

  animate() {
    this.hud.animate();

    requestAnimationFrame(this.animate.bind(this));
  }

  transition() {}

  // NOTE: 일단 단일 기기인 아이패드에서만 사용 예정이니 resize는 미구현인체로 남겨둔다
  private _resize() {
    // Update sizes
    this.sizes.width = window.innerWidth
    this.sizes.height = window.innerHeight

    // Update camera
    // camera.aspect = sizes.width / sizes.height
    // camera.updateProjectionMatrix()

    // // Update renderer
    // renderer.setSize(sizes.width, sizes.height)
    // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  };

  resize() {
    this._resize();
    this.hud.resize();
  }
};