/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Map } from 'immutable';
import React from 'react';

import { DescriptionItem } from '@instana/components';

import ReadOnlyIncludeInternalOrSyntheticCallsSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/IncludeInternalOrSyntheticCallsSwitch/ReadOnlyIncludeInternalOrSyntheticCallsSwitch';
import ReadOnlyInboundOrAllCalls from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/ReadOnlyInboundOrAllCalls';
import ApplicationAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/applications/chart/ApplicationAlertingChartWithErrorMessage';
import {
  extendWindowSizeForLateData,
  getSmartAlertAnalyzeTimeConfig
} from 'in-events/components/EventContent/analyzeUtils';
import { getQueryBuilderForAlertType } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import ApplicationScopePath from 'in-alerting/smart-alerts/applications/components/ApplicationScopePath';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import AnalyzeApplicationEventButton from 'in-events/components/AnalyzeApplicationEventButton';
import ApplicationAlertConfigButton from 'in-events/components/ApplicationAlertConfigButton';
import useApplicationEventAlertConfig from 'in-events/hooks/useApplicationEventAlertConfig';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { alertingEventDetailsChartTimeframe } from 'in-alerting/components/constants';
import useApplicationEventEntity from 'in-events/hooks/useApplicationEventEntity';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import { getChartTimeConfigByEvent } from 'in-events/timeframe';
import { t } from 'in-i18n';

import locals from './ApplicationEventListItemContent.mless';

export default function ApplicationEventListItemContent({ event, justChart = false }) {
  const alertConfig = useApplicationEventAlertConfig(event);
  const eventEntity = useApplicationEventEntity(event);

  if (!eventEntity || !alertConfig) {
    return null;
  }

  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');
  const isGlobalSmartAlert = event.getIn(['metadata', 'globalSmartAlert'], false);
  const adaptiveBaselineInfo = event.getIn(['metadata', 'adaptiveBaselineInfo'], Map({})) ?? Map({});
  const { applicationId } = eventEntity;
  const { rule, threshold, granularity } = alertConfig;
  const { alertType } = rule;

  const blueprintConfig = getBlueprintConfig(alertType);
  const timeConfig = {
    ...getChartTimeConfigByEvent(event),
    windowSize: alertingEventDetailsChartTimeframe
  };

  const extendedAnalyzeTimeConfig = extendWindowSizeForLateData(
    getSmartAlertAnalyzeTimeConfig(event, alertConfig),
    granularity
  );

  const chartViewConfig = createDefaultChartConfig(timeConfig);
  const tagFilterFormModel = fromBackendModel(alertConfig.tagFilterExpression);

  const thresholdType = threshold.type;
  const { QueryBuilder } = getQueryBuilderForAlertType(alertType, thresholdType);
  return (
    <>
      {!justChart && (
        <>
          <ProblemDescription fixSuggestion={fixSuggestion} />
          <DescriptionButtons>
            <ApplicationAlertConfigButton
              applicationId={applicationId}
              alertConfig={alertConfig}
              isGlobalSmartAlert={isGlobalSmartAlert}
            />
            <AnalyzeApplicationEventButton
              {...eventEntity}
              alertConfig={alertConfig}
              timeConfig={extendedAnalyzeTimeConfig}
              adaptiveBaselineInfo={adaptiveBaselineInfo.toJS()}
            />
          </DescriptionButtons>
        </>
      )}
      <div className={locals.sectionWrapper}>
        <ApplicationAlertingChartWithErrorMessage
          alertConfigWithFormModel={{
            ...alertConfig,
            tagFilterExpression: tagFilterFormModel
          }}
          viewConfig={chartViewConfig}
          blueprintConfig={blueprintConfig}
          applicationId={eventEntity.applicationId}
          serviceId={eventEntity.serviceId}
          endpointId={eventEntity.endpointId}
          isEventsView
        />
      </div>
      <div className={locals.sectionWrapper}>
        <DescriptionItem inComponents className={locals.title} title={t('in-events:titleScope')}>
          <div className={locals.scopeContentWrapper}>
            <div className={locals.alertFiltersWrapper}>
              <ScopeConfigPresenter
                tagFilterFormModel={tagFilterFormModel}
                queryBuilder={<QueryBuilder value={tagFilterFormModel} readOnly />}
                scopePath={<ApplicationScopePath boundaryScope={alertConfig.boundaryScope} {...eventEntity} />}
              />
            </div>
            <ReadOnlyInboundOrAllCalls alertConfig={alertConfig} />
            <ReadOnlyIncludeInternalOrSyntheticCallsSwitch alertConfig={alertConfig} />
          </div>
        </DescriptionItem>
      </div>
    </>
  );
}
