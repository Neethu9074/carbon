/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get } from 'lodash';
import React from 'react';

import { Link } from '@instana/legacy';

import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import { TopListWithUrlState } from 'in-components/TopListWithUrlState';
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

function ViewAll({ entityNameKey, allItemsHref, items, className }) {
  const key = entityNameKey || 'unknownEntity';
  return (
    <Link className={className} href={allItemsHref}>
      {items.length > 1 &&
        t('in-kubernetes:dashboards.viewEntity', {
          entityName: t('in-kubernetes:viewAllEntityName', { context: key, count: items.length })
        })}
      {items.length === 1 &&
        t('in-kubernetes:dashboards.viewEntity', {
          entityName: t('in-kubernetes:viewEntityName', { context: key })
        })}
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
