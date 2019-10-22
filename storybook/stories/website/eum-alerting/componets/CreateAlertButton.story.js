import { storiesOf } from '@storybook/react';
import React from 'react';

import CreateAlert from 'in-websites/eum-alerting/CreateAlert';
import Root from '../../../_helpers/Root';

storiesOf('websites/eum-alerting/components', module).add('Create Alert Button', () => <MenuStory />);

function MenuStory() {
  return (
    <Root>
      <CreateAlert />
    </Root>
  );
}
