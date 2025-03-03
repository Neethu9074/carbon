/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import {
  GetLinkToExploreProps,
  useLinkToExplore as useLinkToInfraEntityExplore
} from 'in-infrastructure/navigation/paths';
import { InfraSmartAlertConfig } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { TimeConfig, GenericInfraAlertRule, TagFilterExpressionElementUnion } from 'in-types';
import { urlWithoutQueryParameter } from 'in-events/components/urlWithoutQueryParameter';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { Grouping } from 'in-custom-dashboards/widgets/Table/types';
import { t } from 'in-i18n';

interface Props {
  alertConfig: InfraSmartAlertConfig;
  timeConfig: TimeConfig;
}

export default function AnalyzeInfraEventButton({ alertConfig, timeConfig }: Props) {
  const { tagFilterExpression, rule } = alertConfig;
  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();

  const linkToUA = getLinkToUnboundAnalytics(rule, tagFilterExpression, getLinkToInfraEntityExplore, timeConfig);

  return (
    <Button kind="primary" icon="lib_analyze_inverted" href={linkToUA}>
      {t('in-analyze:analyzeHeader.analyzeInfrastructureSelectedTitle')}
    </Button>
  );
}

export function getLinkToUnboundAnalytics(
  rule: GenericInfraAlertRule,
  tagFilterExpression: TagFilterExpressionElementUnion,
  getLinkToInfraEntityExplore: (getLinkToExploreProps: GetLinkToExploreProps) => string,
  timeConfig?: TimeConfig,
  groupByArray?: Partial<Grouping[]>
): string {
  const { metricName, aggregation, entityType, crossSeriesAggregation } = rule;
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  return urlWithoutQueryParameter(
    getLinkToInfraEntityExplore({
      tagFilterExpression: tagFilterFormModel,
      type: entityType,
      timeConfig,
      metrics: [
        {
          metric: metricName,
          aggregation
        }
      ],
      chartedMetrics: [
        {
          metric: metricName,
          aggregation: aggregation,
          crossSeriesAggregation: crossSeriesAggregation
        }
      ],
      order: {
        by: `${metricName}.${aggregation}`,
        direction: 'DESC'
      },
      groupBy: groupByArray ?? [],
      fromEventPage: true
    })
  );
}
