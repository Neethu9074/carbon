import { storiesOf } from '@storybook/react';
import React from 'react';

import ErroneousTraceIndicator from 'in-analyze/TraceDetail/components/ErroneousTraceIndicator';

storiesOf('Analyse/TraceDetail/ErroneousTraceIndicator', module).add('default', () => (
  <ErroneousTraceIndicator errorCount={1} />
));
