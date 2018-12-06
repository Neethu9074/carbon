import { storiesOf } from '@storybook/react';
import React from 'react';

import UsageMessage from 'in-components/MessageFlyout/UsageMessage';

import Root from '../../_helpers/Root';

storiesOf('Components/flyouts/Usage', module).add('Usage', () => <UsageStory />);

function UsageStory() {
  return (
    <Root>
      <UsageMessage
        message={{
          type: 'warning',
          onClick: () => {},
          icon: 'lib_kubernetes_label',
          content: 'Your license expires in 6 days!'
        }}
      />
    </Root>
  );
}
