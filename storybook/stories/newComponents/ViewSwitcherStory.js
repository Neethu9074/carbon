import { storiesOf } from '@storybook/react';
import React from 'react';

import {ViewSwitcher, Item} from 'in-new-components/ViewSwitcher/ViewSwitcher';
import Root from '../_helpers/Root';

storiesOf('newComponents/ViewSwitcher', module).add('default', () => <Default />);

function Default() {
  return (
    <Root>
      <ViewSwitcher>
        <Item href="#" active>
          Applications
        </Item>
        <Item href="#">
          Services
        </Item>
      </ViewSwitcher>
    </Root>
  );
}
