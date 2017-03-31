import React from 'react';

import ServiceInstance from 'in-map/components/stickyNotes/logical/Service/components/ServiceInstance';

import './ServiceInstanceList.less';

const block = 'in-sticky-note-service-instance-list';

export default function ServiceInstanceList({ ids }) {
  return (
    <div className={block}>
      <ul className={block + '__list'}>
        {ids.map(id => <ServiceInstance key={id} snapshotId={id} />)}
      </ul>
    </div>
  );
}
