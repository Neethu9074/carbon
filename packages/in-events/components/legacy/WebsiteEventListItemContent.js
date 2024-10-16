/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionItem } from '@instana/components';

import WebsitesAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/websites/chart/WebsitesAlertingChartWithErrorMessage';
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import { getSmartAlertAnalyzeTimeConfig } from 'in-events/components/EventContent/analyzeUtils';
import WebsiteScopePath from 'in-alerting/smart-alerts/websites/components/WebsiteScopePath';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import AnalyzeWebsiteEventButton from 'in-events/components/AnalyzeWebsiteEventButton';
import { alertingEventDetailsChartTimeframe } from 'in-alerting/components/constants';
import WebsiteAlertConfigButton from 'in-events/components/WebsiteAlertConfigButton';
import useWebsiteEventAlertConfig from 'in-events/hooks/useWebsiteEventAlertConfig';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import useWebsiteEventEntity from 'in-events/hooks/useWebsiteEventEntity';
import { getChartTimeConfigByEvent } from 'in-events/timeframe';
import { t } from 'in-i18n';

import locals from './EventListItemContent.mless';

export default function WebsiteEventListItemContent({ event, justChart = false }) {
  const eventEntity = useWebsiteEventEntity(event);
  const alertConfig = useWebsiteEventAlertConfig(event);

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
            <WebsiteAlertConfigButton alertConfig={alertConfig} />
            <AnalyzeWebsiteEventButton
              alertConfig={alertConfig}
              websiteName={eventEntity.websiteName}
              timeConfig={getSmartAlertAnalyzeTimeConfig(event, alertConfig)}
            />
          </DescriptionButtons>
        </>
      )}
      <div className={locals.sectionWrapper}>
        <WebsitesAlertingChartWithErrorMessage
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
              scopePath={<WebsiteScopePath {...eventEntity} />}
            />
          </div>
        </DescriptionItem>
      </div>
    </>
  );
}
