/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { forwardRef } from 'react';

import locals from './UnspecifiedExtractionRule.mless';

const UnspecifiedExtractionRule = forwardRef(function UnspecifiedExtractionRule(props, ref) {
  return (
    <div className={locals.unspecifiedExtractionRule} ref={ref}>
      <span className={locals.query}>Unspecified</span>
    </div>
  );
});
export default UnspecifiedExtractionRule;
