/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Link } from '@instana/components';
import { get } from 'lodash';
import React from 'react';

import { TopListWithUrlState, trackTopListNavigation } from 'in-new-components/TopListWithUrlState';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const metrics = ['pods'];
const labels = [t('in-kubernetes:dashboards.pods')];
const aggregations = ['MEAN'];
const formatters = [number.compact];

export default function KubernetesTopList(props) {
  const { title } = props;
  return (
    <TopListWithUrlState
      title={title}
      metrics={props.metrics || metrics}
      labels={props.labels || labels}
      aggregations={props.aggregations || aggregations}
      formatters={props.formatters || formatters}
      getList={getList}
      Renderer={Renderer}
      ViewAll={ViewAll}
      Label={Label}
      Metric={props.Metric ? props.Metric : Metric}
      {...props}
    />
  );
}

function getList({
  clusterId,
  namespaceId,
  podId,
  serviceId,
  deploymentId,
  nodeId,
  timeConfig,
  selectedMetric,
  metricOrderDirection,
  getItems
}) {
  return getItems({
    pagination: {
      page: 1,
      pageSize: 5
    },
    order: {
      by: selectedMetric,
      direction: metricOrderDirection || 'DESC'
    },
    filter: {
      clusterId,
      namespaceId,
      podId,
      serviceId,
      deploymentId,
      nodeId,
      timeConfig
    }
  });
}

function ViewAll({ entityNameKey, allItemsHref$, items, className }) {
  const key = entityNameKey || 'unknownEntity';
  return (
    <Link className={className} href$={allItemsHref$}>
      {items.length > 1 &&
        t('in-kubernetes:dashboards.viewEntity', {
          entityName: t('in-kubernetes:viewEntityName.all.' + key, { count: items.length })
        })}
      {items.length === 1 &&
        t('in-kubernetes:dashboards.viewEntity', {
          entityName: t('in-kubernetes:viewEntityName.' + key)
        })}
    </Link>
  );
}

function Label({ item, getItemHref$, getItemLabel, className }) {
  return (
    <Link className={className} href$={getItemHref$(item)} onClick={() => trackTopListNavigation()}>
      {getItemLabel(item)}
    </Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}

function Renderer(props) {
  return <TopListCardPresenter {...props} getMetricValueFromItem={getMetricValueFromItem} useMaxAvailableHeight />;
}
function getMetricValueFromItem(metricId, item) {
  return get(item, metricId);
}
