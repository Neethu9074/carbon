import React from 'react';

import {
  eventsLinkOnlyIncidents$,
  traceViewLinkWithoutEumTraces$,
  tableViewLink$,
  tableViewFilteredForServicesLink$
} from 'in-stores/navigation/view';
import {logicalViewLink$, physicalViewLink$, navigationParameters$} from 'in-stores/navigation';
import {SubMenuItem} from 'in-components/AppHeader/components/ViewSwitcher/SubMenu';
import View from 'in-components/AppHeader/components/ViewSwitcher/View';
import {containsTypeFilter} from 'in-stores/search/type';
import {openEventsAtServerTime$} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';
import {theme} from 'in-services/theme';

import './ViewSwitcher.less';


const block = 'in-view-switcher';

export default connectTo({
  navigationParameters: navigationParameters$
},
function ViewSwitcher({navigationParameters}) {
  const pathname = navigationParameters.pathname;

  const isTable = pathname.indexOf('/table') === 0;
  const isLogicalTable = isTable && containsTypeFilter(decodeURIComponent(navigationParameters.query.q), 'service');
  const isPhysicalTable = isTable && !isLogicalTable;

  return (
    <div className={block}>
      <ul className={block + '__list'}>
        <View label='infrastructure'
              icon='infrastructure'
              isActive={pathname.indexOf('/physical') === 0 || isPhysicalTable}>
          <SubMenuItem label='Map'
                       href$={physicalViewLink$}
                       isActive={pathname.indexOf('/physical') === 0} />
          <SubMenuItem label='Comparison Table'
                       href$={tableViewLink$}
                       isActive={isPhysicalTable} />
        </View>

        <View label='application'
              icon='application'
              isActive={pathname.indexOf('/logical') === 0 || pathname.indexOf('/traces') === 0 || isLogicalTable}>
          <SubMenuItem label='Map'
                       href$={logicalViewLink$}
                       isActive={pathname.indexOf('/logical') === 0} />
          <SubMenuItem label='Trace'
                       href$={traceViewLinkWithoutEumTraces$}
                       isActive={pathname.indexOf('/traces') === 0} />
          <SubMenuItem label='Comparison Table'
                       href$={tableViewFilteredForServicesLink$}
                       isActive={isLogicalTable} />
        </View>

        <IncidentsMenuPoint isActive={pathname.indexOf('/events') === 0} />
      </ul>
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
