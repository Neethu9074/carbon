import React from 'react';

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { ID_OF_PROCESSING_STATISTICS } from 'in-forge/constants';
import Metric from 'in-views/cockpit/components/Metric';
import MetricValue from 'in-components/MetricValue';

export default function Entities() {
  return (
    <div>
      <Metric label="Total">
        <MetricValue snapshotId={ID_OF_PROCESSING_STATISTICS} metric="totalEntities" formatter={zeroDecimalPlaces} />
      </Metric>
      <Metric label="Infrastructure">
        <MetricValue snapshotId={ID_OF_PROCESSING_STATISTICS} metric="physicalEntities" formatter={zeroDecimalPlaces} />
      </Metric>
      <Metric label="Application">
        <MetricValue snapshotId={ID_OF_PROCESSING_STATISTICS} metric="logicalEntities" formatter={zeroDecimalPlaces} />
      </Metric>
    </div>
  );
}
