/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import WebsitesAlertingChartWithErrorMessage from 'in-websites/alerting/chart/WebsitesAlertingChartWithErrorMessage';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { getChartTimeConfigByEvent, getSmartAlertAnalyzeTimeframe } from 'in-events/timeframe';
import ScopeConfigPresenter from 'in-new-components/Alerting/components/ScopeConfigPresenter';
import { createDefaultChartConfig } from 'in-new-components/Alerting/Chart/chartViewConfig';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import { alertingEventDetailsChartTimeframe } from 'in-new-components/Alerting/constants';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import AnalyzeWebsiteEventButton from 'in-events/components/AnalyzeWebsiteEventButton';
import WebsiteAlertConfigButton from 'in-events/components/WebsiteAlertConfigButton';
import useWebsiteEventAlertConfig from 'in-events/hooks/useWebsiteEventAlertConfig';
import AlertQueryBuilder from 'in-websites/alerting/components/AlertQueryBuilder';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import WebsiteScopePath from 'in-websites/alerting/components/WebsiteScopePath';
import { getBlueprintConfig } from 'in-websites/alerting/data/blueprintConfig';
import useWebsiteEventEntity from 'in-events/hooks/useWebsiteEventEntity';
import { DescriptionItem } from 'in-components/DescriptionList';

import locals from './WebsiteEventListItemContent.mless';

export default function WebsiteEventListItemContent({ event }) {
  const eventEntity = useWebsiteEventEntity(event);
  const alertConfig = useWebsiteEventAlertConfig(event);

  if (!eventEntity || !alertConfig) {
    return null;
  }

  const { tagFilters, tagFilterExpression, rule, convertedTagFilterExpression } = alertConfig;
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
              tagFilterList={
                <TagFilterListPresenter
                  tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                    tagFilters: [...blueprintConfig.getEntityTagFilters(alertConfig), ...tagFilters],
                    websiteLabel: eventEntity.websiteName
                  })}
                  disabled
                />
              }
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
