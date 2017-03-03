import React from 'react';

import {
  eventsLinkOnlyIncidents$,
  traceViewLinkWithoutEumTraces$,
  tableViewLink$,
  tableViewFilteredForServicesLink$,
  logView$
} from 'in-stores/navigation/view';
import {logicalViewLink$, physicalViewLink$, containerViewLink$, navigationParameters$} from 'in-stores/navigation';
import {SubMenuItem} from 'in-components/AppHeader/components/ViewSwitcher/SubMenu';
import {logViewEnabled, containerMapEnabled} from 'in-services/featureFlags';
import View from 'in-components/AppHeader/components/ViewSwitcher/View';
import {containsKeyword} from 'in-stores/search/keywords';
import {openEventsAtServerTime$} from 'in-stores/events';
import {query$} from 'in-stores/search/query';
import connectTo from 'in-hoc/connectTo';
import {theme} from 'in-services/theme';

import './ViewSwitcher.less';


const block = 'in-view-switcher';

export default connectTo({
  navigationParameters: navigationParameters$,
  query: query$
},
function ViewSwitcher({navigationParameters, query}) {
  const pathname = navigationParameters.pathname;

  const isTable = pathname.indexOf('/table') === 0;
  const isLogicalTable = isTable && containsKeyword(query, 'selfType', 'service');
  const isPhysicalTable = isTable && !isLogicalTable;

  return (
    <div className={block}>
      <ul className={block + '__list'}>
        <View label='infrastructure'
              icon='infrastructure'
              isActive={pathname.indexOf('/physical') === 0 || isPhysicalTable}>
          <SubMenuItem label='Host Map'
                       href$={physicalViewLink$}
                       isActive={pathname.indexOf('/physical') === 0} />
          {containerMapEnabled ?
            <SubMenuItem label='Container Map'
                         href$={containerViewLink$}
                         isActive={pathname.indexOf('/container') === 0} />
          : null}
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

        {logViewEnabled ?
          <View label='logs'
                icon='letter'
                isActive={pathname.indexOf('/logs') === 0}
                href$={logView$} />
        : null}

        <IncidentsMenuPoint isActive={pathname.indexOf('/events') === 0} />
      </ul>
    </div>
  );
});

const IncidentsMenuPoint = connectTo({
  events: openEventsAtServerTime$
},
function IncidentsMenuPoint({events, isActive}) {
  const numIncidents = events ? events.get('incidentCount') : 0;
  const maxSeverity = events ? events.get('maxIncidentSeverity') : 0;
  let color = '#22d8d8';
  let title = 'Incidents';

  if (numIncidents > 0) {
    title = numIncidents === 1 ? `1 Incident` : `${numIncidents} Incidents`;
    color = maxSeverity > 0 ? theme.health[maxSeverity] : '#6B8088';
  }

  return (
    <View label={title}
          icon='danger_sign'
          href$={eventsLinkOnlyIncidents$}
          color={color}
          isActive={isActive} />
  );
});
