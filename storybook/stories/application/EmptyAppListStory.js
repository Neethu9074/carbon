import { storiesOf } from '@storybook/react';
import React from 'react';

import ApplicationsNoDataNotification from 'in-applications/lists/components/ApplicationsNoDataNotification';

import Root from '../_helpers/Root';

storiesOf('Application/Application/Empty Application List', module).add('Empty Application List', () => (
  <EmptyAppListStory />
));

function EmptyAppListStory() {
  return (
    <Root>
      <ApplicationsNoDataNotification />
    </Root>
  );
}
