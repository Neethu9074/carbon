/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import AlertDetailsCard from 'in-alerting/components/AlertDetailsCard';
import { LogAlertConfigWithMetadata } from 'in-types';
import ListTitle from 'in-components/lists/Title';
import { t } from 'in-i18n';

export default function AlertConfiguration({ alertConfig }: { alertConfig: LogAlertConfigWithMetadata }) {
  const { name } = alertConfig;
  return (
    <AlertDetailsCard>
      <ListTitle>{t('in-alerting:smartAlerts.logging.alertDetails.alertConfiguration')}</ListTitle>
      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.details.header')}
        useMaxAvailableHeight={false}
        openByDefault
        darkFrame
      >
        <>{name}</>
      </ExpandableLightCard>
    </AlertDetailsCard>
  );
}
