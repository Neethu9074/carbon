import { combineLatest } from '@instana/observables';
import irpt from 'react-immutable-proptypes';
import rpt from 'prop-types';
import React from 'react';

import { getEvent, getColorForEventAtFocusedMomentAsStream } from 'in-stores/events';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import SnapshotDescription from 'in-components/SnapshotDescription';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { toHtml } from 'in-services/formatters/markdown';
import { emptyList } from 'in-services/fixedImmutables';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

const block = 'in-event-description';

export default connectTo(props => {
  const eventIds = props.incident.get('recentEvents', emptyList);
  const events = eventIds.toArray().map(id => getEvent(id));

  return {
    snapshot: getSnapshot(props.incident.get('entityId')),
    events: combineLatest(events).map(events => events.sort((a, b) => a.get('start') - b.get('start')))
  };
}, IncidentContent);

function IncidentContent({ incident, events, snapshot }) {
  if (!events || events.length === 0) {
    return null;
  }

  const firstEvent = events[0];
  const problem = firstEvent.get('problem');
  const label = snapshot ? getLabel(snapshot) : '';
  const eventCounterLabel = events.length === 1 ? 'event' : 'events';

  return (
    <div>
      <div className={block + '__header'}>
        {`incident: ${incident.getIn(['problem', 'problemText'])} - ${label} (${events.length} ${eventCounterLabel})`}
      </div>

      <span className={block + '__incident-started'}>started here:</span>

      <Header event={firstEvent} text={problem.get('problemText')} />

      <DangerousHtmlPresenter className={`${block}__suggestion`} html={toHtml(problem.get('fixSuggestion', ''))} />

      <SnapshotDescription
        snapshotId={firstEvent.get('entityId', '')}
        timeConfig={getTimeConfigAtMoment(firstEvent.get('start'))}
      />
    </div>
  );
}

const Header = connectTo(
  props => {
    return {
      color: getColorForEventAtFocusedMomentAsStream(props.event)
    };
  },
  ({ color, text }) => {
    return (
      <div
        className={block + '__header'}
        style={{
          color: color ? color : '#ffffff'
        }}
      >
        {text}
      </div>
    );
  }
);

IncidentContent.propTypes = {
  incident: irpt.map.isRequired,
  snapshot: irpt.map,
  events: rpt.array
};

Header.propTypes = {
  event: irpt.map.isRequired,
  color: rpt.string
};
