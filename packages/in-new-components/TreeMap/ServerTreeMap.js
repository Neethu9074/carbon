/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import ResultAwareTreeMap from 'in-new-components/TreeMap/ResultAwareTreeMap';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ getTreeMap$ }) => ({
    result: getTreeMap$()
  }),
  ResultAwareTreeMap
);
