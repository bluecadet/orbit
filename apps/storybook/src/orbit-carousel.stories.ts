import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import "@bluecadet/orbit-vanilla/orbit-carousel";

const meta: Meta = {
  title: "Components/Carousel",
  component: "orbit-carousel",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () =>
    html`<orbit-carousel>
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
    </orbit-carousel>`,
};

export const DifferentSizes: Story = {
  render: () =>
    html`<orbit-carousel>
      <ul class="gap-8 flex" data-orbit-part="carousel-container">
        <li class="w-80 h-40 bg-blue-500 shrink-0"></li>
        <li class="w-40 h-50 bg-blue-500 shrink-0"></li>
        <li class="w-60 h-60 bg-blue-500 shrink-0"></li>
        <li class="w-30 h-70 bg-blue-500 shrink-0"></li>
        <li class="w-60 h-20 bg-blue-500 shrink-0"></li>
        <li class="w-80 h-40 bg-blue-500 shrink-0"></li>
        <li class="w-40 h-50 bg-blue-500 shrink-0"></li>
        <li class="w-60 h-20 bg-blue-500 shrink-0"></li>
      </ul>
    </orbit-carousel>`,
};

export const Controls: Story = {
  render: () =>
    html`<orbit-carousel>
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
      <orbit-carousel-controls class="mt-5 block"> </orbit-carousel-controls>
    </orbit-carousel>`,
};

export const Progress: Story = {
  render: () =>
    html`<orbit-carousel>
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
      <orbit-carousel-controls class="mt-5 block">
        <button data-action="prev">Previous</button>
        <button data-action="next">Next</button>
      </orbit-carousel-controls>
      <orbit-carousel-progress class="mt-5 block">
        <span slot="separator">of</span>
      </orbit-carousel-progress>
    </orbit-carousel>`,
};

export const Images: Story = {
  render: () =>
    html`<orbit-carousel>
      <ul class="gap-8 flex" data-orbit-part="carousel-container">
        <li class="w-60 h-60 bg-blue-500 shrink-0">
          <img
            src="https://picsum.photos/id/24/200"
            alt="Placeholder"
            class="w-full h-full object-cover"
          />
        </li>
        <li class="w-60 h-60 bg-blue-500 shrink-0">
          <img
            src="https://picsum.photos/id/125/200"
            alt="Placeholder"
            class="w-full h-full object-cover"
          />
        </li>
        <li class="w-60 h-60 bg-blue-500 shrink-0">
          <img
            src="https://picsum.photos/id/155/200"
            alt="Placeholder"
            class="w-full h-full object-cover"
          />
        </li>
        <li class="w-60 h-60 bg-blue-500 shrink-0">
          <img
            src="https://picsum.photos/id/34/200"
            alt="Placeholder"
            class="w-full h-full object-cover"
          />
        </li>
        <li class="w-60 h-60 bg-blue-500 shrink-0">
          <img
            src="https://picsum.photos/id/634/200"
            alt="Placeholder"
            class="w-full h-full object-cover"
          />
        </li>
        <li class="w-60 h-60 bg-blue-500 shrink-0">
          <img
            src="https://picsum.photos/id/16/200"
            alt="Placeholder"
            class="w-full h-full object-cover"
          />
        </li>
        <li class="w-60 h-60 bg-blue-500 shrink-0">
          <img
            src="https://picsum.photos/id/375/200"
            alt="Placeholder"
            class="w-full h-full object-cover"
          />
        </li>
        <li class="w-60 h-60 bg-blue-500 shrink-0">
          <img
            src="https://picsum.photos/id/543/200"
            alt="Placeholder"
            class="w-full h-full object-cover"
          />
        </li>
      </ul>
    </orbit-carousel>`,
};
