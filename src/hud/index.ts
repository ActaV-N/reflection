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
  private canvas!: HTMLCanvasElement;

  private sizes!: { width: number; height: number };

  private aspectRatio!: number;

  private subject!: Subject<Hand | null>;

  private scene!: THREE.Scene;

  private gui!: GUI;

  private renderer!: THREE.WebGLRenderer;

  private hudCamera!: THREE.OrthographicCamera;

  public handMesh!: THREE.Mesh;

  private handMaterial!: THREE.ShaderMaterial;

  private handGeometry!: THREE.CircleGeometry;

  private clock!: THREE.Clock;

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
    this.canvas = document.querySelector("#hud-webgl")!;

    this.sizes = world.sizes;
    this.aspectRatio = this.sizes.width / this.sizes.height;

    Hud.DefaultHandPosition = {
      x: 0 * this.aspectRatio,
      y: -0.7,
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
      canvas: this.canvas,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setClearColor(0x1e1e1e);

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

    this.addEventListener("click", (event: PointEvent) => {
      console.log(event);
    });
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
    if (results.landmarks && results.gestures && results.handedness) {
      const landmarks = results.landmarks[0];
      const gesture = results.gestures[0];

      // TODO: refactor
      if (gesture) {
        const gestureCategory = gesture[0].categoryName;

        const isClosed = gestureCategory === GESTURE.CLOSED;

        const currentScale = this.handMaterial.uniforms.uScale.value;
        const targetScale = isClosed ? 0.6 : 1.0;
        const scaleInterpolation = isClosed ? 0.05 : 0.08;
        this.handMaterial.uniforms.uScale = {
          value:
            currentScale + (targetScale - currentScale) * scaleInterpolation,
        };
        this.handMaterial.uniforms.uClosed = {
          value: isClosed,
        };

        const point = {
          x: (landmarks[9].x - 0.5) * 2 * this.aspectRatio,
          y: -(landmarks[9].y - 0.5) * 2,
          gesture: gestureCategory,
        };

        this.handMesh.position.x =
          this.handMesh.position.x +
          (point.x - this.handMesh.position.x) * 0.05;
        this.handMesh.position.y =
          this.handMesh.position.y +
          (point.y - this.handMesh.position.y) * 0.05;

        this.point = point;
        this.subject.next(this.point);
      }

      if (results.landmarks.length === 0) {
        this.subject.next(null);
        this.handMesh.position.x =
          this.handMesh.position.x +
          (Hud.DefaultHandPosition.x - this.handMesh.position.x) * 0.01;
        this.handMesh.position.y =
          this.handMesh.position.y +
          (Hud.DefaultHandPosition.y - this.handMesh.position.y) * 0.01;
        const currentScale = this.handMaterial.uniforms.uScale.value;

        const targetScale = 1.0;
        const scaleInterpolation = 0.08;
        this.handMaterial.uniforms.uScale = {
          value:
            currentScale + (targetScale - currentScale) * scaleInterpolation,
        };
        this.handMaterial.uniforms.uClosed = {
          value: false,
        };
      }
    }
  }

  addEventListener(event: EventType, eventHandler: IEventHandler) {
    let prevGesture = GESTURE.NONE;

    let currentEvent: string = "None";

    this.subject.subscribe((hand: Hand | null) => {
      if (!hand) {
        prevGesture = GESTURE.NONE;
        currentEvent = "None";
        return;
      }

      if (prevGesture === GESTURE.CLOSED && hand.gesture === GESTURE.OPEN) {
        currentEvent = "click";
      }

      if (["click"].includes(event)) {
        if (currentEvent === "click") {
          eventHandler(hand);
        }
      }

      // Set for next subscription
      currentEvent = "None";

      if (hand.gesture !== GESTURE.NONE) {
        prevGesture = hand.gesture;
      }
    });
  }

  animate() {
    const elapsedTime = this.clock.getElapsedTime();
    this.recognizeHands(elapsedTime);
    this.renderer.render(this.scene, this.hudCamera);
  }

  // NOTE: abstract method로 뺄 수 있다.(일단 단일 기기인 아이패드에서만 사용 예정이니 resize는 미구현인체로 남겨둔다)
  resize() {
    this.sizes = this.world.sizes;

    this.renderer.setSize(this.sizes.width, this.sizes.height);
  }
}
