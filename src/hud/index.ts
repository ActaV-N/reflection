import { GestureRecognizer } from "@mediapipe/tasks-vision";
import * as THREE from "three";
import { Subject } from "rxjs";
import { GESTURE, IPAD_CONST } from "../const";
import { Camera } from "../camera";
import { World } from "../world";
import { bubbleVertexShader, bubbleFragmentShader } from "./shaders";
import { MainPointer } from "./pointer";
import { Pointer } from "../libs";

export class Hud implements HUD {
  /**
   * THREE JS properties
   */
  private scene!: THREE.Scene;

  private renderer!: THREE.WebGLRenderer;

  private hudCamera!: THREE.OrthographicCamera;

  public handMesh!: THREE.Mesh;

  private handMaterial!: THREE.ShaderMaterial;

  private handGeometry!: THREE.CircleGeometry;

  private clock!: THREE.Clock;

  /**
   * Setting properties
   */
  private sizes!: { width: number; height: number };

  private aspectRatio!: number;

  private subject!: Subject<Hand | null>;

  /**
   * Pointer
   */
  private pointer!: Pointer;

  /**
   * Public properties
   */
  // hand position
  public point: Hand = {
    x: 0,
    y: 0,
    gesture: "",
  };

  public static DefaultHandPosition: {
    x: number;
    y: number;
  };

  constructor(
    private world: World,
    private camera: Camera,
    private gestureRecognizer: GestureRecognizer,
  ) {
    // rxjs
    this.subject = new Subject<Hand | null>();

    /**
     * Canvas
     */
    this.sizes = world.sizes;
    this.aspectRatio = this.sizes.width / this.sizes.height;

    /**
     * ## THREE JS ##
     */
    // Clock
    this.clock = new THREE.Clock();

    // Scene
    this.scene = new THREE.Scene();

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#hud-webgl")!,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    /**
     * Pointer
     */
    Hud.DefaultHandPosition = {
      x: 0 * this.aspectRatio,
      y: -0.6,
    };

    this.pointer = new MainPointer();

    this.pointer.setDefaultPosition(Hud.DefaultHandPosition);
    this.scene.add(this.pointer.handMesh);

    /**
     * Camera
     */
    this.hudCamera = new THREE.OrthographicCamera(
      -1 * this.aspectRatio,
      1 * this.aspectRatio,
      1,
      -1,
      0.1,
      100,
    );

    this.hudCamera.position.z = 1;
    this.scene.add(this.hudCamera);

    /**
     * Shader
     */
    // Initial sizing
    this.resize();

    /**
     * Internal event handler
     */
    // Handlers
    this.addEventListener("move", this.pointer.moveHandler.bind(this.pointer));

    this.addEventListener("open", this.pointer.openHandler.bind(this.pointer));

    this.addEventListener("grab", this.pointer.grabHandler.bind(this.pointer));

    this.addEventListener(
      "handdetected",
      this.pointer.handDetectHandler.bind(this.pointer),
    );

    this.addEventListener(
      "handlost",
      this.pointer.handLostHandler.bind(this.pointer),
    );
  }

  recognizeHands() {
    const nowInMs = Date.now();
    const results = this.gestureRecognizer.recognizeForVideo(
      this.camera.video,
      nowInMs,
    );

    /**
     * [[{x, y, z}], [{x, y, z}]]
     */
    let _gesture = GESTURE.NONE;
    if (results.landmarks && results.gestures && results.handedness) {
      const landmarks = results.landmarks[0];
      const gesture = results.gestures[0];

      if (gesture) {
        _gesture = gesture[0].categoryName;

        const point = {
          x: (landmarks[9].x - 0.5) * 2 * this.aspectRatio,
          y: -(landmarks[9].y - 0.5) * 2,
          gesture: _gesture,
        };

        this.point = point;
        this.subject.next(this.point);
      }

      if (results.landmarks.length === 0) {
        _gesture = GESTURE.NONE;
        this.subject.next(null);
      }
    }

    this.pointer.handleGesture(_gesture);
  }

  addEventListener(event: EventType, eventHandler: IEventHandler) {
    let prevGesture = GESTURE.NONE;
    let prevHand: Hand | null = null;

    this.subject.subscribe((hand: Hand | null) => {
      if (!hand) {
        if (prevHand && !hand) {
          ["handlost"].includes(event) &&
            eventHandler({
              name: "handlost",
              hand,
            });
        }

        prevGesture = GESTURE.NONE;
        prevHand = null;
        return;
      }

      if (!prevHand && hand) {
        ["handdetected"].includes(event) &&
          eventHandler({
            name: "handdetected",
            hand,
          });
      }

      if (prevGesture !== GESTURE.CLOSED && hand.gesture === GESTURE.CLOSED) {
        ["grab"].includes(event) &&
          eventHandler({
            name: "grab",
            hand,
          });
      }

      if (prevGesture === GESTURE.CLOSED && hand.gesture === GESTURE.OPEN) {
        ["open"].includes(event) &&
          eventHandler({
            name: "open",
            hand,
          });
      }

      ["move"].includes(event) &&
        eventHandler({
          name: "move",
          hand,
        });

      // Set for next subscription
      if (hand.gesture !== GESTURE.NONE) {
        prevGesture = hand.gesture;
      }
      prevHand = hand;
    });
  }

  render() {
    const elapsedTime = this.clock.getElapsedTime();
    this.recognizeHands();
    this.pointer.render(elapsedTime);
    this.renderer.render(this.scene, this.hudCamera);
  }

  // NOTE: abstract method로 뺄 수 있다.(일단 단일 기기인 아이패드에서만 사용 예정이니 resize는 미구현인체로 남겨둔다)
  resize() {
    this.sizes = this.world.sizes;

    this.renderer.setSize(this.sizes.width, this.sizes.height);
  }

  static getDomPointFromHand(hand: Hand) {
    const aspectRatio = window.innerWidth / window.innerHeight;

    const point = {
      x: (-hand.x / aspectRatio / 2 + 0.5) * window.innerWidth,
      y: (-hand.y / 2 + 0.5) * window.innerHeight,
    };

    return point;
  }
}
