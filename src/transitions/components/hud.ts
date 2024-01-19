import { gsap } from "gsap";

const hudScene = document.querySelector("#hud-webgl")!;

export const initHud = async (title?: ArtworkTitle) => {
  

  const tl = gsap.timeline();
  gsap.killTweensOf(hudScene);

  // TODO: 너무 빨리 사라지는데?
  tl.to(hudScene, {
    autoAlpha: 1,
    duration: 0.5,
    ease: "power1.inOut",
  });
};

export const finishHud = () => new Promise((resolve) => {
  const tl = gsap.timeline({
    onComplete: () => {
      resolve('done');
    },
  });
  gsap.killTweensOf(hudScene);

  tl.to(hudScene, {
    autoAlpha: 0,
    duration: 0.3,
    ease: "power1.out",
  });
});
