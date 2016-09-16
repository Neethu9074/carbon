import {combineLatest} from 'reactive-observables';
import React from 'react';

import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import {timeframe, timeframeShape} from 'in-stores/timeline';
import {emptyList} from 'in-services/fixedImmutables';
import {emptyArray} from 'in-services/fixedObjects';
import {getEvent} from 'in-services/issueTracker';
import connectTo from 'in-hoc/connectTo';

import 'in-components/sidebars/Incident/components/RecentEventsCounter.less';


const block = 'in-sidebar-incident-recent-events-counter';
const rpt = React.PropTypes;

export default connectTo(props => {
  return {
    events: combineLatest(props.incident.get('recentEvents', emptyList).toArray().map(id => getEvent(id))),
    _timeframe: timeframe
  };
}, RecentEventsCounter);

function RecentEventsCounter({_timeframe, events}) {
  if (!_timeframe || !events || events.size === 0) {
    return null;
  }

  const counter = getEventsCounter(_timeframe, events);

  return (
    <div className={block}>
      <Counter titleFirstLine={'Active'}
               titleSecondLine={counter.activeIssues === 1 ? 'Issue' : 'Issues'}
               value={counter.activeIssues}
               total={counter.issues}/>
      <Counter titleSecondLine={counter.changes === 1 ? 'Change' : 'Changes'}
               value={counter.changes}/>
      <Counter titleFirstLine={'Affected'}
               titleSecondLine={counter.affectedEntities === 1 ? 'Entity' : 'Entities'}
               value={counter.affectedEntities}/>
    </div>
  );
}

RecentEventsCounter.propTypes = {
  events: React.PropTypes.array,
  timeframe: timeframeShape
};


function getEventsCounter(_timeframe, events = emptyArray) {
  const counter = {
    affectedEntities: 0,
    activeIssues: 0,
    changes: 0,
    issues: 0
  };

  const affectedEntities = {};
  events.forEach(event => {
    const snapshotId = event.getIn(['problem', 'snapshotId']);
    if (snapshotId) {
      affectedEntities[snapshotId] = true;
    }

    const type = getEventType(event);
    if (type === EVENT_TYPES.ISSUE_WARNING ||
        type === EVENT_TYPES.ISSUE_CRITICAL ||
        type === EVENT_TYPES.OK) {
      counter.issues++;

      if ((!_timeframe.to && !event.get('end')) || // live mode and open
          (_timeframe.to && event.get('end') > _timeframe.to)) {
        // if the event is yet active
        counter.activeIssues++;
      }
    } else if (type === EVENT_TYPES.CHANGE) {
      counter.changes++;
    }
  });

  counter.affectedEntities = Object.keys(affectedEntities).length;

  return counter;
}

function Counter({value, titleFirstLine, titleSecondLine, total}) {
  const className = block + '__counter';

  return (
    <div className={className}>
      {total ?
        <div className={className + '__flex-wrapper'}>
          <h2 className={className + '__value'}>
            {value}
          </h2>
          <span className={className + '__total'}>
            {total + ' total'}
          </span>
        </div>
        :
        <h2 className={className + '__value'}>
          {value}
        </h2>
      }
      <p className={className + '__title'}>
        {titleFirstLine}
      </p>
      <p className={className + '__title'}>
        {titleSecondLine}
      </p>
    </div>
  );
}

Counter.propTypes = {
  value: rpt.number.isRequired,
  titleSecondLine: rpt.string,
  titleFirstLine: rpt.string,
  total: rpt.number
};
