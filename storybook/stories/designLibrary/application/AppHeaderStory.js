import { storiesOf } from '@storybook/react';
import React from 'react';

import AppHeader from 'in-components/AppHeader';

import Root from '../../_helpers/Root';

storiesOf('designLibrary/Application/Application Header', module).add('AppHeader', () => <AppHeaderStory />);

function AppHeaderStory() {
  return (
    <Root>
      <AppHeader />
    </Root>
  );
}
