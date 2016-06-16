import React from 'react';

import './PhysicalSummary.less';

const block = 'table-view-physical-summary';

export default function PhysicalSummary({zones}) {
  const hostCount = zones.reduce((count, zone) => {
    return count + zone.get('children').size;
  }, 0);

  return (
    <p className={block}>
      You are monitoring <em>{hostCount} Hosts</em> in <em>{zones.length} Zones</em>.
    </p>
  );
}
