import { gsap } from "gsap";
import { World } from "../world";
import { initScreenSaver } from ".";
import { closeBtn, finishControlPanel, initControlPanel, panelItems } from "./components";

export const finishUntitled = async () => {
  await finishControlPanel();

  const tl = gsap.timeline();
  gsap.killTweensOf("section#untitled");

  tl.to("section#untitled", {
    autoAlpha: 0,
    duration: 0.3,
    ease: "power1.inOut",
  });
};

export const initUntitled = async () => {
  await initControlPanel();

  const tl = gsap.timeline();
  tl.addLabel("sceneIn").to(
    "section#untitled",
    {
      autoAlpha: 1,
      duration: 0.5,
      ease: "power1.inOut",
    },
    "sceneIn"
  );
};

(() => {
  const world = World.getWorld();

  gsap.set("section#untitled", {
    autoAlpha: 0,
  });

  closeBtn.addEventListener("click", async () => {
    await finishUntitled();
    await initScreenSaver();
    world.setArtworkTo("screenSaver");
  });
})();
