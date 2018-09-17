import { storiesOf } from '@storybook/react';
import React from 'react';

import NewApplicationWaiter from 'in-applications/Forms/NewApplication/NewApplicationWaiter';

import Root from '../../_helpers/Root';

storiesOf('designLibrary/Application/Creating New Application Waiter', module).add(
  'Creating New Application Waiter',
  () => <CreatingNewApplicationWaiterStory />
);

function CreatingNewApplicationWaiterStory() {
  return (
    <Root>
      <NewApplicationWaiter match={{ params: { appId: '42' } }} result={{ progress: { loading: true } }} />
    </Root>
  );
}
