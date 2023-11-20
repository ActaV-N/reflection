import { GestureRecognizer } from "@mediapipe/tasks-vision";
import { Subject } from "rxjs";
import { GESTURE } from "../const";
import { Camera } from "../camera";
import { World } from "../world";
import { FRAGMENT, VERTEX } from "./hudHandShader/hudHandShaderSource";
import { HudShader } from "./hudPointShader/hudPointShader";

export class Hud implements HUD {
  private canvas!: HTMLCanvasElement;

  private gl!: WebGL2RenderingContext;

  private sizes!: { width: number; height: number };

  private shader!: HudShader;

  private subject!: Subject<Hands | null>;

  public point: Hands = {
    left: {
      x: 0,
      y: 0,
      gesture: "",
    },
    right: {
      x: 0,
      y: 0,
      gesture: "",
    },
  };

  constructor(
    private world: World,
    private camera: Camera,
    private gestureRecognizer: GestureRecognizer
  ) {
    // rxjs
    this.subject = new Subject<Hands | null>();

    /**
     * Canvas
     */
    this.canvas = document.querySelector("#hud-webgl")!;
    this.gl = this.canvas.getContext("webgl2")!;

    this.sizes = world.sizes;

    this.canvas.width = this.sizes.width;
    this.canvas.height = this.sizes.width;

    /**
     * Shader
     */
    this.shader = new HudShader(this.gl);

    // Initial sizing
    this.resize();

    this.addEventListener("click", (event: PointEvent) => {
      console.log(event);
    });
  }

  drawLandmarks() {
    const nowInMs = Date.now();
    const results = this.gestureRecognizer.recognizeForVideo(
      this.camera.video,
      nowInMs
    );

    /**
     * [[{x, y, z}], [{x, y, z}]]
     */
    if (results.landmarks && results.gestures && results.handedness) {
      const vertices = [];
      for (let i = 0; i < 2; i++) {
        const landmarks = results.landmarks[i];
        const handed = results.handedness[i];
        const gesture = results.gestures[i];

        if (handed && gesture) {
          const hand = handed[0].categoryName.toLowerCase() as "left" | "right";
          const gestureCategory = gesture[0].categoryName;
          const point = {
            x: landmarks[9].x,
            y: landmarks[9].y,
            gesture: gestureCategory,
          };

          this.point[hand] = point;
          this.subject.next(this.point);
        }
      }

      if (results.landmarks.length === 0) {
        this.subject.next(null);
      }
      this.shader.updateVertices(results.landmarks);
    }
  }

  // TODO: type inference
  addEventListener(event: EventType, eventHandler: IEventHandler) {
    const prevGesture = {
      left: GESTURE.NONE,
      right: GESTURE.NONE,
    };

    let currentEvent: string = "None";

    this.subject.subscribe((point: Hands | null) => {
      if (!point) {
        prevGesture.left = GESTURE.NONE;
        prevGesture.right = GESTURE.NONE;
        currentEvent = "None";
        return;
      }
      const { left, right } = point;

      // TODO: 만약 클릭 정확도에 문제가 생긴다면 모델을 수정하는게 좋을수도 있다.
      if (
        prevGesture.left === GESTURE.CLOSED &&
        left.gesture === GESTURE.OPEN
      ) {
        currentEvent = "leftclick";
      }

      if (
        prevGesture.right === GESTURE.CLOSED &&
        right.gesture === GESTURE.OPEN
      ) {
        currentEvent = "rightclick";
      }

      if (["click", "rightclick"].includes(event)) {
        if (currentEvent === "rightclick") {
          eventHandler({ ...this.point.right, position: "right" });
        }
      }

      if (["click", "leftclick"].includes(event)) {
        if (currentEvent === "leftclick") {
          eventHandler({ ...this.point.left, position: "left" });
        }
      }

      // Set for next subscription
      currentEvent = "None";

      if (left.gesture !== GESTURE.NONE) {
        prevGesture.left = left.gesture;
      }
      if (right.gesture !== GESTURE.NONE) {
        prevGesture.right = right.gesture;
      }
    });
  }

  animate() {
    this.drawLandmarks();
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Shader animate
    this.shader.animate();
  }

  // NOTE: abstract method로 뺄 수 있다.(일단 단일 기기인 아이패드에서만 사용 예정이니 resize는 미구현인체로 남겨둔다)
  resize() {
    this.sizes = this.world.sizes;

    this.canvas.width = this.sizes.width;
    this.canvas.height = this.sizes.width;

    this.gl.canvas.width = this.sizes.width;
    this.gl.canvas.height = this.sizes.height;

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }
}
