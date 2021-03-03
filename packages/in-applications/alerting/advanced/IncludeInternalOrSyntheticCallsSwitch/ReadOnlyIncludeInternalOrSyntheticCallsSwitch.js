/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import locals from 'in-applications/alerting/advanced/IncludeInternalOrSyntheticCallsSwitch/ReadOnlyIncludeInternalOrSyntheticCallsSwitch.mless';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import { t } from 'in-i18n';

export default function ReadOnlyIncludeInternalOrSyntheticCallsSwitch({ alertConfig }) {
  const { includeInternal, includeSynthetic } = alertConfig;
  if (!includeInternal && !includeSynthetic) {
    return null;
  }
  return (
    <div className={locals.marginBottom}>
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
