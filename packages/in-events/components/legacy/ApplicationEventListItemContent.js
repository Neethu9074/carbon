import React from 'react';

import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import AnalyzeApplicationEventButton from 'in-events/components/AnalyzeApplicationEventButton';
import getStatusCodeChartConfig from 'in-applications/alerting/data/chartConfigForStatusCode';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-applications/tags';
import ApplicationAlertConfigButton from 'in-events/components/ApplicationAlertConfigButton';
import { getAlertConfigByIdAndTimestamp } from 'in-applications/api/applicationAlertConfig';
import getErrorRateChartConfig from 'in-applications/alerting/data/chartConfigForErrorRate';
import { alertingEventDetailsChartTimeframe } from 'in-new-components/Alerting/constants';
import getSlownessChartConfig from 'in-applications/alerting/data/chartConfigForSlowness';
import { getApplicationIdTagFilter } from 'in-applications/alerting/tagFilterUtils';
import AlertTypeSwitch from 'in-applications/alerting/components/AlertTypeSwitch';
import getLogsChartConfig from 'in-applications/alerting/data/chartConfigForLogs';
import AlertingBarChart from 'in-new-components/Alerting/Chart/AlertingBarChart';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
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
    const sensitivity = alertConfig.threshold.deviationFactor;
    const alertType = alertConfig.rule.alertType;
    const aggregation = alertConfig.rule.aggregation;
    const threshold = alertConfig.threshold;
    const timeThreshold = alertConfig.timeThreshold;
    const granularity = alertConfig.granularity;

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
          <AlertTypeSwitch
            alertType={alertType}
            renderErrorRate={() => (
              <AlertingBarChart
                chartConfigForBlueprint={getErrorRateChartConfig({
                  applicationId: entityId,
                  boundaryScope,
                  tagFilters,
                  viewConfig: chartViewConfig,
                  granularity,
                  threshold,
                  timeThreshold
                })}
              />
            )}
            renderSlowness={() => (
              <AlertingBarChart
                chartConfigForBlueprint={getSlownessChartConfig({
                  applicationId: entityId,
                  boundaryScope,
                  sensitivity,
                  tagFilters,
                  viewConfig: chartViewConfig,
                  aggregation,
                  granularity,
                  threshold,
                  timeThreshold
                })}
              />
            )}
            renderLogs={() => (
              <AlertingBarChart
                chartConfigForBlueprint={getLogsChartConfig({
                  applicationId: entityId,
                  logMessage: alertConfig.rule.message,
                  logMessageOperator: alertConfig.rule.operator,
                  logLevel: alertConfig.rule.level,
                  viewConfig: chartViewConfig,
                  boundaryScope,
                  tagFilters,
                  granularity,
                  threshold,
                  timeThreshold
                })}
              />
            )}
            renderStatusCode={() => (
              <AlertingBarChart
                chartConfigForBlueprint={getStatusCodeChartConfig({
                  applicationId: entityId,
                  statusCodeStart: alertConfig.rule.statusCodeStart,
                  statusCodeEnd: alertConfig.rule.statusCodeEnd,
                  viewConfig: chartViewConfig,
                  boundaryScope,
                  tagFilters,
                  granularity,
                  threshold,
                  timeThreshold
                })}
              />
            )}
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
