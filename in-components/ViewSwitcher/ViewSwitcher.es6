import React from 'react';

import {eventsLinkOnlyIncidents$, traceViewLinkWithoutEumTraces$} from 'in-stores/navigation/view';
import {logicalViewLink$, physicalViewLink$, navigationParameters$} from 'in-stores/navigation';
import {expandedView$} from 'in-components/ViewSwitcher/stores/expandedViewStore';
import {SubMenuItem} from 'in-components/ViewSwitcher/SubMenu';
import {openEventsAtServerTime$} from 'in-stores/events';
import View from 'in-components/ViewSwitcher/View';
import connectTo from 'in-hoc/connectTo';
import {theme} from 'in-services/theme';

import './ViewSwitcher.less';


const block = 'in-view-switcher';

export default connectTo({
  navigationParameters: navigationParameters$,
  expandedView: expandedView$
},
function ViewSwitcher({navigationParameters, expandedView}) {
  const pathname = navigationParameters.pathname;

  return (
    <div className={block}>
      <div className={block + '__wrapper'}>
        <View label='infrastructure'
              icon='infrastructure'
              isExpanded={expandedView === 'infrastructure'}
              isActive={pathname.indexOf('/physical') === 0 || pathname.indexOf('/table') === 0}>
          <SubMenuItem label='Map'
                       href$={physicalViewLink$}
                       isActive={pathname.indexOf('/physical') === 0} />
          <SubMenuItem label='Overview'
                       href$={physicalViewLink$}
                       isActive={pathname.indexOf('/table') === 0} />
        </View>

        <View label='application'
              icon='application'
              isExpanded={expandedView === 'application'}
              isActive={pathname.indexOf('/logical') === 0 || pathname.indexOf('/traces') === 0}>
          <SubMenuItem label='Map'
                       href$={logicalViewLink$}
                       isActive={pathname.indexOf('/logical') === 0} />
          <SubMenuItem label='Trace'
                       href$={traceViewLinkWithoutEumTraces$}
                       isActive={pathname.indexOf('/traces') === 0} />
          <SubMenuItem label='Overview'
                       href$={physicalViewLink$} />
        </View>

        <IncidentsMenuPoint isActive={pathname.indexOf('/events') === 0} />
      </div>
    </div>
  );
});

const IncidentsMenuPoint = connectTo({
  events: openEventsAtServerTime$
},
function IncidentsMenuPoint({events, isActive}) {
  const numIncidents = events ? events.incidents.length : 0;
  let color = '#22d8d8';
  let title = 'Incidents';

  if (numIncidents > 0) {
    title = numIncidents === 1 ? `1 Incident` : `${numIncidents} Incidents`;
    color = getIncidentColor(events.incidents);
  }

  return (
    <View label={title}
          icon='danger_sign'
          href$={eventsLinkOnlyIncidents$}
          color={color}
          isActive={isActive} />
  );
});

function getIncidentColor(events) {
  let maxSeverity = 0;
  events.forEach(event => {
    const severity = event.getIn(['problem', 'severity'], 0);
    if (severity > maxSeverity) {
      maxSeverity = severity;
    }
  });
  return maxSeverity > 0 ? theme.health[maxSeverity] : '#6B8088';
}
