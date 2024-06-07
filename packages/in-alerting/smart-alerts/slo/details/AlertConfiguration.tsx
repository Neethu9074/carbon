/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ServiceLevelsAlertConfigWithMetadata } from '@instana/types';

import TimeThresholdDescription from 'in-alerting/smart-alerts/components/dialog/TimeThresholdDescription';
import CoolDownPeriodDescription from 'in-alerting/smart-alerts/slo/details/CoolDownPeriodDescription';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import CustomPayloadCard from 'in-alerting/smart-alerts/components/details/CustomPayloadCard';
import AlertThresholdInfos from 'in-alerting/smart-alerts/slo/components/AlertThresholdInfos';
import SelectedSloList from 'in-alerting/smart-alerts/slo/components/SelectedSloList';
import AlertChannelsViewer from 'in-alerting/components/AlertChannelsViewer';
import AlertPropertyInfos from 'in-alerting/components/AlertPropertyInfos';
import AlertDetailsCard from 'in-alerting/components/AlertDetailsCard';
import ListTitle from 'in-components/lists/Title';
import { t } from 'in-i18n';

interface AlertConfigurationProps {
  alertConfig: ServiceLevelsAlertConfigWithMetadata;
}

export default function AlertConfiguration({ alertConfig }: AlertConfigurationProps) {
  const { rule, threshold, timeThreshold, alertChannelIds, customPayloadFields } = alertConfig;

  return (
    <AlertDetailsCard>
      <ListTitle>{t('in-alerting:smartAlerts.slo.details.alertConfigurationTitle')} </ListTitle>
      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.details.header')}
        useMaxAvailableHeight={false}
        openByDefault
        darkFrame
      >
        <AlertThresholdInfos threshold={threshold} rule={rule} />
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.slo.details.sloHeader')}
        useMaxAvailableHeight={false}
        openByDefault
        darkFrame
      >
        <SelectedSloList sloAlertConfig={alertConfig} />
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.slo.details.timeThresholdHeader')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <TimeThresholdDescription timeThreshold={{ ...timeThreshold, type: 'violationsInSequence' }} />
        <CoolDownPeriodDescription coolDownPeriod={timeThreshold.expiry} />
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.slo.details.alertChannelsHeader')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <AlertChannelsViewer alertChannelIds={alertChannelIds} />
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.slo.details.alertPropertiesHeader')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <AlertPropertyInfos alertConfig={alertConfig} disableTrigger={false} />
      </ExpandableLightCard>

      <CustomPayloadCard
        customPayloadFields={customPayloadFields}
        TagBasedPayloadConfigurator={() => <></>}
        openByDefault
      />
    </AlertDetailsCard>
  );
}
