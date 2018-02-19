import { storiesOf } from '@storybook/react';
import React from 'react';

import Badge from 'in-new-components/Badge';
import Root from '../_helpers/Root';

storiesOf('newComponents/Badge', module).add('default', () => <Default />);

function Default() {
  return (
    <Root>
      <Badge>default</Badge>
      <Badge color="#FF6B4A">red</Badge>
      <Badge color="#3FB39A">green</Badge>
      <Badge color="#1664D6">blue</Badge>
    </Root>
  );
}
