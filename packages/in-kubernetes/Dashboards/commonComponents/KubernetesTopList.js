import { get } from 'lodash';
import React from 'react';

import { TopListWithUrlState, trackTopListNavigation } from 'in-new-components/TopListWithUrlState';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { number } from 'in-services/formatters/number';
import Link from 'in-components/Link';

const metrics = ['pods'];
const labels = ['Pods'];
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
      render={Renderer}
      renderViewAll={ViewAll}
      renderLabel={Label}
      renderMetric={props.renderMetric || Metric}
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

function ViewAll({ viewAllEntityName, allItemsHref$, items }, className) {
  const entityName = viewAllEntityName || '';
  return (
    <Link className={className} href$={allItemsHref$}>
      {items.length > 1 && `View all ${entityName}s`}
      {items.length === 1 && ` View ${entityName}`}
    </Link>
  );
}

function Label({ item, getItemHref$, getItemLabel }, _item, className) {
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
