/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/advanced/IncludeInternalOrSyntheticCallsSwitch/ReadOnlyIncludeInternalOrSyntheticCallsSwitch.mless';

export default function ReadOnlyIncludeInternalOrSyntheticCallsSwitch({ alertConfig }) {
  const { includeInternal, includeSynthetic } = alertConfig;
  if (!includeInternal && !includeSynthetic) {
    return null;
  }
  return (
    <div className={locals.wrapper}>
      <HorizontalFlexWrapper>
        {includeInternal &&
          !includeSynthetic &&
          t('in-applications:alert.includeInternalOrSyntheticCallsInfo.includeOnlyInternal')}
        {includeInternal &&
          includeSynthetic &&
          t('in-applications:alert.includeInternalOrSyntheticCallsInfo.includeInternalAndSynthetic')}
        {!includeInternal &&
          includeSynthetic &&
          t('in-applications:alert.includeInternalOrSyntheticCallsInfo.includeOnlySynthetic')}
      </HorizontalFlexWrapper>
    </div>
  );
}
