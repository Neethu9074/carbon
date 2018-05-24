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
      <SvgIcon className={locals.pluginIcon} type="lib_application_service" width={24} height={24} color="#6c8a91" />
      <ServiceLink className={locals.entityLink} serviceId={data.id}>
        {data.label}
      </ServiceLink>
    </div>
  );
}
