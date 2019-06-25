import { storiesOf } from '@storybook/react';
import React from 'react';

import ErroneousTraceIndicator from 'in-analyze/TraceDetail/components/ErroneousTraceIndicator';

import Root from '../../_helpers/Root';

storiesOf('Analyse/TraceDetail/ErroneousTraceIndicator', module).add('default', () => <Default />);

function Default() {
  return (
    <Root>
      <ErroneousTraceIndicator errorCount={1} />
    </Root>
  );
}
