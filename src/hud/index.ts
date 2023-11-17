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
    if (results.landmarks && results.gestures) {
      const vertices = [];

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
