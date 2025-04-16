import type { Meta, StoryObj } from "@storybook/web-components";

import "@bluecadet/orbit-vanilla/orbit-carousel";
import "@bluecadet/orbit-vanilla/orbit-carousel/navigation";
import "@bluecadet/orbit-vanilla/orbit-carousel/progress";

import { html } from "lit";

const meta: Meta = {
  title: "Components/Carousel",
  component: "orbit-carousel",
  subcomponents: {
    "orbit-carousel-navigation": "orbit-carousel-navigation",
    "orbit-carousel-progress": "orbit-carousel-progress",
  },
  argTypes: {
    loop: { control: "boolean" },
    "align-slides": {
      control: "select",
      options: ["start", "center", "end"],
    },
    "force-snap": { control: "boolean" },
    "drag-free": { control: "boolean" },
    "slides-selector": { control: "text" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    loop: false,
    "align-slides": "start",
    "force-snap": false,
    "drag-free": false,
  },
  render: (args) => html`
    <orbit-carousel
      ?loop=${args.loop}
      align-slides=${args["align-slides"]}
      ?force-snap=${args["force-snap"]}
      ?drag-free=${args["drag-free"]}
    >
      <ul class="gap-8 flex" data-orbit-slides>
        <li class="w-60 h-60 bg-blue-500 shrink-0"></li>
        <li class="w-60 h-60 bg-blue-500 shrink-0"></li>
        <li class="w-60 h-60 bg-blue-500 shrink-0"></li>
        <li class="w-60 h-60 bg-blue-500 shrink-0"></li>
        <li class="w-60 h-60 bg-blue-500 shrink-0"></li>
        <li class="w-60 h-60 bg-blue-500 shrink-0"></li>
        <li class="w-60 h-60 bg-blue-500 shrink-0"></li>
        <li class="w-60 h-60 bg-blue-500 shrink-0"></li>
      </ul>
      <orbit-carousel-navigation direction="prev">
        Previous
      </orbit-carousel-navigation>
      <orbit-carousel-navigation direction="next">
        Next
      </orbit-carousel-navigation>
      <orbit-carousel-progress>
        <span data-orbit-current>{current}</span> / <span data-orbit-total>{total}</span>
      </orbit-carousel-progress>
    </orbit-carousel>
  `,
};
