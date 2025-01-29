import React from 'react';
import { createComponent } from '@lit/react';
import { OrbitMotionToggle as OrbitMotionToggleVanilla } from '@bluecadet/orbit-vanilla/orbit-motion-toggle';

export const OrbitMotionToggle = createComponent({
  tagName: 'orbit-motion-toggle',
  elementClass: OrbitMotionToggleVanilla,
  react: React,
});