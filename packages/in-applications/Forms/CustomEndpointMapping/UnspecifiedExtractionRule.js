/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { forwardRef } from 'react';
import { t } from 'in-i18n';

import locals from './UnspecifiedExtractionRule.mless';

const UnspecifiedExtractionRule = forwardRef(function UnspecifiedExtractionRule(props, ref) {
  return (
    <div className={locals.unspecifiedExtractionRule} ref={ref}>
      <span className={locals.query}>{t('in-applications:forms.unspecified')}</span>
    </div>
  );
});
export default UnspecifiedExtractionRule;
