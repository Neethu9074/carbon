import { storiesOf } from '@storybook/react';
import React from 'react';

import Badge from 'in-new-components/Badge';
import Root from '../_helpers/Root';

storiesOf('newComponents/Badge', module).add('sizes', () => <Sizes />);

function Sizes() {
  return (
    <Root>
      mid
      <Badge>default</Badge>
      <Badge color="#FF6B4A">red</Badge>
      <Badge color="#3FB39A">green</Badge>
      <Badge color="#1664D6">blue</Badge>
      <br />
      small
      <Badge size="sm">default</Badge>
      <Badge color="#FF6B4A" size="sm">
        red
      </Badge>
      <Badge color="#3FB39A" size="sm">
        green
      </Badge>
      <Badge color="#1664D6" size="sm">
        blue
      </Badge>
      <br />
      very small
      <Badge size="xs">default</Badge>
      <Badge color="#FF6B4A" size="xs">
        red
      </Badge>
      <Badge color="#3FB39A" size="xs">
        green
      </Badge>
      <Badge color="#1664D6" size="xs">
        blue
      </Badge>
    </Root>
  );
}
