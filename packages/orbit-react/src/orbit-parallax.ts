import React from "react";
import { OrbitParallax as OrbitParallaxVanilla } from "@bluecadet/orbit-vanilla/orbit-parallax";
import { createComponent } from "@lit/react";

export const OrbitParallax = createComponent({
  tagName: "orbit-parallax",
  elementClass: OrbitParallaxVanilla,
  react: React,
});
