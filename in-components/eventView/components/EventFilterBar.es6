import React from 'react';

import {setFilter, eventFilter$, FILTER} from 'in-components/eventView/stores/eventFilterStore';
import connectTo from 'in-hoc/connectTo';

import './EventFilterBar.less';


const block = 'in-event-view-event-filter-bar';

export default connectTo({
  eventFilter: eventFilter$
},
function EventFilterBar({eventFilter}) {
  return (
    <div className={block}>
      <CheckBox title='Incidents'
                active={eventFilter === FILTER.INCIDENTS}
                onClick={() => setFilter(FILTER.INCIDENTS)} />

      <CheckBox title='Events'
                active={eventFilter === FILTER.EVENTS}
                onClick={() => setFilter(FILTER.EVENTS)} />
    </div>
  );
});


function CheckBox({title, onClick, active}) {
  let className = `${block}__checkbox`;
  if (active) {
    className += ` ${className}--active`;
  }

  return (
    <div className={className}
         onClick={onClick}>
      {title}
    </div>
  );
}
