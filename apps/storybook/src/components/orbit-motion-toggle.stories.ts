import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import "@bluecadet/orbit-vanilla/orbit-motion-toggle";

const meta: Meta = {
  title: "Components/Motion Toggle",
  component: "orbit-motion-toggle",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => {
    return html`
      <orbit-motion-toggle>
        <span slot="enabled-label">${args["enabled-label"]}</span>
        <span slot="disabled-label">${args["disabled-label"]}</span>
      </orbit-motion-toggle>
    `;
  },
  args: {
    "enabled-label": "Motion enabled",
    "disabled-label": "Motion disabled",
  },
};
