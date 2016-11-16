import React from 'react';

import {maxEventsOnCollapsed, toggle, isExpanded$} from 'in-views/eventView/stores/populationChartExpandedStore';
import {changesAreVisible$} from 'in-views/eventView/stores/changesVisibilityStore';
import {sortedRecentEvents$} from 'in-views/eventView/stores/recentEventsStore';
import {getEventType, EVENT_TYPES} from 'in-services/issueTracker';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './ExpandChangesButton.less';


const block = 'in-event-view-expand-button';

export default connectTo({
  changesAreVisible: changesAreVisible$,
  events: sortedRecentEvents$,
  isExpanded: isExpanded$
},
function ExpandChangesButton({events, changesAreVisible, isExpanded}) {
  if (!events) {
    return null;
  }

  events = changesAreVisible
    ? events
    : events.filter(_event => getEventType(_event) !== EVENT_TYPES.CHANGE);

  if (events.length <= maxEventsOnCollapsed) {
    return null;
  }

  return (
    <Button className={block}
            onClick={toggle}
            kind='secondary'>
      {isExpanded ? 'Collapse' : `Expand (${events.length} events)`}
    </Button>
  );
});
