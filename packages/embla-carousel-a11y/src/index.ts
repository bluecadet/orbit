import type { CreatePluginType, EmblaCarouselType } from "embla-carousel";
import { OptionsType } from "./options";

declare module "embla-carousel" {
  interface EmblaPluginsType {
    a11y: A11yPluginType;
  }

  interface EmblaEventListType {
    // TODO: Add events here, e.g:
    // a11yUpdateLabels: 'a11y:updateLabels'
  }
}

export type A11yPluginType = CreatePluginType<
  {
    // TODO: add any method types
  },
  OptionsType
>;

export type A11yPluginOptionsType = A11yPluginType["options"];

class A11yPlugin implements A11yPluginType {
  readonly name = "a11y";
  readonly options: A11yPluginOptionsType;

  constructor(options: A11yPluginOptionsType = {}) {
    this.options = options;
  }

  init(embla: EmblaCarouselType): void {}

  destroy(): void {}
}

export default function A11y(options: A11yPluginOptionsType): A11yPluginType {
  return new A11yPlugin(options);
}
