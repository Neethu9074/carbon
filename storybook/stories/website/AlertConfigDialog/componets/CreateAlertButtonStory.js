import { storiesOf } from '@storybook/react';
import React from 'react';

import CreateAlert from 'in-websites/AlertConfigDialog/CreateAlert';
import Root from '../../../_helpers/Root';

storiesOf('websites/AlertConfigDialog/components', module).add('Create Alert Button', () => <MenuStory />);

function MenuStory() {
  return (
    <Root>
      <CreateAlert />
    </Root>
  );
}
