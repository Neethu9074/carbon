/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import { CONTAINS, EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { createChartedMetric, createMetricField } from 'in-analyze/navigation/paths';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { getLinkToAnalyze } from 'in-applications/navigation/paths';
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
      className={className}
      kind="secondary"
      href$={getLinkToAnalyze({
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
