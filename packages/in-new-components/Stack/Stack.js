import React from 'react';

import {
  getStackForInfrastructure,
  getStackForApplication,
  getStackForService
} from 'in-new-components/Stack/subscriptions/getStack';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import StackPresenter from 'in-new-components/Stack/StackPresenter';
import connectTo from 'in-hoc/connectTo';

function getStackResult({ id, applicationId, timeConfig, productArea }) {
  switch (productArea) {
    case 'application':
      return getStackForApplication({ id, timeConfig });
    case 'service':
      return getStackForService({ id, applicationId, timeConfig });
    default:
      return getStackForInfrastructure({ id, timeConfig });
  }
}

export default connectTo(
  ({ id, applicationId, timeConfig, productArea }) => ({
    stackResult: getStackResult({ id, applicationId, timeConfig, productArea })
  }),
  function Stack({ applicationId, stackResult, productArea }) {
    const isLoading = stackResult.progress && stackResult.progress.loading;

    if (stackResult.errors.length > 0) {
      return <ErroneousResultPresenter errors={stackResult.errors} />;
    }

    return (
      <StackPresenter
        applicationId={applicationId}
        stack={stackResult.data}
        isLoading={isLoading}
        productArea={productArea}
      />
    );
  }
);
