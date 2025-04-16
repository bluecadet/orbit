import React from "react";
import { createComponent } from "@lit/react";
import { OrbitCarouselNavigation as OrbitCarouselNavigationVanilla } from "@bluecadet/orbit-vanilla/orbit-carousel/navigation";

export const OrbitCarouselNavigation = createComponent({
  tagName: "orbit-carousel-navigation",
  elementClass: OrbitCarouselNavigationVanilla,
  react: React,
});
