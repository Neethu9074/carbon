import {create} from 'reactive-observables';
import React from 'react';

import {getColorForEventAtFocusedMomentAsStream} from 'in-stores/events';
import {formatDurationRaw} from 'in-services/formatters/date';
import {serverTime$} from 'in-stores/serverTime';
import connectTo from 'in-hoc/connectTo';

import './EventDuration.less';


const block = 'in-event-duration';

export default connectTo(props =>{
  return {
    color: getColorForEventAtFocusedMomentAsStream(props.event, '#92a5ae'),
    to: props.event.get('state') === 'open'
      ? serverTime$
      : create().startWith(props.event.get('end')).freeze()
  };
},
function EventDuration({event, color, to}) {
  if (!to) {
    return null;
  }

  const from = event.get('start');

  return (
    <div className={block}
         style={{ background: color }}>
      {`${formatDurationRaw(to - from)}`}
    </div>
  );
});
