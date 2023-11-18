import { GestureRecognizer } from "@mediapipe/tasks-vision";
import { Camera } from "../camera";
import { World } from "../world";
import { FRAGMENT, VERTEX } from "./hudShaderSource";
import { HudShader } from "./hudShader";

export class Hud implements HUD {
  private canvas!: HTMLCanvasElement;

  private gl!: WebGL2RenderingContext;

  private sizes!: { width: number; height: number };

  private shader!: HudShader;

  public point: {
    left: {
      x: number;
      y: number;
      gesture: string;
    };
    right: {
      x: number;
      y: number;
      gesture: string;
    };
  } = {
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
    this.shader = new HudShader(this.gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
    });

    // Initial sizing
    this.resize();
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
        }
      }

      for (const landmarks of results.landmarks) {
        for (const landmark of landmarks) {
          const { x, y } = landmark;

          vertices.push(x * 2 - 1, -(y * 2 - 1));
        }
      }
      this.shader.updateVertices(new Float32Array(vertices));
    }
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
