/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import UpstreamDownstreamGroup from 'in-new-components/UpstreamDownstream/components/UpstreamDownstreamGroup';
import { relationships } from 'in-new-components/UpstreamDownstream/constants';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

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
  itemsApplication,
  resultApplication,
  close,
  tagFilters,
  snapshotId,
  plugin
}) {
  if (!items?.length && !itemsApplication?.length) {
    return (
      <EmptyPane serviceId={serviceId} endpointId={endpointId} activeTab={activeTab} applicationId={applicationId} />
    );
  }

  return (
    <div className={locals.pane}>
      {items?.length > 0 && (
        <UpstreamDownstreamGroup
          applicationId={applicationId}
          activeTab={activeTab}
          endpointId={endpointId}
          items={items}
          label={label}
          result={result}
          serviceId={serviceId}
          timeConfig={timeConfig}
          itemType={relationships.SERVICE}
          close={close}
          tagFilters={tagFilters}
          snapshotId={snapshotId}
          plugin={plugin}
        />
      )}
      {itemsApplication?.length > 0 && (
        <UpstreamDownstreamGroup
          applicationId={applicationId}
          activeTab={activeTab}
          endpointId={endpointId}
          items={itemsApplication}
          label={label}
          result={resultApplication}
          serviceId={serviceId}
          timeConfig={timeConfig}
          itemType={relationships.APPLICATION}
          close={close}
          tagFilters={tagFilters}
          snapshotId={snapshotId}
          plugin={plugin}
        />
      )}
    </div>
  );
}

const EmptyPane = ({ serviceId, endpointId, applicationId, activeTab }) => {
  let entityType;
  if (endpointId != null) {
    entityType = 'endpoint';
  } else if (serviceId != null) {
    entityType = 'service';
  } else if (applicationId != null && !serviceId && !endpointId) {
    entityType = 'application';
  } else {
    entityType = 'entity';
  }

  return (
    <div className={locals.emptyPane}>
      <SvgIcon type={relationships.info[activeTab].icon} size="xxl" />
      <span className={locals.emptyMessage}>{`This ${entityType} ${relationships.info[activeTab].message}`}</span>
    </div>
  );
};
