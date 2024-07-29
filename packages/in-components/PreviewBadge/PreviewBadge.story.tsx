/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

//@ts-expect-error Added because typescript cannot recognize storybook packages outside of storybook folder
import type { StoryObj, Meta } from '@storybook/addons';

import PreviewBadge from 'in-components/PreviewBadge/PreviewBadge';

const meta: Meta<typeof PreviewBadge> = {
  component: PreviewBadge
};

export default meta;

export type Story = StoryObj<typeof PreviewBadge>;

export const PrivatePreview: Story = {
  args: {
    privatePreview: true
  }
};

export const PublicPreview: Story = {
  args: {
    privatePreview: false
  }
};
