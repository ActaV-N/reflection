import { gsap } from "gsap";
import { World } from "../world";
import { initScreenSaver, initUntitled } from ".";
import { homeBtn, finishControlPanel, nextBtn, prevBtn } from "./components";
import { commonFinisher, commonInitializer } from "./common";
import { Hud } from "../hud";

export const finishChallenge = commonFinisher(async () => {
  await finishControlPanel();

  const tl = gsap.timeline();
  gsap.killTweensOf("section#challenge");

  tl.to("section", {
    autoAlpha: 0,
    duration: 0.3,
    ease: "power1.inOut",
  });
}, "challenge");

export const initChallenge = commonInitializer(async () => {
  const hud = Hud.of();
  hud.setPointer("ring");

  const tl = gsap.timeline();
  tl.addLabel("sceneIn").to(
    "section#challenge",
    {
      autoAlpha: 1,
      duration: 0.5,
      ease: "power1.inOut",
    },
    "sceneIn",
  );
}, "challenge");

(() => {
  const world = World.getWorld();

  gsap.set("section#challenge", {
    autoAlpha: 0,
  });

  homeBtn.addEventListener("click", async () => {
    await finishChallenge();
    await initScreenSaver();
    world.setArtworkTo("screenSaver", "distortTransition");
  });

  nextBtn.addEventListener("click", async () => {
    await finishChallenge();
    await initScreenSaver();
    world.setArtworkTo("challenge", "perlinTransition", "paintingTransition");
  });

  prevBtn.addEventListener("click", async () => {
    await finishChallenge();
    await initUntitled();
    world.setArtworkTo("untitled", "perlinTransition", "perlinTransition");
  });
})();
