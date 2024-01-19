import { gsap } from "gsap";
import { commonFinisher, commonInitializer } from "./common";

let ctx: gsap.Context;

export const finishScreenSaver = commonFinisher(async () => {
  ctx?.kill();
  ctx = gsap.context(() => {
    const tl = gsap.timeline();

    tl.addLabel("finish")
      .to(
        "section#screenSaver",
        {
          autoAlpha: 0,
          duration: 0.3,
          ease: "power1.inOut",
        },
        "finish"
      )
      .to(
        ".screenSaver-start",
        {
          autoAlpha: 0,
          duration: 0.3,
          ease: "power1.inOut",
        },
        "finish"
      );
  }, "section#screenSaver");
});

export const initScreenSaver = commonInitializer(async () => {
  ctx?.kill();

  // Text
  ctx = gsap.context(() => {
    gsap.to("section#screenSaver", {
      autoAlpha: 1,
      duration: 0.5,
      ease: "power1.inOut",
    });

    gsap.set(".screenSaver-start", {
      autoAlpha: 0,
    });

    const tl = gsap.timeline({
      repeat: -1,
    });

    tl.addLabel("textIn")
      .to(
        ".screenSaver-start",
        {
          autoAlpha: 1,
          duration: 0.6,
          ease: "power1.inOut",
        },
        "textIn"
      )
      .addLabel("textOut", ">")
      .to(
        ".screenSaver-start",
        {
          autoAlpha: 0,
          duration: 0.6,
          ease: "power1.inOut",
          delay: 0.5,
        },
        "textOut"
      );
  }, "section#screenSaver");
});
