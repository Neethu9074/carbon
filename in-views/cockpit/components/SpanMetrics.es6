import React from 'react';

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { ID_OF_PROCESSING_STATISTICS } from 'in-forge/constants';
import Metric from 'in-views/cockpit/components/Metric';
import MetricValue from 'in-components/MetricValue';

export default function SpanMetrics() {
  return (
    <div>
      <Metric label="Received spans">
        <MetricValue snapshotId={ID_OF_PROCESSING_STATISTICS} metric="spans" formatter={zeroDecimalPlaces} />
      </Metric>
    </div>
  );
}
