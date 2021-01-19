/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import withSideEffect from 'react-side-effect';

function reduceProps(propsList) {
  return propsList.length;
}

function applySideEffect(numberOfLegacyViews) {
  if (numberOfLegacyViews > 0) {
    document.body.style.background = '#eef2f4';
  } else {
    document.body.style.background = null;
  }
}

export default withSideEffect(reduceProps, applySideEffect)(() => null);
