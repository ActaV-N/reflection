import "./style.css";
import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
import { Camera } from "./camera";
import { Hud } from "./hud";
import { World } from "./world";
import { MainScreenSaver } from "./screenSaver";
import { Untitled } from "./artworks";
import { finishScreenSaver, initScreenSaver, initUntitled } from "./transitions";
import { MainPointer } from "./hud/pointer";
import { RingPointer } from "./hud/pointer/ringPointer";

(async function () {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numHands: 1,
  });

  const camera = await Camera.setUpCamera();
  const world = World.getWorld();

  /**
   * Pointers
   */
  const mainPointer = new MainPointer();
  const ringPointer = new RingPointer();

  const hud = Hud.of({
    world,
    camera,
    gestureRecognizer,
  });

  hud.enrollPointer({
    'main': mainPointer,
    'ring': ringPointer,
  })

  hud.initializePointer("main");

  const screenSaver = new MainScreenSaver();
  const untitled = new Untitled();

  world.initialize(hud);
  world.setProject(screenSaver, {
    untitled,
  });

  world.animate();
  window.addEventListener("resize", () => {
    world.resize();
  });

  /**
   * Dom 제어
   */
  initScreenSaver();

  hud.addEventListener("open", async (event) => {
    if (world.currentScene === "screenSaver") {
      world.setArtworkTo("untitled");
      await finishScreenSaver();
      await initUntitled();
    }

    if (event.hand) {
      const point = Hud.getDomPointFromHand(event.hand);
      const target = document.elementFromPoint(point.x, point.y);
      if (target) {
        target.dispatchEvent(new MouseEvent("click"));
      }
    }
  });

  hud.addEventListener("move", async (event) => {
    if (event.hand) {
      const point = Hud.getDomPointFromHand(event.hand);
      const target = document.elementFromPoint(point.x, point.y);

      if (target) {
        if (target.tagName !== "SECTION") {
          target.classList.add("hover");
        } else {
          const hovers = document.querySelectorAll(".hover");
          hovers.forEach((el) => el.classList.remove("hover"));
        }
      }
    }
  });
})();

document.onclick = async function () {
  await document.body.requestFullscreen();
};
