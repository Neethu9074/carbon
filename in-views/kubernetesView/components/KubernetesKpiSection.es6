import React from 'react';

import './KubernetesKpiSection.less';

const block = 'in-kubernetes-kpi-section';

export default function KubernetesKpiSection({ data }) {
  return (
    <div className={block}>
      <Kpi metricName="Nodes" classNameAppendix="__nodes">
        {data.nodes != null ? data.nodes : '––'}
      </Kpi>
      <Kpi metricName="Available Replicas" classNameAppendix="__available-replicas">
        {data.availableReplicas != null ? data.availableReplicas : '––'}
      </Kpi>
      <Kpi metricName="Desired Replicas" classNameAppendix="__desired-replicas">
        {data.replicas != null ? data.replicas : '––'}
      </Kpi>
    </div>
  );
}

function Kpi({ metricName, children, classNameAppendix }) {
  const kpi = `${block}__kpi ${block}__kpi`;
  return (
    <div className={`${block}__kpi-block`}>
      <span className={`${block}__metric-name ${block}__metric-name${classNameAppendix}`}>{metricName}</span>
      <span className={`${kpi}${classNameAppendix}`}>{children}</span>
    </div>
  );
}
