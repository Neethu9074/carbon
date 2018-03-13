import React from 'react';

import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import { ServiceLink } from 'in-components/FlowMap/components/Node/EntityLinks';
import MetricList from 'in-components/FlowMap/components/Node/MetricList';
import SvgIcon from 'in-components/SvgIcon';

import locals from './MediumContent.mless';

export default function MediumContent({ data, metrics, serviceLocatorUid }) {
  return (
    <div className={locals.mediumContent}>
      <Header data={data} serviceLocatorUid={serviceLocatorUid} />
      <div className={locals.line} />
      <MetricList className={locals.metrics} metrics={metrics} />
    </div>
  );
}

function Header({ data }) {
  if (!data) {
    return null;
  }

  return (
    <div className={locals.header}>
      <SvgIcon className={locals.pluginIcon} type="app_service" width={16} height={16} color="#6c8a91" />
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
