import React from 'react';
import { createComponent } from '@lit/react';
import { OrbitParallax as OrbitParallaxVanilla } from '@bluecadet/orbit-vanilla/orbit-parallax';

export const OrbitParallax = createComponent({
  tagName: 'orbit-parallax',
  elementClass: OrbitParallaxVanilla,
  react: React,
});