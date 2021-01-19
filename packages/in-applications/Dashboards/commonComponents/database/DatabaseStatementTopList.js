/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import theme from 'in-themes';
import { get } from 'lodash';

import { TopListWithUrlState, trackTopListNavigation } from 'in-new-components/TopListWithUrlState';
import getDatabaseStatementTopList from 'in-subscription/application/getDatabaseStatementTopList';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { millis, number } from 'in-services/formatters/number';
import { boundaryScopes } from 'in-applications/constants';
import { shorten } from 'in-services/util/string';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

const metrics = ['latency', 'calls', 'errors'];
const labels = ['Latency', 'Calls', 'Erroneous Calls'];
const aggregations = ['MEAN', 'SUM', 'SUM'];
const formatters = [millis.fixedCompact, number.compact, number.compact];
const colors = [null, null, theme.lib.colors.failure];

export default connect(({ applicationId, serviceId, endpointId }) => {
  const observables = {};
  if (applicationId) {
    observables.applicationLabel = getApplication({ id: applicationId }).map(getLabel);
  }
  if (serviceId) {
    observables.serviceLabel = getServiceLabel({ id: serviceId }).map(getLabel);
  }
  if (endpointId) {
    observables.endpointLabel = getEndpointInfo({ id: endpointId }).map(getLabel);
  }
  return observables;
})(function DatabaseStatementTopList({
  applicationId,
  applicationLabel,
  serviceId,
  serviceLabel,
  endpointId,
  endpointLabel,
  boundaryScope,
  timeConfig,
  urlMatrixParamConfig
}) {
  return (
    <TopListWithUrlState
      title="Top Statements"
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      getList={getList}
      getItemsFromResult={getItemsFromResult}
      getMetricValueFromItem={getMetricValueFromItem}
      render={TopListCardPresenter}
      renderLabel={Label}
      renderMetric={Metric}
      timeConfig={timeConfig}
      applicationId={applicationId}
      applicationLabel={applicationLabel}
      serviceId={serviceId}
      serviceLabel={serviceLabel}
      endpointId={endpointId}
      endpointLabel={endpointLabel}
      boundaryScope={boundaryScope}
      colors={colors}
      urlMatrixParamConfig={urlMatrixParamConfig}
    />
  );
});

function getItemsFromResult(result) {
  return result.data;
}

function getMetricValueFromItem(metricId, item) {
  return item.metricValue;
}

function getList({
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  timeConfig,
  selectedMetric,
  selectedMetricAggregation
}) {
  return getDatabaseStatementTopList({
    metric: {
      metric: selectedMetric,
      aggregation: selectedMetricAggregation
    },
    filter: {
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      applicationBoundaryScope: boundaryScope,
      timeConfig
    }
  });
}

function Label({ item, applicationLabel, serviceLabel, endpointLabel }, _item, className) {
  const tagCatalog = useTagCatalog(getTagCatalog);
  return (
    <Fragment>
      <Link
        className={className}
        href$={
          tagCatalog &&
          getLinkToAnalyze({
            applicationName: applicationLabel,
            serviceName: serviceLabel,
            endpointName: endpointLabel,
            boundaryScope: boundaryScopes.all,
            dataSource: 'calls',
            filters: [{ name: 'call.database.statement', operator: 'equals', value: item.statement }],
            tagCatalog,
            groupByTag: {}
          })
        }
        onClick={() => trackTopListNavigation()}
      >
        {shorten(item.statement, 64)}
      </Link>
    </Fragment>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}
