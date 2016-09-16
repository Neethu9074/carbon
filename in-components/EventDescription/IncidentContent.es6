import {combineLatest} from 'reactive-observables';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getColorForEventAtFocusedMomentAsStream} from 'in-stores/events';
import SnapshotDescription from 'in-components/SnapshotDescription';
import {toHtml} from 'in-services/formatters/markdown';
import {emptyList} from 'in-services/fixedImmutables';
import {getEvent} from 'in-services/issueTracker';
import connectTo from 'in-hoc/connectTo';


const block = 'in-event-description';

export default connectTo(props => {
  const subscriptions = {
    events: combineLatest(props.incident.get('recentEvents', emptyList).toArray().map(id => getEvent(id)))
  };
  if (props.events && props.events.size > 0) {
    subscriptions.color = getColorForEventAtFocusedMomentAsStream(props.events.get(0));
  }
  return subscriptions;
}, IncidentContent);

function IncidentContent({incident, color, events}) {
  if (!events || events.size === 0 || !color) {
    return null;
  }

  const firstEvent = events.get(0);
  const problem = firstEvent.get('problem');

  return (
    <div>
      <div className={block + '__header'}>
        {`incident (${incident.get('recentEvents').size}) events`}
      </div>

      <span className={block + '__incident-started'}>
        started here:
      </span>

      <div className={block + '__header'}
           style={{color}}>
        {problem.get('problemText')}
      </div>

      <div className={block + '__suggestion'}
           dangerouslySetInnerHTML={{__html: toHtml(problem.get('fixSuggestion'))}} />

      <SnapshotDescription snapshotId={problem.get('snapshotId', '')}
                           time={firstEvent.get('start')}/>
    </div>
  );
}

const rpt = React.PropTypes;
IncidentContent.propTypes = {
  incident: irpt.map.isRequired,
  color: rpt.string,
  events: rpt.array
};
