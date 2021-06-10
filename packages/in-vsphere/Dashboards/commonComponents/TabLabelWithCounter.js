/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import TabLabelWithCounterPresenter from 'in-components/LocationAwareTabView/tabs/TabLabelWithCounterPresenter';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    countersResult: props.getCounters()
  }),
  TabLabelWithCounterPresenter
);
