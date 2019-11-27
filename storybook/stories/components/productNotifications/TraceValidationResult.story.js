import { storiesOf } from '@storybook/react';
import React from 'react';

import TraceValidationResult, { issueMessages } from 'in-analyze/TraceDetail/tabs/Summary/TraceValidationResult';

import Root from '../../_helpers/Root';

storiesOf('Components/Product Notifications', module).add('Trace Validation Result', () => <KindsStory />);

function KindsStory() {
  return (
    <Root>
      {Object.keys(issueMessages).map(key => (
        <TraceValidationResult key={key} issues={[key]} />
      ))}

      <TraceValidationResult issues={Object.keys(issueMessages)} />
    </Root>
  );
}
