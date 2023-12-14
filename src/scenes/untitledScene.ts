import { gsap } from "gsap";
import { World } from "../world";
import { initScreenSaver } from ".";
const controlPanel = document.querySelector("#untitled .control-panel")!;

export const finishUntitled = async () => {
  const tl = gsap.timeline();
  gsap.killTweensOf('section#untitled');

  tl.to(
    'section#untitled',
    {
      autoAlpha: 0,
      duration: 0.3,
      ease: "power1.inOut",
    }
  );
}

export const initUntitled = async () => {
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

  tl
  .addLabel('sceneIn')
  .to('section#untitled', {
    autoAlpha: 1,
    duration: 0.5,
    ease:'power1.inOut'
  }, 'sceneIn')
  .addLabel('panelIn', '>')
  .to(panelItems, {
    autoAlpha: 1,
    duration: 0.5,
    ease: "power1.inOut",
  }, 'panelIn');
};

(() => {
  const world = World.getWorld();

  gsap.set('section#untitled', {
    autoAlpha: 0,
  });

  const closeBtn = controlPanel.querySelector(".close")!;
  closeBtn.addEventListener('click', async () => {
    world.setArtworkTo('screenSaver');
    await finishUntitled();
    await initScreenSaver();
  });
})()
