import React from "react";
import { OrbitCarouselNavigation as OrbitCarouselNavigationVanilla } from "@bluecadet/orbit-vanilla/orbit-carousel/navigation";
import { createComponent } from "@lit/react";

export const OrbitCarouselNavigation = createComponent({
  tagName: "orbit-carousel-navigation",
  elementClass: OrbitCarouselNavigationVanilla,
  react: React,
});
