import React from 'react';

import './ObjectiveViolationMessage.less';


const block = 'in-event-view-incident-objective-message';

export default function ObjectiveViolationMessage({event}) {
  return (
    <span className={block}>
      {event.getIn(['problem', 'problemText'])}
    </span>
  );
}
