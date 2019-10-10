import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import Menu from 'in-websites/AlertConfigDialog/components/Menu';
import Root from '../../../_helpers/Root';

storiesOf('websites/AlertConfigDialog/components', module)
  .add('Menu', () => <MenuStory />)
  .add('Menu with right seperator', () => <MenuWithSeperatorStory />);

const entries = ['Menu 1', 'Menu 2', 'Menu 3'];

function MenuStory() {
  return (
    <Root style={{ width: '200px' }}>
      <Menu itemLabels={entries} itemClickTracker={action('click')} />
    </Root>
  );
}

function MenuWithSeperatorStory() {
  return (
    <Root style={{ width: '200px' }}>
      <Menu itemLabels={entries} itemClickTracker={action('click')} initialItemSelected={1} addRightSeperator />
    </Root>
  );
}
