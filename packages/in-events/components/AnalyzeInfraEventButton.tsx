/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button, CarbonMenuItem, SvgIcon } from '@instana/components';

import {
  GetLinkToExploreProps,
  useLinkToExplore as useLinkToInfraEntityExplore
} from 'in-infrastructure/navigation/paths';
import { InfraSmartAlertConfig } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { TimeConfig, GenericInfraAlertRule, TagFilterExpressionElementUnion, Order } from 'in-types';
import { urlWithoutQueryParameter } from 'in-events/components/urlWithoutQueryParameter';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { Grouping } from 'in-custom-dashboards/widgets/Table/types';
import { parseUrl } from 'in-stores/navigation/routing/parser';
import { t } from 'in-i18n';

interface Props {
  alertConfig: InfraSmartAlertConfig;
  timeConfig: TimeConfig;
  as?: 'menuItem' | 'button';
}

export default function AnalyzeInfraEventButton({ alertConfig, timeConfig, as = 'button' }: Props) {
  const { tagFilterExpression, rule } = alertConfig;
  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();
  const { navigate } = useNavigation();
  const linkToUA = getLinkToUnboundAnalytics(rule, tagFilterExpression, getLinkToInfraEntityExplore, timeConfig);

  if (as === 'menuItem') {
    return (
      <CarbonMenuItem
        renderIcon={() => <SvgIcon type="lib_analyze" size="xs" />}
        onClick={() => {
          navigate(parseUrl(linkToUA, true));
        }}
        label={t('in-analyze:analyzeHeader.analyzeInfrastructureSelectedTitle')}
      />
    );
  }

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
  groupByArray?: Partial<Grouping[]>,
  order?: Order
): string {
  const { metricName, aggregation, entityType, crossSeriesAggregation } = rule;
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);
  const orderForInfraExplore = order ?? {
    by: `${metricName}.${aggregation}`,
    direction: 'DESC'
  };

  return urlWithoutQueryParameter(
    getLinkToInfraEntityExplore({
      tagFilterExpression: tagFilterFormModel,
      type: entityType,
      timeConfig,
      metrics: [
        {
          metric: metricName,
          aggregation,
          crossSeriesAggregation
        }
      ],
      chartedMetrics: [
        {
          metric: metricName,
          aggregation: aggregation,
          crossSeriesAggregation: crossSeriesAggregation
        }
      ],
      order: orderForInfraExplore,
      groupBy: groupByArray ?? [],
      fromEventPage: true
    })
  );
}
