import "./style.css";
import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
import { Camera } from "./camera";
import { Hud } from "./hud";
import { World } from "./world";
import { MainScreenSaver } from "./screenSaver";
import { Untitled } from "./artworks";

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

  const screenSaver = new MainScreenSaver();

  const untitled = new Untitled();
  
  world.initialize(hud);
  world.setProject(screenSaver, {
    untitled
  });

  world.animate();
  window.addEventListener("resize", () => {
    world.resize();
  });

  /**
   * Dom 제어
   */
  // Screen saver elements
  const startText = document.querySelector('.screenSaver-start')!;

  hud.addEventListener('open', (event) => {
    if(world.currentScene === 'screenSaver') {
      startText.classList.add('hidden');
    }
    
    if(event.hand) {
      const point = Hud.getDomPointFromHand(event.hand)
      const target = document.elementFromPoint(point.x, point.y);
      if(target) {
        target.dispatchEvent(new MouseEvent('click'));
      }
    }
  });
})();
