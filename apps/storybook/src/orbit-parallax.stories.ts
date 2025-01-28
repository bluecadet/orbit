import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import "@bluecadet/orbit-vanilla/orbit-parallax";

const meta: Meta = {
  title: 'Components/Orbit Parallax',
  component: 'orbit-parallax',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (story) => html`
      <div style="padding:2rem;">
        <div style="text-align: center;margin-block: 60vh;">
          Scroll down to see the parallax effect
        </div>
        ${story()}
        <div style="text-align: center;margin-block: 60vh;">
          Scroll up to see the parallax effect
        </div>
      </div>
    `
  ],
  argTypes: {
    speed: {
      control: { type: 'range', min: -2, max: 2, step: 0.1 },
      description: 'Speed of the parallax effect. Positive values move up, negative values move down.',
    }
  },
};

export default meta;
type Story = StoryObj;

// Multiple elements with different speeds
export const MultipleElements: Story = {
  render: () => html`
    <div style="display: flex; gap: 2rem; justify-content: center;">
      <orbit-parallax 
        speed="-0.5"
        style="flex:1; aspect-ratio:1/1;">
        <div style="background: coral; width: 100%; height: 100%; display: grid; place-items: center; color: white;">
          Speed: -0.5
        </div>
      </orbit-parallax>
      
      <orbit-parallax 
        speed="0.5"
        style="flex:1; aspect-ratio:1/1;">
        <div style="background: coral; width: 100%; height: 100%; display: grid; place-items: center; color: white;">
          Speed: 0.5
        </div>
      </orbit-parallax>
      
      <orbit-parallax 
        speed="1"
        style="flex:1; aspect-ratio:1/1;">
        <div style="background: coral; width: 100%; height: 100%; display: grid; place-items: center; color: white;">
          Speed: 1.0
        </div>
      </orbit-parallax>

      <orbit-parallax 
        speed="1.5"
        style="flex:1; aspect-ratio:1/1;">
        <div style="background: coral; width: 100%; height: 100%; display: grid; place-items: center; color: white;">
          Speed: 1.5
        </div>
      </orbit-parallax>
    </div>
  `,
};
