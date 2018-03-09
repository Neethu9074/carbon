import React from 'react';

import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import MediumContent from 'in-components/FlowMap/components/Node/MediumContent';
import { ServiceLink } from 'in-components/FlowMap/components/Node/EntityLinks';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

import locals from './EndpointsServiceWrapper.mless';

export default function EndpointsServiceWrapper({ node, data, serviceLocatorUid }) {
  return (
    <div className={locals.endpointsServiceWrapper}>
      <Header node={node} data={data} serviceLocatorUid={serviceLocatorUid} />
    </div>
  );
}

function Header({ node, data, serviceLocatorUid }) {
  if (!data) {
    return null;
  }

  const iconType = getServiceLocators(serviceLocatorUid).dataFetchingServiceLocator.getIconTypeForNodeId(data.id);

  return (
    <div className={locals.header}>
      {iconType && <SvgIcon className={locals.pluginIcon} type={iconType} width={16} height={16} color="#6c8a91" />}
      <Tooltip content={<ServiceInformationTooltip node={node} serviceLocatorUid={serviceLocatorUid} />}>
        <ServiceLink className={locals.entityLink} serviceId={data.id}>
          {data.label}
        </ServiceLink>
      </Tooltip>
    </div>
  );
}

const ServiceInformationTooltip = connectTo(
  props => ({
    data: props.node.events$.on('data'),
    metrics: props.node.events$.on('metricValues')
  }),
  function ServiceInformationTooltip({ data, metrics, serviceLocatorUid }) {
    return (
      <div className={locals.tooltipContent}>
        <MediumContent metrics={metrics} data={data} serviceLocatorUid={serviceLocatorUid} />
      </div>
    );
  }
);
