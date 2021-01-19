/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import AlertingChartWithErrorMessage from 'in-new-components/Alerting/Chart/AlertingChartWithErrorMessage';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import AnalyzeApplicationEventButton from 'in-events/components/AnalyzeApplicationEventButton';
import ScopeConfigPresenter from 'in-new-components/Alerting/components/ScopeConfigPresenter';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-applications/tags';
import ApplicationAlertConfigButton from 'in-events/components/ApplicationAlertConfigButton';
import { createDefaultChartConfig } from 'in-new-components/Alerting/Chart/chartViewConfig';
import { getAlertConfigByIdAndTimestamp } from 'in-applications/api/applicationAlertConfig';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import { alertingEventDetailsChartTimeframe } from 'in-new-components/Alerting/constants';
import AlertQueryBuilder from 'in-applications/alerting/components/AlertQueryBuilder';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
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
    const timeConfig = {
      ...getChartTimeConfigByEvent({ event }),
      windowSize: alertingEventDetailsChartTimeframe
    };
    const chartViewConfig = createDefaultChartConfig(timeConfig);
    const tagFilterExpressionUiModel = fromBackendModel(alertConfig.tagFilterExpression);

    return (
      <>
        <ProblemDescription event={event} />
        <DescriptionButtons>
          <ApplicationAlertConfigButton alertConfig={alertConfig} />
          <AnalyzeApplicationEventButton event={event} alertConfig={alertConfig} />
        </DescriptionButtons>
        <div className={locals.sectionWrapper}>
          <AlertingChartWithErrorMessage
            alertConfig={{
              ...alertConfig,
              tagFilterExpression: tagFilterExpressionUiModel
            }}
            viewConfig={chartViewConfig}
            blueprintConfig={blueprintConfig}
          />
        </div>
        <div className={locals.sectionWrapper}>
          <DescriptionItem title="Domain">
            <div className={locals.domainContentWrapper}>
              <ScopeConfigPresenter
                tagFilterList={
                  <TagFilterListPresenter
                    tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                      applicationName,
                      tagFilters: [blueprintConfig.getEntityTagFilter(alertConfig), ...tagFilters]
                    })}
                    disabled
                  />
                }
                tagFilterExpressionUiModel={tagFilterExpressionUiModel}
                queryBuilder={<AlertQueryBuilder value={tagFilterExpressionUiModel} readOnly />}
                convertedTagFilterExpression={alertConfig.convertedTagFilterExpression}
                iconLabelConfig={{
                  text: applicationName,
                  type: 'lib_application'
                }}
              />
            </div>
          </DescriptionItem>
        </div>
      </>
    );
  }
);
