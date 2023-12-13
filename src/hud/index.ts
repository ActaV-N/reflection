import { GestureRecognizer } from "@mediapipe/tasks-vision";
import * as THREE from "three";
import { Subject } from "rxjs";
import { GUI } from "dat.gui";
import { GESTURE } from "../const";
import { Camera } from "../camera";
import { World } from "../world";
import {
  ringVertexShader,
  ringFragmentShader,
  bubbleVertexShader,
  bubbleFragmentShader,
} from "./shaders";

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

  private gui!: GUI;

  /**
   * Hand properties
   */
  private targetPosition!: { x: number; y: number };

  private movingInterpolation: number = 0.05;

  private targetScale: number = 1.0;

  private scaleV: number = 0;

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
    private gestureRecognizer: GestureRecognizer
  ) {
    // rxjs
    this.subject = new Subject<Hand | null>();

    /**
     * Canvas
     */
    this.sizes = world.sizes;
    this.aspectRatio = this.sizes.width / this.sizes.height;

    this.targetPosition = Hud.DefaultHandPosition = {
      x: 0 * this.aspectRatio,
      y: -0.6,
    };

    /**
     * ## THREE JS ##
     */
    // Dat GUI
    this.gui = new GUI();

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
     * Mesh
     */
    // Geometry
    this.handGeometry = new THREE.CircleGeometry(0.2, 300);
    this.handMaterial = new THREE.ShaderMaterial({
      vertexShader: bubbleVertexShader,
      fragmentShader: bubbleFragmentShader,
      transparent: true,
      uniforms: {
        uResolution: {
          value: new THREE.Vector2(this.sizes.width, this.sizes.height),
        },
        uTime: { value: 0 },
        uScale: { value: 1 },
        uClosed: { value: false },
      },
    });

    this.gui
      .add(this.handMaterial, "fragmentShader", {
        bubble: bubbleFragmentShader,
        ring: ringFragmentShader,
      })
      .onChange((value) => {
        this.handMaterial.fragmentShader = value;
        this.handMaterial.needsUpdate = true;
      });

    this.gui
      .add(this.handMaterial, "vertexShader", {
        bubble: bubbleVertexShader,
        ring: ringVertexShader,
      })
      .onChange((value) => {
        this.handMaterial.vertexShader = value;
        this.handMaterial.needsUpdate = true;
      });

    this.handMesh = new THREE.Mesh(this.handGeometry, this.handMaterial);

    this.handMesh.position.x = Hud.DefaultHandPosition.x;
    this.handMesh.position.y = Hud.DefaultHandPosition.y;

    this.scene.add(this.handMesh);

    /**
     * Camera
     */
    this.hudCamera = new THREE.OrthographicCamera(
      -1 * this.aspectRatio,
      1 * this.aspectRatio,
      1,
      -1,
      0.1,
      100
    );

    this.hudCamera.position.z = 1;
    this.scene.add(this.hudCamera);

    /**
     * Shader
     */
    // this.shader = new HudShader(this.gl);

    // Initial sizing
    this.resize();

    /**
     * Internal event handler
     */
    // Handlers
    this.addEventListener("move", (event) => {
      const { x, y } = (event as MoveEvent).hand;

      this.targetPosition = { x, y };
    });

    this.addEventListener("open", (event) => {
      // console.log(event);
      // Control shader Uniforms
      this.scaleV = 0;
      this.targetScale = 0.7;

      /**
       * Control shader Uniforms
       */
      // isClosed
      this.handMaterial.uniforms.uClosed = {
        value: false,
      };
    });

    this.addEventListener("grab", (event) => {
      // console.log(event);
      // Inner interpolation
      this.targetScale = 0.4;

      /**
       * Control shader Uniforms
       */
      // isClosed
      this.handMaterial.uniforms.uClosed = {
        value: true,
      };
    });

    this.addEventListener("handdetected", (event) => {
      // console.log(event);
      // Inner interpolation
      this.targetScale = 0.7;
    });

    this.addEventListener("handlost", (event) => {
      // console.log(event);
      const { x, y } = Hud.DefaultHandPosition;
      this.targetPosition = { x, y };
      // Inner interpolation
      this.targetScale = 1.0;
    });
  }

  private moveHandTo(pos: { x: number; y: number }, interpolation: number) {
    this.handMesh.position.x =
      this.handMesh.position.x +
      (pos.x - this.handMesh.position.x) * interpolation;
    this.handMesh.position.y =
      this.handMesh.position.y +
      (pos.y - this.handMesh.position.y) * interpolation;
  }

  private scaleHandTo(gesture: (typeof GESTURE)[keyof typeof GESTURE]) {
    /**
     * Control shader Uniforms
     */
    // Scale
    const currentScale = this.handMaterial.uniforms.uScale.value;
    let nextScale;
    if (gesture === GESTURE.OPEN) {
      this.scaleV += (this.targetScale - currentScale) / 15;
      this.scaleV *= 0.88;

      nextScale = currentScale + this.scaleV;
    } else {
      nextScale = currentScale + (this.targetScale - currentScale) * 0.08;
    }
    this.handMaterial.uniforms.uScale = {
      value: nextScale,
    };
  }

  recognizeHands(elapsedTime: number) {
    const nowInMs = Date.now();
    const results = this.gestureRecognizer.recognizeForVideo(
      this.camera.video,
      nowInMs
    );

    const time = elapsedTime / 10;
    this.handMaterial.uniforms.uTime = { value: time };

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

    this.scaleHandTo(_gesture);
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
    this.recognizeHands(elapsedTime);
    this.moveHandTo(this.targetPosition, this.movingInterpolation);
    this.renderer.render(this.scene, this.hudCamera);
  }

  // NOTE: abstract method로 뺄 수 있다.(일단 단일 기기인 아이패드에서만 사용 예정이니 resize는 미구현인체로 남겨둔다)
  resize() {
    this.sizes = this.world.sizes;

    this.renderer.setSize(this.sizes.width, this.sizes.height);
  }

  static getDomPointFromHand(hand: Hand) {
    const aspectRatio = window.innerWidth / window.innerHeight

    const point = {
      x: (-hand.x / aspectRatio / 2 + 0.5) * window.innerWidth,
      y: (-hand.y / 2 + 0.5) * window.innerHeight,
    };

    return point;
  }
}
