import { storiesOf } from '@storybook/react';
import React from 'react';

import ProblemIndicator from 'in-new-components/ProblemIndicator';

import Root from '../_helpers/Root';

storiesOf('Components/ProblemIndicator', module).add('Kinds', () => <Kinds />);

function Kinds() {
  return (
    <Root>
      <ProblemIndicator kind="danger" title="Erroneous Trace" />
      <br />
      <ProblemIndicator kind="warning" title="Clock Skew Problems Detected">
        The beacons received by Instana from end-user arrived at inconsistent times / with great delays resulting in an
        unclear activity timeline. Timestamps shown in this view were adapted to restore a meaningful activity timeline.
      </ProblemIndicator>
    </Root>
  );
}
