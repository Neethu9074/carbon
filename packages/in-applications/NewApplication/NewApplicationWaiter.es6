import React from 'react';

import getApplication from 'in-subscription/application/getApplication';
import { interval } from 'reactive-observables';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    result: interval(5000).flatMap(() => getApplication(props.applicationId))
  }),
  function NewApplicationWaiter() {
    return <div>WAITING</div>;
  }
);
