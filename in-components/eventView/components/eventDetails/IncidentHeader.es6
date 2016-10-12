import {combineLatest} from 'reactive-observables';
import React from 'react';

import {sortedRecentEvents$} from 'in-components/eventView/stores/recentEventsStore';
import LabeledValue from 'in-components/TwoColumnView/components/LabeledValue';
import Section from 'in-components/eventView/components/eventDetails/Section';
import {fireCallbacksForEventAtFocusedMomentAsStream} from 'in-stores/events';
import {formatDate, formatTime} from 'in-services/formatters/date';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import connectTo from 'in-hoc/connectTo';

import './IncidentHeader.less';


const block = 'in-event-view-detail-incident-header';

export default connectTo(props => {
  return {
    recentEvents: sortedRecentEvents$,
    openEvents: sortedRecentEvents$.flatMap(_events => combineLatest(
      _events.map(_event => fireCallbacksForEventAtFocusedMomentAsStream(_event, () => true, () => false))
    )),
    isOpen: fireCallbacksForEventAtFocusedMomentAsStream(props.event, () => true, () => false)
  };
},
function HeaderSwitch({recentEvents, openEvents, isOpen, event}) {
  if (!recentEvents) {
    return null;
  }

  const changes = recentEvents.filter(e => getEventType(e) === EVENT_TYPES.CHANGE);
  const numOpenEvents = openEvents ? openEvents.filter(e => e).length : '';
  const affectedEnties = {};
  recentEvents.forEach(e => affectedEnties[e.getIn(['problem', 'snapshotId'])] = true);

  return (
    <Section>
      <div>
        <DateTimeString label='Started'
                        timestamp={event.get('start')} />

        <DateTimeString label='Ended'
                        timestamp={isOpen ? null : event.get('end')} />

        <div style={{ height: '0.8rem' }} />

        {keyValue('Active Issues', `${numOpenEvents}/${recentEvents.length}`)}
        {keyValue('Changes', `${changes.length}`)}
        {keyValue('Affected', `${Object.keys(affectedEnties).length}`)}
      </div>
    </Section>
  );
});

function DateTimeString({label, timestamp}) {
  if (!timestamp) {
    return (
      <LabeledValue label={label}
                    lightTheme={true} >
        active
      </LabeledValue>
    );
  }
  return (
    <LabeledValue label={label}
                  lightTheme={true} >
      <span key='date'
            className={`${block}__date`}>
        {`${formatDate(timestamp)} `}
      </span>
      <span key='time'
            className={`${block}__time`}>
        {timestamp ? formatTime(timestamp) : 'active'}
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
