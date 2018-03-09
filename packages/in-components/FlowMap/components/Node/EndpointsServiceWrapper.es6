import React from 'react';

import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import { ServiceLink } from 'in-components/FlowMap/components/Node/EntityLinks';
import SvgIcon from 'in-components/SvgIcon';

import locals from './EndpointsServiceWrapper.mless';

export default function EndpointsServiceWrapper({ data, serviceLocatorUid }) {
  return (
    <div className={locals.endpointsServiceWrapper}>
      <Header data={data} serviceLocatorUid={serviceLocatorUid} />
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
      </div>
    </div>
  );
}
