import React from 'react';

import UpstreamDownstreamGroup from 'in-new-components/UpstreamDownstream/components/UpstreamDownstreamGroup';
import { relationships } from 'in-new-components/UpstreamDownstream/constants';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import ScrollHints from 'in-components/ScrollHints';

import locals from './UpstreamDownstreamPane.mless';

export default function UpstreamDownstreamPane({
  applicationId,
  activeTab,
  items,
  label,
  result,
  serviceId,
  timeConfig,
  endpointId,
  productArea,
  boundaryScope,
  itemsApplication,
  resultApplication,
  close
}) {
  if (!items.length && !itemsApplication.length) {
    return <EmptyPane serviceId={serviceId} endpointId={endpointId} activeTab={activeTab} />;
  }

  return (
    <ScrollHints className={locals.pane} contentChangeMarker={items.length}>
      <UpstreamDownstreamGroup
        applicationId={applicationId}
        activeTab={activeTab}
        boundaryScope={boundaryScope}
        productArea={productArea}
        endpointId={endpointId}
        items={items}
        label={label}
        result={result}
        serviceId={serviceId}
        timeConfig={timeConfig}
        itemType={relationships.SERVICE}
        close={close}
      />
      {itemsApplication.length > 0 && (
        <UpstreamDownstreamGroup
          applicationId={applicationId}
          activeTab={activeTab}
          boundaryScope={boundaryScope}
          productArea={productArea}
          endpointId={endpointId}
          items={itemsApplication}
          label={label}
          result={resultApplication}
          serviceId={serviceId}
          timeConfig={timeConfig}
          itemType={relationships.APPLICATION}
          close={close}
        />
      )}
    </ScrollHints>
  );
}

const EmptyPane = ({ serviceId, endpointId, activeTab }) => {
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
      <SvgIcon type={relationships.info[activeTab].icon} size="xxl" />
      <span className={locals.emptyMessage}>{`This ${entityType} ${relationships.info[activeTab].message}`}</span>
    </div>
  );
};
