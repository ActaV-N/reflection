import { gsap } from "gsap";

const startText = document.querySelector(".screenSaver-start")!;

export const finishScreenSaver = async () => {
  const tl = gsap.timeline();
  gsap.killTweensOf("section#screenSaver");
  gsap.killTweensOf(startText);

  tl.to("section#screenSaver", {
    autoAlpha: 0,
    duration: 0.3,
    ease: "power1.inOut",
  });
};

export const initScreenSaver = async () => {
  // Text
  gsap.to("section#screenSaver", {
    autoAlpha: 1,
    duration: 0.5,
    ease: "power1.inOut",
  });
  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 0.5,
  });

  tl.delay(0.5)
    .addLabel("textIn")
    .to(
      startText,
      {
        autoAlpha: 0,
        duration: 0.6,
        ease: "power1.inOut",
      },
      "textIn"
    )
    .addLabel("textOut", ">")
    .to(
      startText,
      {
        autoAlpha: 1,
        duration: 0.6,
        ease: "power1.inOut",
      },
      "textOut"
    );
};
