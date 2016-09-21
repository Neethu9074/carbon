import React from 'react';

import './EventDependecyGraph.less';


const block = 'in-event-details-dependency-graph';

export default function EventDependecyGraph({isProvided}) {
  if (!isProvided) {
    return null;
  }

  return (
    <div className={block}>
      Dependency Graph
    </div>
  );
}
