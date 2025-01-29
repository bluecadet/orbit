import React from "react";
import { OrbitMotionToggle as OrbitMotionToggleVanilla } from "@bluecadet/orbit-vanilla/orbit-motion-toggle";
import { createComponent } from "@lit/react";

export const OrbitMotionToggle = createComponent({
  tagName: "orbit-motion-toggle",
  elementClass: OrbitMotionToggleVanilla,
  react: React,
});
