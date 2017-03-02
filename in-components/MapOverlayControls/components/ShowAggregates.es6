import React from 'react';

import {showAggregations$, toggle} from 'in-stores/metric/showAggregations';
import Control from 'in-components/MapOverlayControls/components/Control';
import connectTo from 'in-hoc/connectTo';


export default connectTo({
  showAggregations: showAggregations$
},
function ShowAggregates({showAggregations}) {
  return (
    <Control onClick={toggle}
             tooltipText={`${showAggregations ? 'Disable' : 'Enable'} time window based metric aggregations`}
             iconSize={24}
             type='timerange'
             isActive={showAggregations} />
  );
});
