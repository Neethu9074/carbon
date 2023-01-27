/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { ApplicationAlertConfig } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/IncludeInternalOrSyntheticCallsSwitch/ReadOnlyIncludeInternalOrSyntheticCallsSwitch.mless';

interface Props {
  alertConfig: ApplicationAlertConfig;
}

export default function ReadOnlyIncludeInternalOrSyntheticCallsSwitch({ alertConfig }: Props) {
  const { includeInternal, includeSynthetic } = alertConfig;
  if (!includeInternal && !includeSynthetic) {
    return null;
  }
  return (
    <div className={locals.wrapper}>
      <HorizontalFlexWrapper>
        {includeInternal &&
          !includeSynthetic &&
          t('in-alerting:smartAlerts.applications.advanced.includeInternalOrSyntheticCallsInfo.includeOnlyInternal')}
        {includeInternal &&
          includeSynthetic &&
          t(
            'in-alerting:smartAlerts.applications.advanced.includeInternalOrSyntheticCallsInfo.includeInternalAndSynthetic'
          )}
        {!includeInternal &&
          includeSynthetic &&
          t('in-alerting:smartAlerts.applications.advanced.includeInternalOrSyntheticCallsInfo.includeOnlySynthetic')}
      </HorizontalFlexWrapper>
    </div>
  );
}
