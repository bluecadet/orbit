import React from "react";
import { OrbitCarouselProgress as OrbitCarouselProgressVanilla } from "@bluecadet/orbit-vanilla/orbit-carousel/progress";
import { createComponent } from "@lit/react";

export const OrbitCarouselProgress = createComponent({
  tagName: "orbit-carousel-progress",
  elementClass: OrbitCarouselProgressVanilla,
  react: React,
});
