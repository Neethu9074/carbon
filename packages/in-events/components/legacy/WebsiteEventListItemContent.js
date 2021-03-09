/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import WebsitesAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/websites/alerting/chart/WebsitesAlertingChartWithErrorMessage';
import AlertQueryBuilder from 'in-alerting/smart-alerts/websites/alerting/components/AlertQueryBuilder';
import WebsiteScopePath from 'in-alerting/smart-alerts/websites/alerting/components/WebsiteScopePath';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/alerting/data/blueprintConfig';
import { getChartTimeConfigByEvent, getSmartAlertAnalyzeTimeframe } from 'in-events/timeframe';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import AnalyzeWebsiteEventButton from 'in-events/components/AnalyzeWebsiteEventButton';
import { alertingEventDetailsChartTimeframe } from 'in-alerting/components/constants';
import WebsiteAlertConfigButton from 'in-events/components/WebsiteAlertConfigButton';
import useWebsiteEventAlertConfig from 'in-events/hooks/useWebsiteEventAlertConfig';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import useWebsiteEventEntity from 'in-events/hooks/useWebsiteEventEntity';
import { DescriptionItem } from 'in-components/DescriptionList';
import { t } from 'in-i18n';

import locals from './WebsiteEventListItemContent.mless';

export default function WebsiteEventListItemContent({ event }) {
  const eventEntity = useWebsiteEventEntity(event);
  const alertConfig = useWebsiteEventAlertConfig(event);

  if (!eventEntity || !alertConfig) {
    return null;
  }

  const { tagFilterExpression, rule, convertedTagFilterExpression } = alertConfig;
  const alertType = rule.alertType;

  const blueprintConfig = getBlueprintConfig(alertType);
  const timeConfig = {
    ...getChartTimeConfigByEvent({ event }),
    windowSize: alertingEventDetailsChartTimeframe
  };
  const analyzeTimeConfig = getSmartAlertAnalyzeTimeframe(event, alertConfig);
  const chartViewConfig = createDefaultChartConfig(timeConfig);

  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  return (
    <>
      <ProblemDescription event={event} />
      <DescriptionButtons>
        <WebsiteAlertConfigButton alertConfig={alertConfig} />
        <AnalyzeWebsiteEventButton
          alertConfig={alertConfig}
          websiteName={eventEntity.websiteName}
          timeConfig={analyzeTimeConfig}
        />
      </DescriptionButtons>
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
        <DescriptionItem className={locals.title} title={t('in-events:titleScope')}>
          <div className={locals.scopeContentWrapper}>
            <ScopeConfigPresenter
              tagFilterFormModel={tagFilterFormModel}
              queryBuilder={<AlertQueryBuilder value={tagFilterFormModel} readOnly />}
              convertedTagFilterExpression={convertedTagFilterExpression}
              scopePath={<WebsiteScopePath {...eventEntity} />}
            />
          </div>
        </DescriptionItem>
      </div>
    </>
  );
}
