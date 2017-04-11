import React from 'react';

import ServiceInstance from 'in-map/components/stickyNotes/logical/Service/components/ServiceInstance';

import './ServiceInstanceList.less';


const block = 'in-sticky-note-service-instance-list';

export default function ServiceInstanceList({serviceInstances}) {
  return (
    <div className={block}>
      <ul className={block + '__list'}>
        {serviceInstances.map(si =>
          <ServiceInstance key={si.id}
                           snapshotId={si.id} />
        )}
      </ul>
    </div>
  );
}
