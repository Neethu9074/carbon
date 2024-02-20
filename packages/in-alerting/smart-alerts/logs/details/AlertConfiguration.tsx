/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack } from '@instana/components';

import { getQueryBuilder, getGroupByQueryBuilder } from 'in-alerting/smart-alerts/logs/components/AlertQueryBuilder';
import TimeThresholdDescription from 'in-alerting/smart-alerts/components/dialog/TimeThresholdDescription';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import { AlertThresholdInfos } from 'in-alerting/smart-alerts/logs/details/AlertThresholdInfos';
import CustomPayloadCard from 'in-alerting/smart-alerts/components/details/CustomPayloadCard';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { AlertGrouping } from 'in-alerting/smart-alerts/logs/details/AlertGrouping';
import { StaticThresholdConfig, TagCatalog, ThresholdConfigUnion } from 'in-types';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import AlertChannelsViewer from 'in-alerting/components/AlertChannelsViewer';
import AlertPropertyInfos from 'in-alerting/components/AlertPropertyInfos';
import AlertDetailsCard from 'in-alerting/components/AlertDetailsCard';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import useTagCatalog from 'in-logging/hooks/useTagCatalog';
import { LogAlertConfigWithMetadata } from 'in-types';
import ListTitle from 'in-components/lists/Title';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/shared-styles/AlertConfiguration.mless';

export default function AlertConfiguration({ alertConfig }: { alertConfig: LogAlertConfigWithMetadata }) {
  const { timeThreshold, threshold, granularity, groupBy, customPayloadFields, tagFilterExpression, alertChannelIds } =
    alertConfig;
  const tagCatalog = useTagCatalog();
  const AlertQueryBuilder = getQueryBuilder(tagCatalog as TagCatalog).QueryBuilder;

  const AlertGroupByQueryBuilder = getGroupByQueryBuilder(tagCatalog as TagCatalog).QueryBuilder;
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);
  return (
    <AlertDetailsCard>
      <ListTitle>{t('in-alerting:smartAlerts.logs.alertDetails.alertConfiguration')}</ListTitle>
      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.details.header')}
        useMaxAvailableHeight={false}
        openByDefault
        darkFrame
      >
        <AlertThresholdInfos
          threshold={threshold as ThresholdConfigUnion & StaticThresholdConfig}
          metricLabel={t('in-alerting:smartAlerts.logs.alertDetails.metricName')}
        />
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.logs.alertDetails.alertConfigurationTitleScope')}
        useMaxAvailableHeight={false}
        openByDefault
        bodyWithoutPadding
        darkFrame
      >
        <div className={locals.paddingBodyWrapper}>
          <Stack gap="xsmall">
            <ScopeConfigPresenter
              tagFilterFormModel={tagFilterFormModel}
              queryBuilder={
                (<AlertQueryBuilder value={tagFilterFormModel} readOnly />) as unknown as QueryBuilderComponent
              }
              scopePath={<></>}
            />

            <AlertGrouping AlertQueryBuilder={AlertGroupByQueryBuilder} groupBy={groupBy ?? []} />
          </Stack>
        </div>
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.logs.alertDetails.alertConfigurationTitleTimeThreshold')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <TimeThresholdDescription timeThreshold={timeThreshold} granularity={granularity} />
      </ExpandableLightCard>
      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.logs.alertDetails.alertConfigurationTitleAlertChannels')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <div className={locals.alertChannelsWrapper}>
          <AlertChannelsViewer alertChannelIds={alertChannelIds ?? []} />
        </div>
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.logs.alertDetails.alertConfigurationTitleAlertProperties')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <AlertPropertyInfos alertConfig={alertConfig} disableTrigger />
      </ExpandableLightCard>

      <GlobalCustomPayloadCard context="ALL" />
      {/* TODO : context - ALL need to be replaced with Logging specific context once available */}
      <CustomPayloadCard
        customPayloadFields={customPayloadFields}
        TagBasedPayloadConfigurator={() => <></>}
        openByDefault
      />
    </AlertDetailsCard>
  );
}
