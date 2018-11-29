import { get } from 'lodash';
import React from 'react';

import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import TopList, { trackTopListNavigation } from 'in-new-components/TopList';
import { number } from 'in-services/formatters/number';
import Link from 'in-components/Link';

const metrics = ['pods'];
const labels = ['Pods'];
const aggregations = ['MEAN'];
const formatters = [number.compact];

export default function KubernetesTopList(props) {
  const { title } = props;
  return (
    <TopList
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
  getItems
}) {
  return getItems({
    pagination: {
      page: 1,
      pageSize: 5
    },
    order: {
      by: selectedMetric,
      direction: 'DESC'
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

function ViewAll({ allItemsHref$ }, className) {
  return (
    <Link className={className} href$={allItemsHref$}>
      View All
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
  return <TopListCardPresenter {...props} getMetricValueFromItem={getMetricValueFromItem} />;
}
function getMetricValueFromItem(metricId, item) {
  return get(item, metricId);
}
