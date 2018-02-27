import React from 'react';

import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import { number, millis, percentage } from 'in-services/formatters/number';
import EntityLink from 'in-components/FlowMap/components/Node/EntityLink';
import SvgIcon from 'in-components/SvgIcon';

import locals from './MediumContent.mless';

export default function MediumContent({ data, metrics, serviceLocatorUid }) {
  const iconType = getServiceLocators(serviceLocatorUid).dataFetchingServiceLocator.getIconTypeForNodeId(data.id);

  return (
    <div className={locals.mediumContent}>
      <div className={locals.header}>
        {iconType && <SvgIcon className={locals.pluginIcon} type={iconType} width={16} height={16} color="#6c8a91" />}
        <div>
          <EntityLink className={locals.entityLink} data={data} />
          <div className={locals.spacer} />
          <EndpointTypeBadgeList type={data.type} types={data.types} size="sm" />
        </div>
      </div>
      <div className={locals.line} />
      <MetricList metrics={metrics} />
    </div>
  );
}

function MetricList({ metrics }) {
  metrics = metrics || {};
  return (
    <div className={locals.metrics}>
      <Metric type="change2" value={metrics.callsAgg ? number.compact(metrics.callsAgg[0][1]) : '--'} />
      <Metric type="time" value={metrics.latencyAgg ? millis.detailed(metrics.latencyAgg[0][1]) : '--'} />
      <Metric type="error" value={metrics.errorsAgg ? percentage.detailed(metrics.errorsAgg[0][1]) : '--'} />
    </div>
  );
}

function Metric({ type, value }) {
  return (
    <div className={locals.metric}>
      <SvgIcon className={locals.metricIcon} type={type} height={11} color="#16363e" />
      {value}
    </div>
  );
}
