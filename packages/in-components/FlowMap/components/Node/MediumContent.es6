import React from 'react';

import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import { ServiceLink } from 'in-components/FlowMap/components/Node/EntityLinks';
import MetricList from 'in-components/FlowMap/components/Node/MetricList';
import SvgIcon from 'in-components/SvgIcon';

import locals from './MediumContent.mless';

export default function MediumContent(props) {
  return (
    <div className={locals.mediumContent}>
      <Header {...props} />
      <div className={locals.line} />
      <MetricList className={locals.metrics} metrics={props.metrics} />
    </div>
  );
}

function Header(props) {
  const data = props.data;
  if (!data) {
    return null;
  }

  return (
    <div className={locals.header}>
      <SvgIcon className={locals.pluginIcon} type="lib_application_service" width={24} height={24} color="#6c8a91" />
      <div>
        <ServiceLink className={locals.entityLink} serviceId={data.id} {...props}>
          {data.label}
        </ServiceLink>
        <div className={locals.spacer} />
        <EndpointTypeBadgeList type={data.type} types={data.types} size="sm" />
      </div>
    </div>
  );
}
