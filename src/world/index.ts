import { MainScreenSaver } from "../screenSaver";

export class World {
  public sizes: { width: number; height: number; } = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  private hud!: HUD;
  
  /**
   * Screen Saver
  */
  private screenSaver!: ScreenSaver;

  constructor(){
    // Screen Saver
    this.screenSaver = new MainScreenSaver();

    /**
     * THREE JS
     */
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
    this.screenSaver.animate();

    requestAnimationFrame(this.animate.bind(this));
  }

  transition() {}

  // NOTE: 일단 단일 기기인 아이패드에서만 사용 예정이니 resize는 미구현인체로 남겨둔다
  private _resize() {
    // Update sizes
    this.sizes.width = window.innerWidth
    this.sizes.height = window.innerHeight
  };

  resize() {
    this._resize();
    this.hud.resize();
  }
};
