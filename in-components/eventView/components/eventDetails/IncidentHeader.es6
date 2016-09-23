import React from 'react';

import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import Section from 'in-components/eventView/components/eventDetails/Section';
import {formatDate, formatTime} from 'in-services/formatters/date';

import './IncidentHeader.less';


const block = 'in-event-view-detail-incident-header';

export default function HeaderSwitch({event}) {
  const end = event.get('end');

  return (
    <Section>
      <div>
        <DateTimeString label='Started'
                        timestamp={event.get('start')} />

        <DateTimeString label='Ended'
                        timestamp={end} />

        <div style={{ height: '0.8rem' }} />

        {keyValue('Active Issues', '0/0')}
        {keyValue('Changes', '0')}
        {keyValue('Affected', '0')}
      </div>
    </Section>
  );
}

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
