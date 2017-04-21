import irpt from 'react-immutable-proptypes';
import React from 'react';

import {sortedRecentEvents$} from 'in-views/eventView/stores/recentEventsStore';
import {getColorForEventAtFocusedMomentAsStream} from 'in-stores/events';
import SnapshotDescription from 'in-components/SnapshotDescription';
import {toHtml} from 'in-services/formatters/markdown';
import {getSnapshot} from 'in-stores/snapshot';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';


const block = 'in-event-description';

export default connectTo(props => {
  return {
    snapshot: getSnapshot(props.incident.getIn(['problem', 'snapshotId'])),
    events: sortedRecentEvents$
  };
}, IncidentContent);

function IncidentContent({incident, events, snapshot}) {
  if (!events || events.length === 0) {
    return null;
  }

  const firstEvent = events[0];
  const problem = firstEvent.get('problem');
  const label = snapshot ? getLabel(snapshot) : '';

  return (
    <div>
      <div className={block + '__header'}>
        {`incident: ${incident.getIn(['problem', 'problemText'])} - ${label} (${incident.get('recentEvents').size} events)`}
      </div>

      <span className={block + '__incident-started'}>
        started here:
      </span>

      <Header event={firstEvent}
              text={problem.get('problemText')} />

      <div className={block + '__suggestion'}
           dangerouslySetInnerHTML={{__html: toHtml(problem.get('fixSuggestion'))}} />

      <SnapshotDescription snapshotId={problem.get('snapshotId', '')}
                           time={firstEvent.get('start')} />
    </div>
  );
}

const Header = connectTo(props => {
  return {
    color: getColorForEventAtFocusedMomentAsStream(props.event)
  };
}, ({color, text}) => {
  return (
    <div className={block + '__header'}
         style={{
           color: color ? color : '#ffffff'
         }}>
      {text}
    </div>
  );
});

const rpt = React.PropTypes;
IncidentContent.propTypes = {
  incident: irpt.map.isRequired,
  snapshot: irpt.map,
  color: rpt.string,
  events: rpt.array
};

Header.propTypes = {
  event: irpt.map.isRequired,
  color: rpt.string
};
