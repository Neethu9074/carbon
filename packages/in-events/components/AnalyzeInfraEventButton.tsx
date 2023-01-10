/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Observable } from '@instana/observables';
import { Button } from '@instana/components';

import { InfraAlertConfig, TimeConfig, GenericInfraAlertRule, TagFilterExpressionElementUnion } from 'in-types';
import { urlWithoutQueryParameter } from 'in-events/components/urlWithoutQueryParameter';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { getLinkToExplore } from 'in-infrastructure/navigation/paths';
import { t } from 'in-i18n';

interface Props {
  alertConfig: InfraAlertConfig;
  timeConfig: TimeConfig;
}

export default function AnalyzeInfraEventButton({ alertConfig, timeConfig }: Props) {
  const { tagFilterExpression, rule } = alertConfig;

  const linkToUA = getLinkToUnboundAnalytics(rule, tagFilterExpression, timeConfig);

  return (
    <Button kind="primary" icon={'lib_analyze_inverted'} href$={linkToUA}>
      {t('in-analyze:analyzeHeader.analyzeInfrastructureSelectedTitle')}
    </Button>
  );
}

function getLinkToUnboundAnalytics(
  rule: GenericInfraAlertRule,
  tagFilterExpression: TagFilterExpressionElementUnion,
  timeConfig: TimeConfig
): Observable<string> {
  const { metricName, aggregation, entityType } = rule;

  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  return getLinkToExplore({
    tagFilterExpression: tagFilterFormModel,
    type: entityType,
    timeConfig,
    metrics: [
      {
        metric: metricName,
        aggregation
      }
    ],
    order: {
      by: `${metricName}.${aggregation}`,
      direction: 'DESC'
    }
  }).map(urlWithoutQueryParameter);
}
