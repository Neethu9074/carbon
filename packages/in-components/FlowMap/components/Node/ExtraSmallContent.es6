import React from 'react';

import { ServiceLink } from 'in-components/FlowMap/components/Node/EntityLinks';

import locals from './ExtraSmallContent.mless';

export default function ExtraSmallContent({ data }) {
  return (
    <ServiceLink className={locals.entityLink} serviceId={data.id}>
      {data.label}
    </ServiceLink>
  );
}
