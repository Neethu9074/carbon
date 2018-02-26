import { storiesOf } from '@storybook/react';
import React from 'react';

import NewApplicationPresenter from 'in-applications/NewApplication/NewApplicationPresenter';
import Root from '../../_helpers/Root';

storiesOf('newComponents/application/create', module)
  .add('form', () => <Form />)
  .add('loading', () => <LoadingState />)
  .add('error', () => <ErrorState />);

function Form() {
  return (
    <Root>
      <NewApplicationPresenter />
    </Root>
  );
}

function LoadingState() {
  return (
    <Root>
      <NewApplicationPresenter loading loadingStateName="Saving…" error={null} />
    </Root>
  );
}

function ErrorState() {
  return (
    <Root>
      <NewApplicationPresenter error="Failed to save application configuration." />
    </Root>
  );
}
