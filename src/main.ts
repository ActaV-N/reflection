import "./style.css";
import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
import { Camera } from "./camera";
import { Hud } from "./hud";
import { World } from "./world";

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
  const world = new World();
  const hud = new Hud(world, camera, gestureRecognizer);

  world.initialize(hud);

  world.animate();
  window.addEventListener("resize", () => {
    world.resize();
  });
})();
