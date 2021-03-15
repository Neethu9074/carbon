/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import withSideEffect from 'react-side-effect';

import { set } from 'in-new-components/overlays/overlayStore';

function reduce(propsList) {
  return propsList;
}

function replace(reduced) {
  set(reduced);
}

export default withSideEffect(reduce, replace)(() => null);
