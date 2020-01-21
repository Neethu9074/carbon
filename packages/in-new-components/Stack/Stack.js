import React from 'react';

import getStack from 'in-new-components/Stack/subscriptions/getStack';
import StackPresenter from 'in-new-components/Stack/StackPresenter';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ id, timeConfig }) => ({ stackResult: getStack({ id, timeConfig }) }), function Stack({
  stackResult,
  activeTabIndex,
  onTabSelect
}) {
  if (!stackResult.data) {
    if (stackResult.errors.length > 0) {
      return <div>Error: {stackResult.errors[0]}</div>;
    }

    return null;
  }

  return <StackPresenter stack={stackResult.data} activeTabIndex={activeTabIndex} onTabSelect={onTabSelect} />;
});
