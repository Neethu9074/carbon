import React from 'react';

import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import { ServiceLink } from 'in-components/FlowMap/components/Node/EntityLinks';

import locals from './SmallContent.mless';

export default function SmallContent({ data }) {
  return (
    <div className={locals.smallContent}>
      <ServiceLink className={locals.entityLink} serviceId={data.id}>
        {data.label}
      </ServiceLink>
      <div className={locals.spacer} />
      <EndpointTypeBadgeList type={data.type} types={data.types} size="xs" />
    </div>
  );
}
