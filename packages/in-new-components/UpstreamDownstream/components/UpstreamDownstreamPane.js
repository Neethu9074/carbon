import React from 'react';

import UpstreamDownstreamGroup from 'in-new-components/UpstreamDownstream/components/UpstreamDownstreamGroup';
import { relationships } from 'in-new-components/UpstreamDownstream/constants';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import ScrollHints from 'in-components/ScrollHints';

import locals from './UpstreamDownstreamPane.mless';

export default function UpstreamDownstreamPane({
  applicationId,
  area,
  items,
  label,
  result,
  serviceId,
  timeConfig,
  endpointId,
  dashboard,
  boundaryScope,
  itemsApplication,
  resultApplication
}) {
  if (!items.length && !itemsApplication.length) {
    return <EmptyPane serviceId={serviceId} endpointId={endpointId} area={area} />;
  }

  return (
    <ScrollHints className={locals.pane} contentChangeMarker={items.length}>
      <UpstreamDownstreamGroup
        applicationId={applicationId}
        area={area}
        boundaryScope={boundaryScope}
        dashboard={dashboard}
        endpointId={endpointId}
        items={items}
        label={label}
        result={result}
        serviceId={serviceId}
        timeConfig={timeConfig}
        itemType={relationships.SERVICE}
      />
      {itemsApplication.length > 0 && (
        <UpstreamDownstreamGroup
          applicationId={applicationId}
          area={area}
          boundaryScope={boundaryScope}
          dashboard={dashboard}
          endpointId={endpointId}
          items={itemsApplication}
          label={label}
          result={resultApplication}
          serviceId={serviceId}
          timeConfig={timeConfig}
          itemType={relationships.APPLICATION}
        />
      )}
    </ScrollHints>
  );
}

const EmptyPane = ({ serviceId, endpointId, area }) => {
  let entityType;
  if (endpointId != null) {
    entityType = 'endpoint';
  } else if (serviceId != null) {
    entityType = 'service';
  } else {
    entityType = 'application';
  }

  return (
    <div className={locals.emptyPane}>
      <SvgIcon type={relationships.info[area].icon} size="xxl" />
      <span className={locals.emptyMessage}>{`This ${entityType} ${relationships.info[area].message}`}</span>
    </div>
  );
};
