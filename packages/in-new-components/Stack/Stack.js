import React from 'react';

import getStack from 'in-new-components/Stack/subscriptions/getStack';
import StackPresenter from 'in-new-components/Stack/StackPresenter';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ id, productArea, timeConfig }) => ({ stackResult: getStack({ id, productArea, timeConfig }) }),
  function Stack({ stackResult }) {
    if (!stackResult.data) {
      return null;
    }

    return <StackPresenter stack={stackResult.data} />;
  }
);
