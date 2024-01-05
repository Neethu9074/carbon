/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Card } from '@instana/components';

import {
  alertingEventDetailsChartTimeframe as minDurationMillis,
  alertingDialogItemPickerTimeframe as maxDurationMillis
} from 'in-alerting/components/constants';
import InfraAlertChartWrapper, {
  useGetMetricLabel
} from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
import { getQueryBuilder } from 'in-alerting/smart-alerts/infrastructure/components/AlertQueryBuilder';
import { InfraGrouping } from 'in-alerting/smart-alerts/infrastructure/components/InfraGrouping';
import { getSmartAlertAnalyzeTimeConfig } from 'in-events/components/EventContent/analyzeUtils';
import InfraScopePath from 'in-alerting/smart-alerts/infrastructure/components/InfraScopePath';
import { getIconType as getInfraIconType } from 'in-infrastructure/infrastructureIconType';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import AnalyzeInfraEventButton from 'in-events/components/AnalyzeInfraEventButton';
import { getWindowSizeFromEvent } from 'in-alerting/components/Chart/chartUtils';
import InfraAlertConfigButton from 'in-events/components/InfraAlertConfigButton';
import useInfraEventAlertConfig from 'in-events/hooks/useInfraEventAlertConfig';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import { infraSmartAlertsPredictionsEnabled } from 'in-services/featureFlags';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { TagCatalog, TagFilterExpression, TimeConfig } from 'in-types';
import { hasInfrastructureAnalyzeAccess } from 'in-stores/permission';
import useTagCatalog from 'in-infrastructure/hooks/useTagCatalog';
import { emptyList, emptyMap } from 'in-services/fixedImmutables';
import { getChartTimeConfigByEvent } from 'in-events/timeframe';
import { Row, Col } from 'in-components/layout/Grid';
import { deepCopy } from 'in-services/util/object';
import PluginIcon from 'in-components/PluginIcon';
import { EventOrMap } from 'in-events/types';
import { t } from 'in-i18n';

import locals from './InfraEventContent.mless';

interface Props {
  event: EventOrMap;
}

export default function InfraEventContent({ event }: Props) {
  const alertConfig = useInfraEventAlertConfig(event);
  const entityType = alertConfig?.rule?.entityType ?? 'all';
  const tagCatalog = useTagCatalog({ ownerType: entityType });

  const aggregation = event.getIn(['metadata', 'smartAlertInfo', 'metricAggregation'], '');
  const metricName = event.getIn(['metadata', 'smartAlertInfo', 'metricName'], '');
  const metricLabel = useGetMetricLabel(entityType, metricName, aggregation);

  if (!alertConfig) {
    return null;
  }

  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');
  const entityName = event.getIn(['metadata', 'entityName'], '');
  const entityLabel = event.getIn(['metadata', 'entityLabel'], '');
  const groupingTags = event.getIn(['metadata', 'groupingTags'], emptyMap).toJS();
  const predictions = event.getIn(['metadata', 'predictions'], emptyList).toJS();
  const lowerBound = event.getIn(['metadata', 'lowerBound'], emptyList).toJS();
  const upperBound = event.getIn(['metadata', 'lowerBound'], emptyList).toJS();

  const tagFilterExpression = alertConfig.tagFilterExpression;
  const AlertQueryBuilder = getQueryBuilder(tagCatalog as TagCatalog).QueryBuilder;
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  const alertConfigWithGroupingExpression = {
    ...alertConfig,
    tagFilterExpression: {
      ...getFilterGroupExpression(deepCopy(tagFilterExpression) as TagFilterExpression, groupingTags)
    }
  };

  const windowSize = getWindowSizeFromEvent(event, minDurationMillis, maxDurationMillis);

  let timeConfig = {
    ...getChartTimeConfigByEvent(event),
    autoRefresh: false,
    ...(windowSize && { windowSize })
  } as TimeConfig;

  // If the event includes predictions, the endtime is either the end date or the last timestamp in the prediction, whichever is greater.
  if (predictions?.length > 0 && infraSmartAlertsPredictionsEnabled) {
    const predictionMaxTime = predictions[predictions.length - 1][0];
    const endTime = timeConfig?.to ? Math.max(timeConfig?.to, predictionMaxTime) : predictionMaxTime;
    timeConfig = { ...timeConfig, to: endTime, focusedMoment: endTime };
  }

  return (
    <>
      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleDescription')}>
            <HorizontalFlexWrapper>
              <PluginIcon className={locals.icon} size="s" plugin={entityType as string} />
              {t('in-events:infraSmartAlerts.pseudoAggregatedEntityLabel', { entityName: entityName })}
            </HorizontalFlexWrapper>

            <ProblemDescription fixSuggestion={fixSuggestion} className="in-event-view-event-content" />

            {hasInfrastructureAnalyzeAccess && (
              <DescriptionButtons>
                <InfraAlertConfigButton alertConfig={alertConfig} />
                <AnalyzeInfraEventButton
                  alertConfig={alertConfigWithGroupingExpression}
                  timeConfig={getSmartAlertAnalyzeTimeConfig(event as EventOrMap, alertConfig)}
                />
              </DescriptionButtons>
            )}
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleMetrics')}>
            <InfraAlertChartWrapper
              alertConfig={alertConfigWithGroupingExpression}
              timeConfig={timeConfig}
              metricLabel={metricLabel}
              predictions={infraSmartAlertsPredictionsEnabled ? predictions : []}
              lowerBound={infraSmartAlertsPredictionsEnabled ? lowerBound : []}
              upperBound={infraSmartAlertsPredictionsEnabled ? upperBound : []}
            />
          </Card>
        </Col>
      </Row>

      <Row withoutSideMargin>
        <Col xs>
          <Card title={t('in-events:titleScope')}>
            <div className={locals.alertFiltersWrapper}>
              <ScopeConfigPresenter
                tagFilterFormModel={tagFilterFormModel}
                //@ts-expect-error type error for querybuilder
                queryBuilder={<AlertQueryBuilder value={tagFilterFormModel} readOnly />}
                scopePath={
                  <>
                    <InfraScopePath infraName={entityLabel} iconName={getInfraIconType(entityType as string)} />
                    <InfraGrouping AlertQueryBuilder={AlertQueryBuilder} groupingTags={groupingTags} />
                  </>
                }
              />
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export interface groupExpressionProps {
  [key: string]: string;
}

export function getFilterGroupExpression(
  tagFilterExpression: TagFilterExpression,
  groupingTags: groupExpressionProps[]
): TagFilterExpression {
  const groupingKeys = Object.keys(groupingTags);
  if (!groupingKeys.length) {
    return tagFilterExpression;
  }

  const groupingTFE: TagFilterExpression = { type: 'EXPRESSION', logicalOperator: 'AND', elements: [] };

  groupingKeys.map(key => {
    const groupExpression = tagFilter(key, EQUALS, groupingTags[key as keyof typeof groupingTags]);
    groupingTFE.elements.push(groupExpression);
  });

  return { type: 'EXPRESSION', logicalOperator: 'AND', elements: [tagFilterExpression, groupingTFE] };
}
