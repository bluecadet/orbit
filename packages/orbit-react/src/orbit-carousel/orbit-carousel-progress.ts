import React from "react";
import { createComponent } from "@lit/react";
import { OrbitCarouselProgress as OrbitCarouselProgressVanilla } from "@bluecadet/orbit-vanilla/orbit-carousel/progress";

export const OrbitCarouselProgress = createComponent({
  tagName: "orbit-carousel-progress",
  elementClass: OrbitCarouselProgressVanilla,
  react: React,
});
