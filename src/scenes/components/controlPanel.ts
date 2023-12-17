import { gsap } from "gsap";

const OFFSET_X = 50;
const OFFSET_Y = 30;
const OFFSET_Y2 = 10;

export const controlPanel = document.querySelector("#untitled .control-panel")!;
export const panelItems = controlPanel.querySelectorAll(".panel-item")!;
export const closeBtn = controlPanel.querySelector(".close")!;

export const initControlPanel = async () => {
  gsap.killTweensOf(controlPanel);

  const tl = gsap.timeline();
  tl.set(panelItems, {
    autoAlpha: 0,
  })
    .set(panelItems, {
      autoAlpha: 0,
      y: -OFFSET_Y,
      x: 0,
    })
    .set(controlPanel, {
      autoAlpha: 1,
    });

  tl.delay(0.8)
    .addLabel("panelIn")
    .to(
      panelItems,
      {
        autoAlpha: 1,
        stagger: 0.15,
        ease: "power1.inOut",
        duration: 0.5,
      },
      "panelIn"
    )
    .to(
      ".control-panel .prev",
      {
        x: -OFFSET_X,
        y: -OFFSET_Y + OFFSET_Y2,
        duration: 0.5,
        ease: "power1.out",
      },
      "panelIn"
    )
    .to(
      ".control-panel .close",
      {
        y: 0,
        duration: 0.5,
        ease: "power1.out",
      },
      "panelIn+=.15"
    )
    .to(
      ".control-panel .next",
      {
        x: OFFSET_X,
        y: -OFFSET_Y + OFFSET_Y2,
        duration: 0.5,
        ease: "power1.out",
      },
      "panelIn+=.3"
    );
};

export const finishControlPanel = () =>
  new Promise((resolve) => {
    const tl = gsap.timeline();

    tl.addLabel("panelIn")
      .to(
        panelItems,
        {
          y: -OFFSET_Y,
          x: 0,
          stagger: 0.2,
          duration: 0.5,
          ease: "power1.out",
        },
        "panelIn"
      )
      .to(
        panelItems,
        {
          autoAlpha: 0,
          stagger: 0.2,
          duration: 0.3,
          eaes: "power1.inOut",
          onComplete() {
            resolve("done");
          },
        },
        "panelIn"
      );
  });
