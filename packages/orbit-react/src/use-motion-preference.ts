import React from "react";
import { MotionPreferenceController } from "@bluecadet/orbit-vanilla/motion-preference";
import { useController } from "@lit/react/use-controller.js";

export function useMotionPreference() {
  const controller = useController(
    React,
    (host) => new MotionPreferenceController(host),
  );

  return controller.reduce;
}
