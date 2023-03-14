/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ChangeSummary, SyntheticAlertConfigWithMetadata } from '@instana/types';

//@ts-expect-error needs migration
import AlertTestsViewer from 'in-alerting/smart-alerts/synthetics/details/AlertTestsViewer';
//@ts-expect-error needs migration
import AlertChannelsViewer from 'in-alerting/components/AlertChannelsViewer';
//@ts-expect-error needs migration
import AlertPropertyInfos from 'in-alerting/components/AlertPropertyInfos';
//@ts-expect-error needs migration
import AlertDetailsCard from 'in-alerting/components/AlertDetailsCard';
import { AlertThresholdInfos } from 'in-alerting/smart-alerts/synthetics/details/AlertThresholdInfos';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
//@ts-expect-error needs migration
import ListTitle from 'in-components/lists/Title';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/shared-styles/AlertConfiguration.mless';

export interface AlertThresholdInfosProps {
  thresholdType: string;
  failureThreshold: string;
  aggregation: string;
}

export default function AlertConfiguration({
  alertConfig
}: {
  alertConfig: SyntheticAlertConfigWithMetadata & ChangeSummary;
}) {
  const { syntheticTestIds, alertChannelIds, timeThreshold } = alertConfig;

  const rule: AlertThresholdInfosProps = {
    thresholdType: 'Number of failure',
    failureThreshold: t('in-alerting:smartAlerts.synthetics.details.failureThreshold', {
      failureCount: timeThreshold.violationsCount
    }),
    aggregation: t('in-alerting:smartAlerts.synthetics.details.scope.perLocation.shortText')
  };
  return (
    <AlertDetailsCard>
      <ListTitle>
        {t('in-alerting:smartAlerts.synthetics.details.alertConfigurationListTitleAlertConfiguration')}
      </ListTitle>
      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.synthetics.details.alertConfigurationTitleAlertTests')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <div className={locals.alertChannelsWrapper}>
          <AlertTestsViewer alertTestIds={syntheticTestIds} />
        </div>
      </ExpandableLightCard>
      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.synthetics.details.threshold')}
        useMaxAvailableHeight={false}
        openByDefault
        darkFrame
      >
        <AlertThresholdInfos rule={rule} />
      </ExpandableLightCard>
      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.synthetics.details.alertConfigurationTitleAlertChannels')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <div className={locals.alertChannelsWrapper}>
          <AlertChannelsViewer alertChannelIds={alertChannelIds} />
        </div>
      </ExpandableLightCard>
      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.synthetics.details.alertConfigurationTitleAlertProperties')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <AlertPropertyInfos alertConfig={alertConfig} disableTrigger />
      </ExpandableLightCard>
    </AlertDetailsCard>
  );
}
