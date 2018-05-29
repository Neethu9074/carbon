import { storiesOf } from '@storybook/react';
import React from 'react';

import NewApplication from 'in-applications/Forms/NewApplication/NewApplication';

import Root from '../../_helpers/Root';

storiesOf('designLibrary/Forms/ApplicationConfiguration', module).add('Default', () => <DefaultStory />);

function DefaultStory() {
  return (
    <Root>
      <NewApplication />
    </Root>
  );
}
