import { storiesOf } from '@storybook/react';
import React from 'react';

import NewApplicationPresenter from 'in-applications/NewApplication/NewApplicationPresenter';
import Root from '../../_helpers/Root';

storiesOf('newComponents/application/create', module).add('form', () => <Form />);

function Form() {
  return (
    <Root>
      <NewApplicationPresenter />
    </Root>
  );
}
