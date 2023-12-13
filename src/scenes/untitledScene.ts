import { gsap } from "gsap";
import { World } from "../world";
const controlPanel = document.querySelector("#untitled .control-panel")!;

export const initUntitled = () => {
  gsap.set("section", {
    autoAlpha: 0,
  });

  gsap.set(controlPanel, {
    autoAlpha: 0,
  });

  gsap.set("section#untitled", {
    autoAlpha: 1,
  });

  // Control Panel
  const panelItems = controlPanel.querySelectorAll(".panel-item")!;
  gsap.killTweensOf(controlPanel);
  const tl = gsap
    .timeline()
    .set(panelItems, {
      autoAlpha: 0,
    })
    .set(controlPanel, {
      autoAlpha: 1,
    });

  tl.to(panelItems, {
    autoAlpha: 1,
    duration: 0.5,
    ease: "power1.inOut",
  });
};

(() => {
  const world = World.getWorld();

  const closeBtn = controlPanel.querySelector(".close")!;
  closeBtn.addEventListener('click', () => {
    world.setArtworkTo('screenSaver');
  });
})()
