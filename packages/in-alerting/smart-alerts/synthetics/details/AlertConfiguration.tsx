/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo } from 'react';

import { SyntheticAlertConfigWithMetadata } from '@instana/types';
import { Message } from '@instana/components';

import { replaceTitlePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/synthetics/dialog/advanced/titlePlaceholders';
import useTagBasedPayloadConfigurator from 'in-alerting/smart-alerts/synthetics/hooks/useTagBasedPayloadConfigurator';
import { createBoundedAlertQueryBuilder } from 'in-alerting/smart-alerts/synthetics/components/AlertQueryBuilder';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import { AlertThresholdInfos } from 'in-alerting/smart-alerts/synthetics/details/AlertThresholdInfos';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import CustomPayloadCard from 'in-alerting/smart-alerts/components/details/CustomPayloadCard';
import AlertTestsViewer from 'in-alerting/smart-alerts/synthetics/details/AlertTestsViewer';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import AlertChannelsViewer from 'in-alerting/components/AlertChannelsViewer';
import AlertPropertyInfos from 'in-alerting/components/AlertPropertyInfos';
import { formatDurationAccurately } from 'in-services/formatters/date';
import AlertDetailsCard from 'in-alerting/components/AlertDetailsCard';
import ListTitle from 'in-components/lists/Title';
import { days } from 'in-services/time';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/shared-styles/AlertConfiguration.mless';

export interface AlertThresholdInfosProps {
  thresholdType: string;
  failureThreshold: string;
  aggregation: string;
  gracePeriod?: string;
}

/**
 * Timeframe used for the tag-suggestions in QB2.
 */
export const tagSuggestionTimeConfig = {
  windowSize: days.toMillis(1),
  autoRefresh: true
};

export default function AlertConfiguration({ alertConfig }: { alertConfig: SyntheticAlertConfigWithMetadata }) {
  const { syntheticTestIds, alertChannelIds, gracePeriod, timeThreshold, tagFilterExpression, customPayloadFields } =
    alertConfig;
  const { QueryBuilder: AlertQueryBuilder } = useMemo(
    () => createBoundedAlertQueryBuilder(tagSuggestionTimeConfig),
    []
  );

  const tagFilterFormModel = fromBackendModel(tagFilterExpression);
  const thresholdInfos: AlertThresholdInfosProps = {
    thresholdType: t('in-alerting:smartAlerts.synthetics.details.noOfFailure'),
    failureThreshold: t('in-alerting:smartAlerts.synthetics.details.failureThreshold', {
      failureCount: timeThreshold.violationsCount
    }),
    aggregation: t('in-alerting:smartAlerts.synthetics.details.scope.perLocation.shortText'),
    gracePeriod: t('in-alerting:smartAlerts.synthetics.details.gracePeriodValue', {
      gracePeriodValue: formatDurationAccurately(gracePeriod, 60000, false)
    })
  };
  const TagBasedPayloadConfigurator = useTagBasedPayloadConfigurator(tagSuggestionTimeConfig);
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
          <AlertTestsViewer alertTestIds={syntheticTestIds} setTitle={false} />
        </div>
      </ExpandableLightCard>
      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.synthetics.details.alertConfigurationTitleScope')}
        useMaxAvailableHeight={false}
        openByDefault
        bodyWithoutPadding={tagFilterFormModel.length > 0}
        darkFrame
      >
        {tagFilterFormModel.length > 0 ? (
          <div className={locals.paddingBodyWrapper}>
            <ScopeConfigPresenter
              tagFilterFormModel={tagFilterFormModel}
              //@ts-expect-error type error for querybuilder
              queryBuilder={<AlertQueryBuilder value={tagFilterFormModel} readOnly />}
            />
          </div>
        ) : (
          <Message small title={t('in-alerting:smartAlerts.synthetics.details.noScopeConfigured')} />
        )}
      </ExpandableLightCard>
      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.synthetics.details.threshold')}
        useMaxAvailableHeight={false}
        openByDefault
        darkFrame
      >
        <AlertThresholdInfos thresholdInfos={thresholdInfos} />
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
        <AlertPropertyInfos
          alertConfig={alertConfig}
          renderCustomTitle={() => replaceTitlePlaceholdersWithMarkup(alertConfig.name)}
          disableTrigger
        />
      </ExpandableLightCard>
      <GlobalCustomPayloadCard context="SYNTHETIC" />
      <CustomPayloadCard
        customPayloadFields={customPayloadFields}
        TagBasedPayloadConfigurator={TagBasedPayloadConfigurator}
        openByDefault
      />
    </AlertDetailsCard>
  );
}
