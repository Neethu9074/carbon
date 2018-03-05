import React from 'react';

import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import { ServiceLink } from 'in-components/FlowMap/components/Node/EntityLinks';
import { number, millis, percentage } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';

import locals from './MediumContent.mless';

export default function MediumContent({ data, metrics, serviceLocatorUid }) {
  return (
    <div className={locals.mediumContent}>
      <Header data={data} serviceLocatorUid={serviceLocatorUid} />
      <div className={locals.line} />
      <MetricList metrics={metrics} />
    </div>
  );
}

function Header({ data, serviceLocatorUid }) {
  if (!data) {
    return null;
  }

  const iconType = getServiceLocators(serviceLocatorUid).dataFetchingServiceLocator.getIconTypeForNodeId(data.id);

  return (
    <div className={locals.header}>
      {iconType && <SvgIcon className={locals.pluginIcon} type={iconType} width={16} height={16} color="#6c8a91" />}
      <div>
        <ServiceLink className={locals.entityLink} serviceId={data.id}>
          {data.label}
        </ServiceLink>
        <div className={locals.spacer} />
        <EndpointTypeBadgeList type={data.type} types={data.types} size="sm" />
      </div>
    </div>
  );
}

function MetricList({ metrics }) {
  metrics = metrics || {};
  return (
    <div className={locals.metrics}>
      <Metric type="change2" value={metrics.calls ? number.compact(metrics.calls) : '--'} />
      <Metric type="time" value={metrics.latency ? millis.detailed(metrics.latency) : '--'} />
      <Metric type="error" value={metrics.errors ? percentage.detailed(metrics.errors) : '--'} />
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
