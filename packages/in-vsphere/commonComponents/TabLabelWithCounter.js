import React from 'react';

import connectTo from 'in-hoc/connectTo';

import TabLabelWithCounterPresenter from 'in-new-components/LocationAwareTabView/tabs/TabLabelWithCounterPresenter';

export default connectTo(
  props => ({
    countersResult: props.getCounters()
  }),
  function TabLabelWithCounter({ label, resultPropName, countersResult }) {
    return (
      <TabLabelWithCounterPresenter label={label} resultPropName={resultPropName} countersResult={countersResult} />
    );
  }
);
