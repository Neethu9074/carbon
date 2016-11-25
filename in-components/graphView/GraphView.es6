import React from 'react';

import GraphLoadingIndicator from 'in-components/graphView/components/GraphLoadingIndicator';
import Explanation from 'in-components/graphView/components/Explanation';
import Universe from 'in-components/graphView/components/Universe';

import './GraphView.less';

const block = 'in-graph-view';

export default function GraphView() {
  return (
    <div className={block}>
      <Universe className={block + '__universe'} />
      <Explanation />
      <GraphLoadingIndicator />
    </div>
  );
}
