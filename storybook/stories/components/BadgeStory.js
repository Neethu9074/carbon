import { storiesOf } from '@storybook/react';
import React from 'react';

import Badge from 'in-components/Badge';

storiesOf('components/Badge', module).add('sizes', () => <Sizes />);

function Sizes() {
  return (
    <div>
      <Badge>default</Badge>
      <Badge size="sm">sm</Badge>
    </div>
  );
}
