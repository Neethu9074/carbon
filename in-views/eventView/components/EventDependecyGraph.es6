import React from 'react';

import addSection from 'in-views/eventView/hocs/addSection';

import './EventDependecyGraph.less';


const block = 'in-event-details-dependency-graph';

export default addSection(function EventDependecyGraph({event}) {
  return (
    <div className={block}>
      Dependency Graph
      {event.get('id')}
    </div>
  );
},
() => false
);
