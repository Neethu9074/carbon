/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button, CarbonMenuItem, SvgIcon } from '@instana/components';

import {
  TimeConfig,
  GenericInfraAlertRule,
  TagFilterExpressionElementUnion,
  Order,
  ApiTag,
  TagFilterExpression
} from 'in-types';
import {
  GetLinkToExploreProps,
  useLinkToExplore as useLinkToInfraEntityExplore
} from 'in-infrastructure/navigation/paths';
import { InfraSmartAlertConfig } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { getExpressionWithGroupingTags } from 'in-events/components/EventContent/tagFilterUtils';
import { urlWithoutQueryParameter } from 'in-events/components/urlWithoutQueryParameter';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { convertGroupingTagTypes } from 'in-events/components/util/groupingTagsUtils';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { Grouping } from 'in-custom-dashboards/widgets/Table/types';
import { parseUrl } from 'in-stores/navigation/routing/parser';
import { deepCopy } from 'in-services/util/object';
import { t } from 'in-i18n';

interface Props {
  alertConfig: InfraSmartAlertConfig;
  timeConfig: TimeConfig;
  groupingTags?: Record<string, string>;
  tagsFromTagCatalog?: ApiTag[] | undefined;
  as?: 'menuItem' | 'button';
}

export default function AnalyzeInfraEventButton({
  alertConfig,
  timeConfig,
  groupingTags,
  tagsFromTagCatalog,
  as = 'button'
}: Props) {
  const { tagFilterExpression, rule } = alertConfig;
  const { navigate } = useNavigation();

  const getLinkToUA = useLinkToNavigate(tagFilterExpression, rule, timeConfig, groupingTags, tagsFromTagCatalog);

  const handleClick = () => {
    const link = getLinkToUA();
    navigate(parseUrl(link, true));
  };

  if (as === 'menuItem') {
    return (
      <CarbonMenuItem
        renderIcon={() => <SvgIcon type="lib_analyze" size="xs" />}
        onClick={handleClick}
        label={t('in-analyze:analyzeHeader.analyzeInfrastructureSelectedTitle')}
      />
    );
  }

  return (
    <Button kind="primary" icon="lib_analyze_inverted" onClick={handleClick}>
      {t('in-analyze:analyzeHeader.analyzeInfrastructureSelectedTitle')}
    </Button>
  );
}

export function useLinkToNavigate(
  tagFilterExpression: TagFilterExpressionElementUnion,
  rule: GenericInfraAlertRule,
  timeConfig?: TimeConfig,
  groupingTags?: Record<string, string>,
  tagsFromTagCatalog?: ApiTag[],
  order?: Order
): () => string {
  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();

  return () => {
    const expression = groupingTags
      ? getExpressionWithGroupingTags(
          deepCopy(tagFilterExpression) as TagFilterExpression,
          convertGroupingTagTypes(groupingTags, tagsFromTagCatalog),
          true
        )
      : tagFilterExpression;

    return getLinkToUnboundAnalytics(rule, expression, getLinkToInfraEntityExplore, timeConfig, order);
  };
}

export function getLinkToUnboundAnalytics(
  rule: GenericInfraAlertRule,
  tagFilterExpression: TagFilterExpressionElementUnion,
  getLinkToInfraEntityExplore: (getLinkToExploreProps: GetLinkToExploreProps) => string,
  timeConfig?: TimeConfig,
  order?: Order,
  groupByArray?: Partial<Grouping[]>
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
