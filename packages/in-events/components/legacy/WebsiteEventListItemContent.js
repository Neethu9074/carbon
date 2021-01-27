/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { getEnhancedTagFilters } from 'in-new-components/Alerting/utils/tagfilterEnrichmentUtil';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { getChartTimeConfigByEvent, getSmartAlertAnalyzeTimeframe } from 'in-events/timeframe';
import { createDefaultChartConfig } from 'in-new-components/Alerting/Chart/chartViewConfig';
import { alertingEventDetailsChartTimeframe } from 'in-new-components/Alerting/constants';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import AnalyzeWebsiteEventButton from 'in-events/components/AnalyzeWebsiteEventButton';
import WebsiteAlertConfigButton from 'in-events/components/WebsiteAlertConfigButton';
import useWebsiteEventAlertConfig from 'in-events/hooks/useWebsiteEventAlertConfig';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import { getBlueprintConfig } from 'in-websites/alerting/data/blueprintConfig';
import AlertingChart from 'in-new-components/Alerting/Chart/AlertingChart';
import useWebsiteEventEntity from 'in-events/hooks/useWebsiteEventEntity';
import { DescriptionItem } from 'in-components/DescriptionList';

import locals from './WebsiteEventListItemContent.mless';

export default function WebsiteEventListItemContent({ event }) {
  const eventEntity = useWebsiteEventEntity(event);
  const alertConfig = useWebsiteEventAlertConfig(event);

  if (!eventEntity || !alertConfig) {
    return null;
  }

  const tagFilters = alertConfig.tagFilters;
  const blueprintConfig = getBlueprintConfig(alertConfig.rule.alertType);
  const timeConfig = {
    ...getChartTimeConfigByEvent({ event }),
    windowSize: alertingEventDetailsChartTimeframe
  };
  const analyzeTimeConfig = getSmartAlertAnalyzeTimeframe(event, alertConfig);
  const chartViewConfig = createDefaultChartConfig(timeConfig);

  // TODO enrichedTagFilterFormModel is always undefined here at the moment. In Website SmartAlerts, we don't
  //      fully support QB2 yet.
  const { numeratorFilter, enrichedTagFilters, enrichedTagFilterFormModel } = getEnhancedTagFilters(
    alertConfig,
    blueprintConfig
  );

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
        <AlertingChart
          alertConfigWithFormModel={{
            ...alertConfig,
            tagFilterExpression: enrichedTagFilterFormModel
          }}
          viewConfig={chartViewConfig}
          blueprintConfig={blueprintConfig}
          numeratorFilter={numeratorFilter}
          enrichedTagFilters={enrichedTagFilters}
          enrichedTagFilterExpression={toBackendQueryModel(enrichedTagFilterFormModel)}
          isQB1only
        />
      </div>
      <div className={locals.sectionWrapper}>
        <DescriptionItem className={locals.title} title="Scope">
          <div className={locals.scopeContentWrapper}>
            <TagFilterListPresenter
              tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                tagFilters: [...blueprintConfig.getEntityTagFilters(alertConfig), ...tagFilters],
                websiteLabel: eventEntity.websiteName
              })}
              disabled
            />
          </div>
        </DescriptionItem>
      </div>
    </>
  );
}
