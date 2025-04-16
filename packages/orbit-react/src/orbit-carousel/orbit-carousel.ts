import React from "react";
import { OrbitCarousel as OrbitCarouselVanilla } from "@bluecadet/orbit-vanilla/orbit-carousel";
import { createComponent } from "@lit/react";

export const OrbitCarousel = createComponent({
  tagName: "orbit-carousel",
  elementClass: OrbitCarouselVanilla,
  react: React,
});
