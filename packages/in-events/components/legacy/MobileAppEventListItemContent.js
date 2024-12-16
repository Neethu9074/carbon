/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DescriptionItem } from '@instana/components';

import MobileAppAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/mobileApp/chart/MobileAppAlertingChartWithErrorMessage';
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/mobileApp/components/AlertQueryBuilder.ts';
import MobileAppScopePath from 'in-alerting/smart-alerts/mobileApp/components/MobileAppScopePath';
import { getSmartAlertAnalyzeTimeConfig } from 'in-events/components/EventContent/analyzeUtils';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig.ts';
import AnalyzeMobileAppEventButton from 'in-events/components/AnalyzeMobileAppEventButton';
import MobileAppAlertConfigButton from 'in-events/components/MobileAppAlertConfigButton';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import useMobileAppEventAlertConfig from 'in-events/hooks/useMobileAppEventAlertConfig';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { alertingEventDetailsChartTimeframe } from 'in-alerting/components/constants';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import useMobileAppEventEntity from 'in-events/hooks/useMobileAppEventEntity';
import { getChartTimeConfigByEvent } from 'in-events/timeframe';
import { t } from 'in-i18n';

import locals from './EventListItemContent.mless';

export default function MobileAppEventListItemContent({ event, justChart = false }) {
  const eventEntity = useMobileAppEventEntity(event);
  const alertConfig = useMobileAppEventAlertConfig(event);

  if (!eventEntity || !alertConfig) {
    return null;
  }

  const {
    tagFilterExpression,
    rule,
    rule: { metricName }
  } = alertConfig;
  const alertType = rule.alertType;

  const blueprintConfig = getBlueprintConfig(alertType);
  const beaconType = blueprintConfig.getBeaconType(metricName);
  const AlertQueryBuilder = getQueryBuilderForBeaconType(beaconType).QueryBuilder;
  const timeConfig = {
    ...getChartTimeConfigByEvent(event),
    windowSize: alertingEventDetailsChartTimeframe
  };

  const chartViewConfig = createDefaultChartConfig(timeConfig);

  const tagFilterFormModel = fromBackendModel(tagFilterExpression);
  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');

  return (
    <>
      {!justChart && (
        <>
          <ProblemDescription fixSuggestion={fixSuggestion} />
          <DescriptionButtons>
            <MobileAppAlertConfigButton alertConfig={alertConfig} />
            <AnalyzeMobileAppEventButton
              alertConfig={alertConfig}
              mobileAppName={eventEntity.mobileAppName}
              timeConfig={getSmartAlertAnalyzeTimeConfig(event, alertConfig)}
            />
          </DescriptionButtons>
        </>
      )}
      <div className={locals.sectionWrapper}>
        <MobileAppAlertingChartWithErrorMessage
          alertConfigWithFormModel={{
            ...alertConfig,
            tagFilterExpression: tagFilterFormModel
          }}
          viewConfig={chartViewConfig}
          blueprintConfig={blueprintConfig}
        />
      </div>
      <div className={locals.sectionWrapper}>
        <DescriptionItem inComponents className={locals.title} title={t('in-events:titleScope')}>
          <div className={locals.scopeContentWrapper}>
            <ScopeConfigPresenter
              tagFilterFormModel={tagFilterFormModel}
              queryBuilder={<AlertQueryBuilder value={tagFilterFormModel} readOnly />}
              scopePath={<MobileAppScopePath {...eventEntity} />}
            />
          </div>
        </DescriptionItem>
      </div>
    </>
  );
}
