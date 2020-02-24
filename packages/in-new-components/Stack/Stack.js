import React from 'react';

import { getStack, getStackForApplication, getStackForService } from 'in-new-components/Stack/subscriptions/getStack';
import StackPresenter from 'in-new-components/Stack/StackPresenter';
import connectTo from 'in-hoc/connectTo';

function getStackResult({ id, applicationId, timeConfig, productArea }) {
  switch (productArea) {
    case 'application':
      return getStackForApplication({ id, timeConfig });
    case 'service':
      return getStackForService({ id, applicationId, timeConfig });
    default:
      return getStack({ id, timeConfig });
  }
}

export default connectTo(
  ({ id, applicationId, timeConfig, productArea }) => ({
    stackResult: getStackResult({ id, applicationId, timeConfig, productArea })
  }),
  function Stack({ stackResult, activeTabIndex, onTabSelect }) {
    const isLoading = stackResult.progress && stackResult.progress.loading;

    if (stackResult.errors.length > 0) {
      return <div>Error: {stackResult.errors[0]}</div>;
    }

    return (
      <StackPresenter
        stack={stackResult.data}
        activeTabIndex={activeTabIndex}
        onTabSelect={onTabSelect}
        isLoading={isLoading}
      />
    );
  }
);
