import { storiesOf } from '@storybook/react';
import React from 'react';

import Badge from 'in-components/Badge';
import Root from '../_helpers/Root';

storiesOf('old_components/Badge', module).add('sizes', () => <Sizes />);

function Sizes() {
  return (
    <Root>
      <Badge>default</Badge>
      <Badge size="sm">sm</Badge>
    </Root>
  );
}
