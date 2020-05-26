import React from 'react';

import ProblemIndicator from 'in-new-components/ProblemIndicator';

export default {
  title: 'Molecules|ProblemIndicator',
  component: ProblemIndicator
};

export function Default() {
  return (
    <>
      <ProblemIndicator kind="danger" title="Erroneous Trace" />
      <br />
      <ProblemIndicator kind="warning" title="Clock Skew Problems Detected">
        The beacons received by Instana from end-user arrived at inconsistent times / with great delays resulting in an
        unclear activity timeline. Timestamps shown in this view were adapted to restore a meaningful activity timeline.
      </ProblemIndicator>
    </>
  );
}
