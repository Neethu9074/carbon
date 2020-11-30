import React from 'react';

import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { alertingEventDetailsChartTimeframe } from 'in-new-components/Alerting/constants';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import AnalyzeWebsiteEventButton from 'in-events/components/AnalyzeWebsiteEventButton';
import WebsiteAlertConfigButton from 'in-events/components/WebsiteAlertConfigButton';
import { getAlertConfigByIdAndTimestamp } from 'in-websites/api/websiteAlertConfig';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import { getBlueprintConfig } from 'in-websites/alerting/data/blueprintConfig';
import AlertingChart from 'in-new-components/Alerting/Chart/AlertingChart';
import OpenIssueLink from 'in-events/components/legacy/OpenIssueLink';
import { getChartTimeConfigByEvent } from 'in-events/timeframe';
import { DescriptionItem } from 'in-components/DescriptionList';
import connectTo from 'in-hoc/connectTo';

import locals from './WebsiteEventListItemContent.mless';

export default connectTo(
  ({ event }) => {
    const observables = {};
    const configId = event.getIn(['metadata', 'eventSpecificationId']);
    const configTimestamp = event.getIn(['metadata', 'alertConfigCreated']);
    observables.alertConfig = getAlertConfigByIdAndTimestamp(configId, configTimestamp);
    return observables;
  },
  function WebsiteEventListItemContent({ event, alertConfig }) {
    if (!event || !alertConfig) {
      return null;
    }

    const metadata = event.get('metadata');
    const websiteLabel = metadata.get('entityLabel');
    const tagFilters = alertConfig.tagFilters;

    const timeConfig = getChartTimeConfigByEvent({ event });
    timeConfig.windowSize = alertingEventDetailsChartTimeframe;

    const chartViewConfig = {
      timeConfig
    };
    const blueprintConfig = getBlueprintConfig(alertConfig.rule.alertType);

    return (
      <>
        <ProblemDescription event={event} />
        <DescriptionButtons>
          <WebsiteAlertConfigButton alertConfig={alertConfig} />
          <OpenIssueLink event={event} />
          <AnalyzeWebsiteEventButton event={event} alertConfig={alertConfig} />
        </DescriptionButtons>
        <div className={locals.sectionWrapper}>
          <AlertingChart alertConfig={alertConfig} viewConfig={chartViewConfig} blueprintConfig={blueprintConfig} />
        </div>
        <div className={locals.sectionWrapper}>
          <DescriptionItem title="Domain">
            <div className={locals.domainContentWrapper}>
              <TagFilterListPresenter
                tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                  tagFilters: [blueprintConfig.getEntityTagFilter(alertConfig), ...tagFilters],
                  websiteLabel
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
