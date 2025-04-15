import type { Meta, StoryObj } from "@storybook/web-components";

import "@bluecadet/orbit-vanilla/orbit-carousel";
import { html } from "lit";

const meta: Meta = {
  title: "Components/Carousel",
  component: "orbit-carousel",
  tags: ["autodocs"],
  argTypes: {
    loop: { control: "boolean" },
    "align-slides": {
      control: "select",
      options: ["start", "center", "end"],
    },
    "skip-snaps": { control: "boolean" },
    "drag-free": { control: "boolean" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    loop: false,
    "align-slides": "start",
    "skip-snaps": true,
    "drag-free": false,
  },
  render: (args) => html`
    <orbit-carousel
      ?loop=${args.loop}
      align-slides=${args["align-slides"]}
      ?skip-snaps=${args["skip-snaps"]}
      ?drag-free=${args["drag-free"]}
    >
      <ul class="gap-8 flex" data-orbit-part="carousel-container">
        <li class="w-60 h-60 bg-blue-500 shrink-0"></li>
        <li class="w-60 h-60 bg-blue-500 shrink-0"></li>
        <li class="w-60 h-60 bg-blue-500 shrink-0"></li>
        <li class="w-60 h-60 bg-blue-500 shrink-0"></li>
        <li class="w-60 h-60 bg-blue-500 shrink-0"></li>
        <li class="w-60 h-60 bg-blue-500 shrink-0"></li>
        <li class="w-60 h-60 bg-blue-500 shrink-0"></li>
        <li class="w-60 h-60 bg-blue-500 shrink-0"></li>
      </ul>
    </orbit-carousel>
  `,
};
