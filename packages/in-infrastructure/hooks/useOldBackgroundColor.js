/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import createSideEffectHook from 'in-hooks/createSideEffectHook';

export default createSideEffectHook(
  args => args.length > 0,
  isLegacy => {
    if (isLegacy) {
      document.body.style.background = '#eef2f4';
    } else {
      document.body.style.background = null;
    }
  }
);
