import React from 'react';

import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import AnalyzeApplicationEventButton from 'in-events/components/AnalyzeApplicationEventButton';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-applications/tags';
import ApplicationAlertConfigButton from 'in-events/components/ApplicationAlertConfigButton';
import { getAlertConfigByIdAndTimestamp } from 'in-applications/api/applicationAlertConfig';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import { alertingEventDetailsChartTimeframe } from 'in-new-components/Alerting/constants';
import AlertQueryBuilder from 'in-applications/alerting/components/AlertQueryBuilder';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import WithQB1orQB2 from 'in-new-components/Alerting/components/WithQB1orQB2';
import AlertingChart from 'in-new-components/Alerting/Chart/AlertingChart';
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

    const metadata = event.get('metadata');
    const applicationName = metadata.get('entityLabel');
    const tagFilters = alertConfig.tagFilters;
    const alertType = alertConfig.rule.alertType;

    const blueprintConfig = getBlueprintConfig(alertType);
    const timeConfig = getChartTimeConfigByEvent({ event });
    timeConfig.windowSize = alertingEventDetailsChartTimeframe;

    const chartViewConfig = { timeConfig };
    return (
      <>
        <ProblemDescription event={event} />
        <DescriptionButtons>
          <ApplicationAlertConfigButton alertConfig={alertConfig} />
          <AnalyzeApplicationEventButton event={event} alertConfig={alertConfig} />
        </DescriptionButtons>
        <div className={locals.sectionWrapper}>
          <AlertingChart alertConfig={alertConfig} viewConfig={chartViewConfig} blueprintConfig={blueprintConfig} />
        </div>
        <div className={locals.sectionWrapper}>
          <DescriptionItem title="Domain">
            <div className={locals.domainContentWrapper}>
              <WithQB1orQB2
                onUsesQB1={() => (
                  <TagFilterListPresenter
                    tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                      applicationName,
                      tagFilters: [blueprintConfig.getEntityTagFilter(alertConfig), ...tagFilters]
                    })}
                    disabled
                  />
                )}
                onUsesQB2={() => (
                  <AlertQueryBuilder value={fromBackendModel(alertConfig.tagFilterExpression)} readOnly />
                )}
                shouldFallbackToQB2={isQB2Config => isQB2Config(alertConfig.convertedTagFilterExpression)}
              />
            </div>
          </DescriptionItem>
        </div>
      </>
    );
  }
);
