import { storiesOf } from '@storybook/react';
import React from 'react';

import Dot from 'in-new-components/Dot';
import Root from '../_helpers/Root';

storiesOf('newComponents/Dot', module).add('default', () => <Default />);

function Default() {
  return (
    <Root>
      <Dot />
      <Dot color="#1FB7B9" />
    </Root>
  );
}
