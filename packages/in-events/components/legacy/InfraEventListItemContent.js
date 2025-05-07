/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { DescriptionItem } from '@instana/components';

import InfraAlertChartWrapper, {
  useGetMetricLabel
} from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
import { getQueryBuilder } from 'in-alerting/smart-alerts/infrastructure/components/AlertQueryBuilder';
import { getExpressionWithGroupingTags } from 'in-events/components/EventContent/tagFilterUtils';
import { getSmartAlertAnalyzeTimeConfig } from 'in-events/components/EventContent/analyzeUtils';
import InfraScopePath from 'in-alerting/smart-alerts/infrastructure/components/InfraScopePath';
import { ScopeGroupingTags } from 'in-events/components/EventContent/ScopeInfraGroupingTags';
import { getIconType as getInfraIconType } from 'in-infrastructure/infrastructureIconType';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { alertingEventDetailsChartTimeframe } from 'in-alerting/components/constants';
import AnalyzeInfraEventButton from 'in-events/components/AnalyzeInfraEventButton';
import InfraAlertConfigButton from 'in-events/components/InfraAlertConfigButton';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import useInfraEventAlertConfig from 'in-events/hooks/useInfraEventAlertConfig';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import { infraPredictiveDetectionEnabled } from 'in-services/featureFlags';
import { hasInfrastructureAnalyzeAccess } from 'in-stores/permission';
import { emptyList, emptyMap } from 'in-services/fixedImmutables';
import useTagCatalog from 'in-infrastructure/hooks/useTagCatalog';
import { getChartTimeConfigByEvent } from 'in-events/timeframe';
import { deepCopy } from 'in-services/util/object';
import { t } from 'in-i18n';

import locals from './EventListItemContent.mless';

export default function InfraEventListItemContent({ event, justChart = false }) {
  const alertConfig = useInfraEventAlertConfig(event);
  const entityType = alertConfig?.rule?.entityType ?? 'all';
  const tagCatalog = useTagCatalog({ ownerType: entityType });
  const metricName = event.getIn(['metadata', 'smartAlertInfo', 'metricName'], '');
  const entityLabel = event.getIn(['metadata', 'entityLabel'], '');
  const aggregation = event.getIn(['metadata', 'smartAlertInfo', 'metricAggregation'], '');
  const groupingTags = event.getIn(['metadata', 'groupingTags'], emptyMap).toJS();
  const predictions = event.getIn(['metadata', 'predictions'], emptyList).toJS();
  const lowerBound = event.getIn(['metadata', 'predictionsLowerBound'], emptyList).toJS();
  const upperBound = event.getIn(['metadata', 'predictionsUpperBound'], emptyList).toJS();

  const metricLabel = useGetMetricLabel(entityType, metricName, aggregation);

  if (!alertConfig) {
    return null;
  }

  const AlertQueryBuilder = getQueryBuilder(tagCatalog).QueryBuilder;
  const tagFilterExpression = alertConfig?.tagFilterExpression;
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  const alertConfigWithGroupingExpression = {
    ...alertConfig,
    tagFilterExpression: {
      ...getExpressionWithGroupingTags(deepCopy(tagFilterExpression), groupingTags)
    }
  };
  const timeConfig = {
    ...getChartTimeConfigByEvent(event),
    windowSize: alertingEventDetailsChartTimeframe
  };
  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');

  return (
    <>
      {!justChart && (
        <>
          <ProblemDescription fixSuggestion={fixSuggestion} />
          <DescriptionButtons>
            <InfraAlertConfigButton alertConfig={alertConfig} />
            {hasInfrastructureAnalyzeAccess && (
              <AnalyzeInfraEventButton
                alertConfig={alertConfigWithGroupingExpression}
                timeConfig={getSmartAlertAnalyzeTimeConfig(event, alertConfig)}
              />
            )}
          </DescriptionButtons>
        </>
      )}
      <div className={locals.sectionWrapper}>
        <InfraAlertChartWrapper
          alertConfig={alertConfigWithGroupingExpression}
          timeConfig={timeConfig}
          metricLabel={metricLabel}
          predictions={infraPredictiveDetectionEnabled ? predictions : []}
          lowerBound={infraPredictiveDetectionEnabled ? lowerBound : []}
          upperBound={infraPredictiveDetectionEnabled ? upperBound : []}
        />
      </div>
      <div className={locals.sectionWrapper}>
        <DescriptionItem inComponents className={locals.title} title={t('in-events:titleScope')}>
          <div className={locals.alertFiltersWrapper}>
            <ScopeConfigPresenter
              tagFilterFormModel={tagFilterFormModel}
              queryBuilder={<AlertQueryBuilder value={tagFilterFormModel} readOnly />}
              scopePath={
                <>
                  <InfraScopePath infraName={entityLabel} iconName={getInfraIconType(entityType)} />
                  <ScopeGroupingTags AlertQueryBuilder={AlertQueryBuilder} groupingTags={groupingTags} />
                </>
              }
            />
          </div>
        </DescriptionItem>
      </div>
    </>
  );
}
