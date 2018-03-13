import React from 'react';

import { ServiceLink } from 'in-components/FlowMap/components/Node/EntityLinks';
import SvgIcon from 'in-components/SvgIcon';

import locals from './EndpointsServiceWrapper.mless';

export default function EndpointsServiceWrapper({ node, data, serviceLocatorUid }) {
  return (
    <div className={locals.endpointsServiceWrapper}>
      <Header node={node} data={data} serviceLocatorUid={serviceLocatorUid} />
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
      <ServiceLink className={locals.entityLink} serviceId={data.id}>
        {data.label}
      </ServiceLink>
    </div>
  );
}
