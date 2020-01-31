import React from 'react';

import UpstreamDownstreamGroup from 'in-new-components/UpstreamDownstream/components/UpstreamDownstreamGroup';
import ScrollHints from 'in-components/ScrollHints';

import locals from './UpstreamDownstreamPane.mless';

export default function UpstreamDownstreamPane({
  applicationId,
  area,
  items,
  label,
  result,
  selectedMetric,
  serviceId,
  timeConfig,
  totalHits
}) {
  if (!items.length) {
    return <div style={{ padding: '1.5em' }}>No {area} data to display</div>;
  }

  return (
    <ScrollHints className={locals.pane} contentChangeMarker={items.length}>
      <UpstreamDownstreamGroup
        applicationId={applicationId}
        area={area}
        items={items}
        label={label}
        result={result}
        selectedMetric={selectedMetric}
        serviceId={serviceId}
        timeConfig={timeConfig}
        totalHits={totalHits}
      />
    </ScrollHints>
  );
}
