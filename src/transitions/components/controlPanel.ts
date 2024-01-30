import { gsap } from "gsap";

export const controlPanel = document.querySelector("#control-panel")!;
export const panelItems = controlPanel.querySelectorAll(".panel-item")!;
export const homeBtn = controlPanel.querySelector(".home")!;
export const nextBtn = controlPanel.querySelector(".next")!;
export const prevBtn = controlPanel.querySelector(".prev")!;

const OFFSET_X = 50;
const OFFSET_Y = 30;

export const initPanel = async (title?: ArtworkTitle) => {
  if (!title) {
    return;
  }

  /**
   * control panel
   */
  gsap.killTweensOf(controlPanel);

  const tl = gsap.timeline();
  tl.set(panelItems, {
    autoAlpha: 0,
  })
    .set(panelItems, {
      autoAlpha: 0,
      y: 0,
      x: 0,
      scale: 0.6,
    })
    .set(controlPanel, {
      autoAlpha: 1,
    });

  tl.delay(0.6).addLabel("panelIn");

  tl.to(
    homeBtn,
    {
      autoAlpha: 1,
      duration: 0.5,
      ease: "power1.inOut",
    },
    "panelIn+=.2",
  )
    .addLabel("homeEnd", ">-.4")
    .addLabel("prevEnd", ">-.4")
    .to(
      homeBtn,
      {
        scale: 1,
        duration: 1.2,
        ease: "elastic.inOut",
      },
      "panelIn",
    );

  if (title !== "untitled") {
    tl.to(
      prevBtn,
      {
        autoAlpha: 1,
        duration: 0.5,
        ease: "power1.inOut",
      },
      "homeEnd+=.2",
    )
      .to(
        prevBtn,
        {
          x: -OFFSET_X,
          y: OFFSET_Y,
          duration: 0.5,
          ease: "power1.out",
        },
        "homeEnd",
      )
      .addLabel("prevEnd", ">-.2")
      .to(
        prevBtn,
        {
          scale: 0.85,
          duration: 1.2,
          ease: "elastic.inOut",
        },
        "homeEnd",
      );
  }

  if(title !== "challenge") {
    tl.to(
      nextBtn,
      {
        autoAlpha: 1,
        duration: 0.5,
        ease: "power1.inOut",
      },
      "prevEnd+=.2",
    )
      .to(
        nextBtn,
        {
          x: OFFSET_X,
          y: OFFSET_Y,
          duration: 0.5,
          ease: "power1.out",
        },
        "prevEnd",
      )
      .to(
        nextBtn,
        {
          scale: 0.85,
          duration: 1.2,
          ease: "elastic.inOut",
        },
        "prevEnd",
      );
  }
};

export const finishPanel = () =>
  new Promise((resolve) => {
    const tl = gsap.timeline();

    tl.addLabel("panelOut")
      .to(
        panelItems,
        {
          scale: 0.6,
          stagger: 0.25,
          duration: 0.8,
          ease: "expo.out",
        },
        "panelOut",
      )
      .to(
        panelItems,
        {
          autoAlpha: 0,
          stagger: 0.25,
          duration: 0.3,
          eaes: "power1.inOut",
          onComplete() {
            resolve("done");
          },
        },
        "panelOut",
      );
  });
