import React from "react";
import { createComponent } from "@lit/react";
import { OrbitCarousel as OrbitCarouselVanilla } from "@bluecadet/orbit-vanilla/orbit-carousel";

export const OrbitCarousel = createComponent({
  tagName: "orbit-carousel",
  elementClass: OrbitCarouselVanilla,
  react: React,
});
