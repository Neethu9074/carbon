import { storiesOf } from '@storybook/react';
import React from 'react';

import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import Root from '../../_helpers/Root';

storiesOf('designLibrary/Components/ViewSwitcher', module).add('default', () => <Default />);

function Default() {
  return (
    <Root>
      <ViewSwitcher />
    </Root>
  );
}
