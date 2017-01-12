import React from 'react';

import {showAggregations$, toggle} from 'in-stores/metric/showAggregations';
import Control from 'in-components/Controls/components/Control';
import connectTo from 'in-hoc/connectTo';

export default connectTo({
  showAggregations: showAggregations$
}, function ShowAggregates({showAggregations}) {
  let text = showAggregations ? 'Disable' : 'Enable';
  text += ' time window based metric aggregations';

  return (
    <Control onClick={toggle}
             tooltipText={text}
             iconSize={24}
             type='timer'
             isActive={showAggregations} />
  );
});
