import { storiesOf } from '@storybook/react';
import React from 'react';

import EmptyAppList from 'in-applications/lists/components/EmptyAppList';

import Root from '../../_helpers/Root';

storiesOf('designLibrary/Application/Empty Application List', module).add('EmptyAppList', () => <EmptyAppListStory />);

function EmptyAppListStory() {
  return (
    <Root>
      <EmptyAppList />
    </Root>
  );
}
