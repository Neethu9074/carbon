import React from 'react';

import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import AnalyzeApplicationEventButton from 'in-events/components/AnalyzeApplicationEventButton';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-applications/tags';
import ApplicationAlertConfigButton from 'in-events/components/ApplicationAlertConfigButton';
import { getAlertConfigByIdAndTimestamp } from 'in-applications/api/applicationAlertConfig';
import { alertingEventDetailsChartTimeframe } from 'in-new-components/Alerting/constants';
import { getApplicationIdTagFilter } from 'in-applications/alerting/tagFilterUtils';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import AlertingBarChart from 'in-new-components/Alerting/Chart/AlertingBarChart';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import getChartConfig from 'in-applications/alerting/data/chartConfig';
import { getChartTimeConfigByEvent } from 'in-events/timeframe';
import { DescriptionItem } from 'in-components/DescriptionList';
import connectTo from 'in-hoc/connectTo';

import locals from './ApplicationEventListItemContent.mless';

export default connectTo(
  ({ event }) => {
    const observables = {};
    const configId = event.getIn(['metadata', 'eventSpecificationId']);
    const configTimestamp = event.getIn(['metadata', 'alertConfigCreated']);
    observables.alertConfig = getAlertConfigByIdAndTimestamp(configId, configTimestamp);
    return observables;
  },
  function ApplicationEventListItemContent({ event, alertConfig }) {
    if (!event || !alertConfig) {
      return null;
    }

    const entityId = event.get('entityId');
    const metadata = event.get('metadata');
    const applicationName = metadata.get('entityLabel');
    const boundaryScope = alertConfig.boundaryScope;
    const tagFilters = alertConfig.tagFilters;
    const alertType = alertConfig.rule.alertType;

    const blueprintConfig = getBlueprintConfig(alertType);
    const timeConfig = getChartTimeConfigByEvent({ event });
    timeConfig.windowSize = alertingEventDetailsChartTimeframe;

    const chartViewConfig = { timeConfig };
    return (
      <>
        <ProblemDescription event={event} />
        <ApplicationAlertConfigButton alertConfig={alertConfig} />
        <div className={locals.sectionWrapper}>
          <div className={locals.analyzeButtonWrapper}>
            <AnalyzeApplicationEventButton event={event} alertConfig={alertConfig} />
          </div>

          <AlertingBarChart
            chartConfigForBlueprint={getChartConfig({
              alertConfig,
              viewConfig: chartViewConfig,
              blueprintConfig
            })}
          />
        </div>
        <div className={locals.sectionWrapper}>
          <DescriptionItem title="Domain">
            <div className={locals.domainContentWrapper}>
              <TagFilterListPresenter
                tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                  applicationName,
                  tagFilters: [getApplicationIdTagFilter({ entityId, boundaryScope }), ...tagFilters]
                })}
                disabled
              />
            </div>
          </DescriptionItem>
        </div>
      </>
    );
  }
);
