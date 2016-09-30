import React from 'react';

import {sortedRecentEvents$} from 'in-components/eventView/stores/recentEventsStore';
import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import Section from 'in-components/eventView/components/eventDetails/Section';
import {formatDate, formatTime} from 'in-services/formatters/date';
import connectTo from 'in-hoc/connectTo';

import './IncidentHeader.less';


const block = 'in-event-view-detail-incident-header';

export default connectTo({
  recentEvents: sortedRecentEvents$
},
function HeaderSwitch({recentEvents, event}) {
  if (!recentEvents) {
    return null;
  }

  const end = event.get('end');
  const openEvents = recentEvents.filter(e => !e.get('end'));

  return (
    <Section>
      <div>
        <DateTimeString label='Started'
                        timestamp={event.get('start')} />

        <DateTimeString label='Ended'
                        timestamp={end} />

        <div style={{ height: '0.8rem' }} />

        {keyValue('Active Issues', `${openEvents.length}/${recentEvents.length}`)}
        {keyValue('Changes', '0')}
        {keyValue('Affected', '0')}
      </div>
    </Section>
  );
});

function DateTimeString({label, timestamp}) {
  if (!timestamp) {
    return (
      <LabeledValue label={label}>
        active
      </LabeledValue>
    );
  }
  return (
    <LabeledValue label={label}>
      <span key='date'
            className={`${block}__date`}>
        {`${formatDate(timestamp)} `}
      </span>
      <span key='time'
            className={`${block}__time`}>
        {formatTime(timestamp)}
      </span>
    </LabeledValue>
  );
}

function keyValue(key, value) {
  return [
    <div key='date'
          className={`${block}__key`}>
      {key}
    </div>,
    <div key='time'
          className={`${block}__value`}>
      {value}
    </div>
  ];
}
