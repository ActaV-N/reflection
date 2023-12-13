import { gsap } from "gsap";

const startText = document.querySelector(".screenSaver-start")!;

export const fadeOutStartText = () => {
  const tl = gsap.timeline();
  gsap.killTweensOf(startText);

  tl.to(
    startText,
    {
      autoAlpha: 0,
      duration: 0.3,
      ease: "power1.inOut",
    }
  );
};

export const initScreenSaver = () => {
  gsap.set('section', {
    autoAlpha: 0,
  });

  gsap.set('section#screenSaver', {
    autoAlpha: 1,
  });

  // Text
  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 0.5
  });
  gsap.killTweensOf(startText);

  tl
  .delay(0.5)
  .addLabel('fadeIn')
  .to(startText, {
    autoAlpha: 0,
    duration: 0.6,
    ease: "power1.inOut",
  }, 'fadeIn')
  .addLabel('fadeOut', '>')
  .to(startText, {
    autoAlpha: 1,
    duration: 0.6,
    ease: "power1.inOut",
  }, 'fadeOut')
}
