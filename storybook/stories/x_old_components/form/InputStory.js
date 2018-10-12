import { storiesOf } from '@storybook/react';
import React from 'react';

import Input from 'in-components/form/Input';
import Root from '../../_helpers/Root';

storiesOf('old_components/form/Input', module).add('default', () => <Default />);

function Default() {
  return (
    <Root>
      <h2>Text Input</h2>
      <Input type="text" />

      <h2>Disabled Text Input</h2>
      <Input type="text" disabled />
    </Root>
  );
}
