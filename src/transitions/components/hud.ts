import { gsap } from "gsap";

const hudScene = document.querySelector("#hud-webgl")!;

export const initHud = async () => {
  const tl = gsap.timeline();
  gsap.killTweensOf(hudScene);

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
    delay: 0.2,
    autoAlpha: 0,
    duration: 0.5,
    ease: "power1.out",
  });
});
