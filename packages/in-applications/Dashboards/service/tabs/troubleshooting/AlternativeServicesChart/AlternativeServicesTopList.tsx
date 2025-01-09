/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React, { Fragment, ReactElement } from 'react';

import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';
import { t } from '@instana/i18n-react';

// @ts-expect-error TopListCardPresenter is not yet converted to TS, nor does it provide types
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import { createServiceNameTagFilter } from 'in-applications/Dashboards/service/tabs/troubleshooting/metricConfigs';
// eslint-disable-next-line no-restricted-imports
import { PaginatedResult, Result, ServiceItem } from 'in-types';
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { number } from 'in-services/formatters/number';

const metrics = ['callsAgg'];
const selectedMetric = metrics[0];
const labels = ['Calls'];

export interface AlternativeServicesChartPresenterProps {
  result: Result<PaginatedResult<ServiceItem>>;
  cardHeader?: ReactElement;
  maxResults?: number;
}

export default function AlternativeServicesTopList({
  result,
  cardHeader,
  maxResults = 5
}: AlternativeServicesChartPresenterProps) {
  const hasApproximateData = result?.resultPrecisionDetails?.resultPrecision === 'PRECISION_APPROXIMATE';

  return (
    <TopListPresenter
      title={'Top Alternative Services'}
      cardHeader={cardHeader}
      result={result}
      maxResults={maxResults}
      renderHistoricDataIndicator={hasApproximateData}
    />
  );
}

interface TopListPresenterProps {
  title: string;
  result: Result<PaginatedResult<ServiceItem>>;
  cardHeader?: ReactElement;
  maxResults: number;
  renderHistoricDataIndicator?: boolean;
}

function TopListPresenter({
  title,
  result,
  maxResults,
  cardHeader,
  renderHistoricDataIndicator = true
}: TopListPresenterProps) {
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();

  const sortedItems = [...(result?.data?.items ?? [])].sort((first: ServiceItem, second: ServiceItem) => {
    return second.metrics[selectedMetric][0][1] - first.metrics[selectedMetric][0][1];
  });
  if (result?.data) {
    result = {
      ...result,
      data: {
        ...result.data,
        items: sortedItems
          .map((item: ServiceItem) => {
            return {
              ...item,
              label: item.service.label
            };
          })
          .slice(0, maxResults)
      }
    };
  }

  return (
    <TopListCardPresenter
      title={title}
      result={result}
      metrics={metrics}
      labels={labels}
      selectedMetric={selectedMetric}
      selectedMetricFormatter={number.compact}
      header={cardHeader}
      ViewAll={() => {
        return (
          <Link
            href={getLinkToApplicationAnalyze({
              groupBy: {
                groupbyTag: 'service.name',
                groupbyTagEntity: 'DESTINATION'
              },
              orderBy: {
                by: 'calls',
                direction: 'DESC'
              },
              formModel: joinExpressions({
                logicalOperator: 'OR',
                expressions: sortedItems.map((item: ServiceItem) => createServiceNameTagFilter(item.service.label))
              })
            })}
          >
            {t('in-applications:serviceTroubleshooting.viewInAnalyze')}
          </Link>
        );
      }}
      Label={Label}
      Metric={Metric}
      renderHistoricDataIndicator={renderHistoricDataIndicator}
    />
  );
}

interface LabeledItem {
  label: string;
}

interface LabelProps {
  item: LabeledItem;
  className: string;
}

function Label({ item, className }: LabelProps) {
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();

  return (
    <Fragment>
      <SvgIcon type="lib_application_service" size="xs" style={{ marginRight: '0.5rem' }} />
      <Link className={className} href={getLinkToApplicationAnalyze({ serviceName: item.label })}>
        {item.label}
      </Link>
    </Fragment>
  );
}

interface MetricProps {
  formattedMetricValue: number;
}

function Metric({ formattedMetricValue }: MetricProps) {
  return formattedMetricValue;
}
