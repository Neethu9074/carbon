/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import withSideEffect from 'react-side-effect';

import { set } from 'in-components/ErrorBoundary/store';

function reduceProps(propsList) {
  return propsList.length;
}

export default withSideEffect(reduceProps, set)(() => null);
