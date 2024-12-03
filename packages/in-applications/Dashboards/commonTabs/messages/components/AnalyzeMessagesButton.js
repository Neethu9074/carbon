/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { createChartedMetric, createMetricField } from 'in-analyze/navigation/paths';
import { CONTAINS, EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { t } from 'in-i18n';

export default function AnalyzeMessagesButton({
  groupByTagName,
  applicationName,
  serviceName,
  endpointName,
  className,
  boundaryScope,
  query,
  includeInternal,
  includeSynthetic,
  showErroneous
}) {
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();

  const groupBy = { groupbyTag: groupByTagName };
  let formModel = [];
  if (query.length > 0) {
    formModel = joinExpressions({ expressions: [formModel, tagFilter(groupByTagName, CONTAINS, query)] });
  }
  if (showErroneous) {
    formModel = joinExpressions({ expressions: [formModel, tagFilter('call.erroneous', EQUALS, true)] });
  }

  const hiddenCalls = includeInternal || includeSynthetic ? { includeInternal, includeSynthetic } : null;

  const orderByGroups = showErroneous ? { by: 'erroneousCalls_SUM' } : null;
  const chartedMetrics = showErroneous ? [createChartedMetric('erroneousCalls', 'SUM')] : null;
  const fields = showErroneous ? [createMetricField('erroneousCalls', 'SUM')] : null;
  return (
    <Button
      size="compact"
      className={className}
      kind="secondary"
      href={getLinkToApplicationAnalyze({
        applicationName,
        serviceName,
        endpointName,
        dataSource: 'calls',
        groupBy,
        boundaryScope,
        formModel,
        orderByGroups,
        chartedMetrics,
        fields,
        hiddenCalls
      })}
    >
      {t('in-applications:buttonAnalyzeMessages')}
    </Button>
  );
}
