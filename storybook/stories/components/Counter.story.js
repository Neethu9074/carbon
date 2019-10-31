import { storiesOf } from '@storybook/react';
import React from 'react';

import Counter from 'in-new-components/Counter';
import Root from '../_helpers/Root';

storiesOf('Components/Counter', module).add('default', () => <Default />);

function Default() {
  return (
    <Root>
      <Counter>42</Counter>
      <Counter>0</Counter>
      <Counter>1</Counter>
      <Counter>2</Counter>
      <Counter>2345</Counter>
    </Root>
  );
}
