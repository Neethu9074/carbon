/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';

import Rule from 'in-applications/Forms/components/Rule';
import { t } from 'in-i18n';

const UnspecifiedExtractionRule = forwardRef(function UnspecifiedExtractionRule(props, ref) {
  return (
    <Rule
      name={t('in-applications:forms.unspecified')}
      expandableContent={false}
      isInstanaDefaultRule
      onToggleEnable
      ref={ref}
    />
  );
});
export default UnspecifiedExtractionRule;
