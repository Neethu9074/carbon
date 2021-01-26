/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ApplicationAlertingChartWithErrorMessage from 'in-applications/alerting/chart/ApplicationAlertingChartWithErrorMessage';
import ReadOnlyInboundOrAllCalls from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/ReadOnlyInboundOrAllCalls';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import AnalyzeApplicationEventButton from 'in-events/components/AnalyzeApplicationEventButton';
import { getChartTimeConfigByEvent, getSmartAlertAnalyzeTimeframe } from 'in-events/timeframe';
import ScopeConfigPresenter from 'in-new-components/Alerting/components/ScopeConfigPresenter';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-applications/tags';
import ApplicationAlertConfigButton from 'in-events/components/ApplicationAlertConfigButton';
import { createDefaultChartConfig } from 'in-new-components/Alerting/Chart/chartViewConfig';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import { alertingEventDetailsChartTimeframe } from 'in-new-components/Alerting/constants';
import AlertQueryBuilder from 'in-applications/alerting/components/AlertQueryBuilder';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import useAppDataEventEntity from 'in-events/hooks/useAppDataEventEntity';
import useEventAlertConfig from 'in-events/hooks/useEventAlertConfig';
import { DescriptionItem } from 'in-components/DescriptionList';

import locals from './ApplicationEventListItemContent.mless';

export default function ApplicationEventListItemContent({ event }) {
  const alertConfig = useEventAlertConfig(event);
  const eventEntity = useAppDataEventEntity(event);

  if (!eventEntity || !alertConfig) {
    return null;
  }

  const tagFilters = alertConfig.tagFilters;
  const alertType = alertConfig.rule.alertType;

  const blueprintConfig = getBlueprintConfig(alertType);
  const timeConfig = {
    ...getChartTimeConfigByEvent({ event }),
    windowSize: alertingEventDetailsChartTimeframe
  };
  const analyzeTimeConfig = getSmartAlertAnalyzeTimeframe(event, alertConfig);
  const chartViewConfig = createDefaultChartConfig(timeConfig);
  const tagFilterFormModel = fromBackendModel(alertConfig.tagFilterExpression);

  return (
    <>
      <ProblemDescription event={event} />
      <DescriptionButtons>
        <ApplicationAlertConfigButton alertConfig={alertConfig} />
        <AnalyzeApplicationEventButton
          alertConfig={alertConfig}
          applicationName={eventEntity.applicationName}
          serviceName={eventEntity.serviceName}
          timeConfig={analyzeTimeConfig}
        />
      </DescriptionButtons>
      <div className={locals.sectionWrapper}>
        <ApplicationAlertingChartWithErrorMessage
          alertConfigWithFormModel={{
            ...alertConfig,
            tagFilterExpression: tagFilterFormModel
          }}
          viewConfig={chartViewConfig}
          blueprintConfig={blueprintConfig}
          serviceId={eventEntity.serviceId}
        />
      </div>
      <div className={locals.sectionWrapper}>
        <DescriptionItem className={locals.title} title="Scope">
          <div className={locals.scopeContentWrapper}>
            <div className={locals.alertFiltersWrapper}>
              <ScopeConfigPresenter
                tagFilterList={
                  <TagFilterListPresenter
                    tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                      applicationName: eventEntity.applicationName,
                      tagFilters: [...blueprintConfig.getEntityTagFilters(alertConfig), ...tagFilters]
                    })}
                    disabled
                  />
                }
                tagFilterFormModel={tagFilterFormModel}
                queryBuilder={<AlertQueryBuilder value={tagFilterFormModel} readOnly />}
                convertedTagFilterExpression={alertConfig.convertedTagFilterExpression}
                scopePath={{
                  applicationName: eventEntity.applicationName,
                  serviceName: eventEntity.serviceName
                }}
              />
            </div>
            <ReadOnlyInboundOrAllCalls alertConfig={alertConfig} />
          </div>
        </DescriptionItem>
      </div>
    </>
  );
}
