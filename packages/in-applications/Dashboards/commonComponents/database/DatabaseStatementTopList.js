/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Link } from '@instana/components';
import React, { Fragment } from 'react';
import { get } from 'lodash';

import { TopListWithUrlState, trackTopListNavigation } from 'in-new-components/TopListWithUrlState';
import getDatabaseStatementTopList from 'in-subscription/application/getDatabaseStatementTopList';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import { getLinkToAnalyze } from 'in-applications/navigation/paths';
import { millis, number } from 'in-services/formatters/number';
import { boundaryScopes } from 'in-applications/constants';
import { shorten } from 'in-services/util/string';
import connect from 'in-hoc/connectTo';
import theme from 'in-themes';
import { t } from 'in-i18n';

const metrics = ['latency', 'calls', 'errors'];
const labels = [
  t('in-applications:labelLatency'),
  t('in-applications:labelCalls'),
  t('in-applications:titleErroneousCalls')
];
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
      title={t('in-applications:titleTopStatements')}
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      getList={getList}
      getItemsFromResult={getItemsFromResult}
      getMetricValueFromItem={getMetricValueFromItem}
      Renderer={TopListCardPresenter}
      Label={Label}
      Metric={Metric}
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

function Label({ item, applicationLabel, serviceLabel, endpointLabel, className }) {
  return (
    <Fragment>
      <Link
        className={className}
        href$={getLinkToAnalyze({
          applicationName: applicationLabel,
          serviceName: serviceLabel,
          endpointName: endpointLabel,
          boundaryScope: boundaryScopes.all,
          dataSource: 'calls',
          formModel: [tagFilter('call.database.statement', EQUALS, item.statement)]
        })}
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
