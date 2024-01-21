import { gsap } from "gsap";
import { World } from "../world";
import { initScreenSaver } from ".";
import {
  homeBtn,
  finishControlPanel,
} from "./components";
import { commonFinisher, commonInitializer } from "./common";
import { Hud } from "../hud";

export const finishUntitled = commonFinisher(async () => {
  await finishControlPanel();

  const tl = gsap.timeline();
  gsap.killTweensOf("section#untitled");

  tl.to("section#untitled", {
    autoAlpha: 0,
    duration: 0.3,
    ease: "power1.inOut",
  });
}, 'untitled');

export const initUntitled = commonInitializer(async () => {
  const hud = Hud.of();
  hud.setPointer('ring');

  const tl = gsap.timeline();
  tl.addLabel("sceneIn").to(
    "section#untitled",
    {
      autoAlpha: 1,
      duration: 0.5,
      ease: "power1.inOut",
    },
    "sceneIn",
  );
}, 'untitled');


(() => {
  const world = World.getWorld();

  gsap.set("section#untitled", {
    autoAlpha: 0,
  });

  homeBtn.addEventListener("click", async () => {
    await finishUntitled();
    await initScreenSaver();
    world.setArtworkTo("screenSaver", "distortTransition");
  });
})();
