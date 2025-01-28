import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import "@bluecadet/orbit-vanilla/orbit-parallax";
import "@bluecadet/orbit-vanilla/orbit-motion-toggle";


const meta: Meta = {
  title: 'Components/Motion Preference',
  component: 'orbit-motion-toggle',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Multiple elements with different speeds
export const MultipleElements: Story = {
  render: () => html`
    <orbit-motion-toggle></orbit-motion-toggle>
  `,
};
