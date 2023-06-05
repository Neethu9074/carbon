/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import {
  BoundaryScope,
  Result,
  Service,
  TimeConfig,
  AggregationType,
  DatabaseStatementTopListItem,
  ApplicationBoundaryScope
} from '@instana/types';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';
import { Link } from '@instana/legacy';

// @ts-expect-error
import { TopListWithUrlState, trackTopListNavigation } from 'in-components/TopListWithUrlState';
// @ts-expect-error
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import getDatabaseStatementTopList from 'in-applications/subscriptions/getDatabaseStatementTopList';
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getApplication from 'in-applications/subscriptions/getApplication';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { UrlMatrixParamConfig, WithLabel } from 'in-applications/types';
import { millis, number } from 'in-services/formatters/number';
import { boundaryScopes } from 'in-applications/constants';
import { shorten } from 'in-services/util/string';
import theme from 'in-themes';
import { t } from 'in-i18n';

const metrics = ['latency', 'calls', 'errors'];
const labels = [
  t('in-applications:labelLatency'),
  t('in-applications:labelCalls'),
  t('in-applications:titleErroneousCallRate')
];
const aggregations = ['MEAN', 'SUM', 'MEAN'];
const formatters = [millis.fixedCompact, number.compact, number.compact];
const colors = [null, null, theme.lib.colors.failure];

interface DatabaseStatementTopListProps {
  applicationId?: string | null;
  serviceId?: string | null;
  endpointId?: string | null;
  boundaryScope: BoundaryScope;
  timeConfig: TimeConfig;
  urlMatrixParamConfig: UrlMatrixParamConfig;
  renderHistoricDataIndicator: boolean;
  renderWidgetNotSupportedIndicator: boolean;
}

export default function DatabaseStatementTopList({
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  timeConfig,
  urlMatrixParamConfig,
  renderHistoricDataIndicator,
  renderWidgetNotSupportedIndicator
}: DatabaseStatementTopListProps) {
  const applicationLabel = useObservable(
    applicationId ? getApplication({ id: applicationId }).map(getLabel) : just(null),
    [applicationId]
  );
  const serviceLabel = useObservable(serviceId ? getServiceLabel({ id: serviceId }).map(getLabel) : just(null), [
    serviceId
  ]);
  const endpointLabel = useObservable(endpointId ? getEndpointInfo({ id: endpointId }).map(getLabel) : just(null), [
    endpointId
  ]);

  return (
    <TopListWithUrlState
      title={t('in-applications:titleTopStatements')}
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      getList={getList}
      getItemsFromResult={getItemsFromResult}
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
      renderHistoricDataIndicator={renderHistoricDataIndicator}
      renderWidgetNotSupportedIndicator={renderWidgetNotSupportedIndicator}
    />
  );
}

function getItemsFromResult(result: Result<Service>) {
  return result.data;
}

interface GetListProps {
  applicationId: string;
  serviceId: string;
  endpointId: string;
  boundaryScope: ApplicationBoundaryScope;
  timeConfig: TimeConfig;
  selectedMetric: string;
  selectedMetricAggregation: AggregationType;
}

function getList({
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  timeConfig,
  selectedMetric,
  selectedMetricAggregation
}: GetListProps) {
  return getDatabaseStatementTopList({
    metrics: {
      [selectedMetric]: {
        metric: selectedMetric,
        aggregation: selectedMetricAggregation
      }
    },
    filter: {
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      applicationBoundaryScope: boundaryScope,
      timeConfig,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
    },
    order: {
      by: selectedMetric,
      direction: 'DESC'
    }
  });
}

interface LabelProps {
  item: DatabaseStatementTopListItem;
  applicationLabel: string;
  serviceLabel: string;
  endpointLabel: string;
  className: string;
}

function Label({ item, applicationLabel, serviceLabel, endpointLabel, className }: LabelProps) {
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();

  return (
    <Fragment>
      <Link
        className={className}
        href={getLinkToApplicationAnalyze({
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

interface MetricProps {
  formattedMetricValue: string;
}

function Metric({ formattedMetricValue }: MetricProps) {
  return formattedMetricValue;
}

function getLabel(result: WithLabel): string {
  return get(result, ['data', 'label'], null);
}
