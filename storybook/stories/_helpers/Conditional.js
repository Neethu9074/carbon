import React, { Fragment } from 'react';

import { clearConditions } from 'in-subscription/resultSubscriptions';
import LifecycleObserver from 'in-components/LifecycleObserver';

export default function Conditional({ children, setConditions }) {
  return (
    <Fragment>
      <LifecycleObserver onWillMount={setConditions} onWillUnmount={clearConditions} />
      {children}
    </Fragment>
  );
}
