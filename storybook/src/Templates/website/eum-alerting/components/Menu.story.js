import { action } from '@storybook/addon-actions';
import React from 'react';

import Menu from 'in-websites/eum-alerting/components/Menu';

export default {
  title: 'Templates|website/eum-alerting/components/Menu',
  component: Menu,
  decorators: [action]
};

const entries = ['Item 1', 'Item 2', 'Item 3'];

export const MenuDefault = () => <Menu itemLabels={entries} itemClickTracker={action('click')} />;

export const MenuWithSeperator = () => (
  <div style={{ width: '200px' }}>
    <Menu itemLabels={entries} itemClickTracker={action('click')} initialItemSelected={1} addRightSeparator />
  </div>
);
