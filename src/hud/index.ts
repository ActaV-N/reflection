import { GestureRecognizer } from "@mediapipe/tasks-vision";
import * as THREE from "three";
import { Subject } from "rxjs";
import { GESTURE } from "../const";
import { Camera } from "../camera";
import { World } from "../world";
export class Hud implements HUD {
  private canvas!: HTMLCanvasElement;

  private sizes!: { width: number; height: number };

  private subject!: Subject<Hands | null>;

  private scene!: THREE.Scene;

  private renderer!: THREE.WebGLRenderer;

  private hudCamera!: THREE.OrthographicCamera;

  public handMesh!: {
    left: THREE.Mesh;
    right: THREE.Mesh;
  };

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

    this.sizes = world.sizes;
    /**
     * ## THREE JS ##
     */
    // Scene
    this.scene = new THREE.Scene();

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);

    /**
     * Mesh
     */
    this.handMesh = {
      left: new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.1, 0.1, 5, 5, 5),
        new THREE.MeshBasicMaterial({ color: '#8e8e8e' })
      ),
      right: new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.1, 0.1, 5, 5, 5),
        new THREE.MeshBasicMaterial({ color: '#8e8e8e' })
      ),
    }

    this.handMesh.left.position.x = -1;
    this.handMesh.left.position.y = 1;

    this.scene.add(this.handMesh.left);
    this.scene.add(this.handMesh.right);

    /**
     * Camera
     */ 
    const aspectRatio = this.sizes.width / this.sizes.height;
    this.hudCamera = new THREE.OrthographicCamera(
      -1 * aspectRatio,
      1 * aspectRatio,
      1,
      -1,
      0.1,
      100
    );

    this.hudCamera.position.z = 1
    this.scene.add(this.hudCamera);

    /**
     * Shader
     */
    // this.shader = new HudShader(this.gl);

    // Initial sizing
    this.resize();

    this.addEventListener("click", (event: PointEvent) => {
      console.log(event);
    });
  }

  recognizeHands() {
    const nowInMs = Date.now();
    const results = this.gestureRecognizer.recognizeForVideo(
      this.camera.video,
      nowInMs
    );

    /**
     * [[{x, y, z}], [{x, y, z}]]
     */
    if (results.landmarks && results.gestures && results.handedness) {
      for (let i = 0; i < 2; i++) {
        const landmarks = results.landmarks[i];
        const handed = results.handedness[i];
        const gesture = results.gestures[i];

        if (handed && gesture) {
          const hand = handed[0].categoryName.toLowerCase() as "left" | "right";
          const gestureCategory = gesture[0].categoryName;
          
          const point = {
            x: (landmarks[9].x - 0.5) * 2,
            y: - (landmarks[9].y - 0.5) * 2,
            gesture: gestureCategory,
          };
          
          this.handMesh[hand].position.x = this.handMesh[hand].position.x + (point.x - this.handMesh[hand].position.x) * 0.08;
          this.handMesh[hand].position.y = this.handMesh[hand].position.y + (point.y - this.handMesh[hand].position.y) * 0.08;

          this.point[hand] = point;
          this.subject.next(this.point);
        }
      }

      if (results.landmarks.length === 0) {
        this.subject.next(null);
      }
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

      // FIXME: 똑같은 손이면 클릭이벤트가 이상하게 작동할 수 있다.
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
    this.recognizeHands();
    this.renderer.render(this.scene, this.hudCamera);
  }

  // NOTE: abstract method로 뺄 수 있다.(일단 단일 기기인 아이패드에서만 사용 예정이니 resize는 미구현인체로 남겨둔다)
  resize() {
    this.sizes = this.world.sizes;

    this.renderer.setSize(this.sizes.width, this.sizes.height);
  }
}
