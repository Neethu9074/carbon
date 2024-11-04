/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import TabLabelWithCounterPresenter from 'in-components/LocationAwareTabView/tabs/TabLabelWithCounterPresenter';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    countersResult: props.getCounters()
  }),
  TabLabelWithCounterPresenter
);
