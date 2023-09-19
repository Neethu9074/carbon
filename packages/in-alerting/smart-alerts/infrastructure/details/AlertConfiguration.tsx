/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import AlertDetailsCard from 'in-alerting/components/AlertDetailsCard';
import { InfraAlertConfigWithMetadata } from 'in-types';
import ListTitle from 'in-components/lists/Title';
import { days } from 'in-services/time';
import { t } from 'in-i18n';

/**
 * Timeframe used for the tag-suggestions in QB2.
 */
export const tagSuggestionTimeConfig = {
  windowSize: days.toMillis(1),
  autoRefresh: true
};

//@ts-expect-error To be removed after the alertConfig is used and  logic is implemented
export default function AlertConfiguration({ alertConfig }: { alertConfig: InfraAlertConfigWithMetadata }) {
  return (
    <AlertDetailsCard>
      <ListTitle>{t('in-alerting:smartAlerts.infrastructure.alertDetails.alertConfiguration')}</ListTitle>
      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.details.header')}
        useMaxAvailableHeight={false}
        openByDefault
        darkFrame
      >
        <></>
      </ExpandableLightCard>
    </AlertDetailsCard>
  );
}
