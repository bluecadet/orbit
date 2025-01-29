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
  render: () => html` <orbit-motion-toggle></orbit-motion-toggle> `,
};
