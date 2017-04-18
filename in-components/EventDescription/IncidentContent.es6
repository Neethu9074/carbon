import { combineLatest } from 'reactive-observables';
import irpt from 'react-immutable-proptypes';
import rpt from 'prop-types';
import React from 'react';

import { getColorForEventAtFocusedMomentAsStream } from 'in-stores/events';
import SnapshotDescription from 'in-components/SnapshotDescription';
import { toHtml } from 'in-services/formatters/markdown';
import { emptyList } from 'in-services/fixedImmutables';
import { getEvent } from 'in-services/issueTracker';
import connectTo from 'in-hoc/connectTo';

const block = 'in-event-description';

export default connectTo(props => {
  return {
    events: combineLatest(props.incident.get('recentEvents', emptyList).toArray().map(id => getEvent(id)))
  };
}, IncidentContent);

function IncidentContent({ incident, events }) {
  if (!events || events.length === 0) {
    return null;
  }

  const firstEvent = events[0];
  const problem = firstEvent.get('problem');

  return (
    <div>
      <div className={block + '__header'}>
        {`incident (${incident.get('recentEvents').size}) events`}
      </div>

      <span className={block + '__incident-started'}>
        started here:
      </span>

      <Header event={firstEvent} text={problem.get('problemText')} />

      <div
        className={block + '__suggestion'}
        dangerouslySetInnerHTML={{ __html: toHtml(problem.get('fixSuggestion')) }}
      />

      <SnapshotDescription snapshotId={problem.get('snapshotId', '')} time={firstEvent.get('start')} />
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
  color: rpt.string,
  events: rpt.array
};

Header.propTypes = {
  event: irpt.map.isRequired,
  color: rpt.string
};
