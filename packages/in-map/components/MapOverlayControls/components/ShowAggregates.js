import React from 'react';

import { showAggregations$, toggle } from 'in-stores/metric/showAggregations';
import Control from 'in-map/components/MapOverlayControls/components/Control';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    showAggregations: showAggregations$
  },
  function ShowAggregates({ showAggregations }) {
    return (
      <Control
        onClick={toggle}
        tooltipText={`${showAggregations ? 'Disable' : 'Enable'} time window based metric aggregations`}
        type="lib_datetime_timerange"
        isActive={showAggregations}
      />
    );
  }
);
