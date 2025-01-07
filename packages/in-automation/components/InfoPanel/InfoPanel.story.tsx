/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error
import type { StoryObj } from '@storybook/react';

import InfoPanel from 'in-automation/components/InfoPanel/InfoPanel';

type Story = StoryObj<typeof InfoPanel>;

export default {
  component: InfoPanel
};

const ct = {
  title: 'The title',
  columns: [
    {
      title: 'How to setup',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      link: {
        url: 'https://www.ibm.com',
        label: 'Set up'
      }
    },
    {
      title: 'Upgrade is easy',
      text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      link: {
        url: 'https://www.ibm.com',
        label: 'Upgrade'
      }
    },
    {
      title: 'View documentation',
      text: 'ed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      link: {
        url: 'https://www.ibm.com',
        label: 'View docs'
      }
    }
  ]
};

const defaultProps = {
  collapsible: true,
  expanded: true,
  stickyTitle: false,
  content: ct,
  ariaLabel: 'ARIA label',
  showLabel: 'Show',
  hideLabel: 'Hide'
};

export const Default: Story = {
  args: {
    ...defaultProps
  }
};
