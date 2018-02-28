import React from 'react';

import { ServiceLink } from 'in-components/FlowMap/components/Node/EntityLinks';

import locals from './SmallContent.mless';

export default function SmallContent({ data }) {
  return (
    <ServiceLink className={locals.entityLink} serviceId={data.id}>
      {data.label}
    </ServiceLink>
  );
}
