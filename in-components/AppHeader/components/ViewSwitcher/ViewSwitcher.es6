import React from 'react';

import {
  eventViewLink$,
  traceViewLink$,
  tableViewLink$,
  tableViewFilteredForServicesLink$,
  logView$,
  cockpitLink$
} from 'in-stores/navigation/view';
import { logicalViewLink$, physicalViewLink$, navigationParameters$ } from 'in-stores/navigation';
import { SubMenuItem } from 'in-components/AppHeader/components/ViewSwitcher/SubMenu';
import { logViewEnabled, cockpitEnabled } from 'in-services/featureFlags';
import View from 'in-components/AppHeader/components/ViewSwitcher/View';
import { containsKeyword } from 'in-stores/search/keywords';
import { openEventsAtServerTime$ } from 'in-stores/events';
import { query$ } from 'in-stores/search/query';
import connectTo from 'in-hoc/connectTo';
import { getHealthColorBySeverity } from 'in-services/health';

import './ViewSwitcher.less';

const block = 'in-view-switcher';

export default connectTo(
  {
    navigationParameters: navigationParameters$,
    query: query$
  },
  function ViewSwitcher({ navigationParameters, query }) {
    const pathname = navigationParameters.pathname;

    const isTable = pathname.indexOf('/table') === 0;
    const isLogicalTable = isTable && containsKeyword(query, 'entity.selfType', 'service');
    const isPhysicalTable = isTable && !isLogicalTable;
    const isPhysicalView = pathname.indexOf('/physical') === 0;
    const isContainerView = pathname.indexOf('/container') === 0;

    return (
      <div className={block}>
        <ul className={block + '__list'}>
          {cockpitEnabled
            ? <View
                label="cockpit"
                icon="dashboard"
                isActive={pathname.indexOf('/cockpit') === 0}
                href$={cockpitLink$}
              />
            : null}

          <View
            label="infrastructure"
            icon="infrastructure"
            isActive={isPhysicalView || isPhysicalTable || isContainerView}
          >
            <SubMenuItem label="Map" href$={physicalViewLink$} isActive={isPhysicalView || isContainerView} />
            <SubMenuItem label="Comparison Table" href$={tableViewLink$} isActive={isPhysicalTable} />
          </View>

          <View
            label="application"
            icon="application"
            isActive={pathname.indexOf('/logical') === 0 || pathname.indexOf('/traces') === 0 || isLogicalTable}
          >
            <SubMenuItem label="Map" href$={logicalViewLink$} isActive={pathname.indexOf('/logical') === 0} />
            <SubMenuItem label="Trace" href$={traceViewLink$} isActive={pathname.indexOf('/traces') === 0} />
            <SubMenuItem label="Comparison Table" href$={tableViewFilteredForServicesLink$} isActive={isLogicalTable} />
          </View>

          {logViewEnabled
            ? <View label="logs" icon="letter" isActive={pathname.indexOf('/logs') === 0} href$={logView$} />
            : null}

          <IncidentsMenuPoint isActive={pathname.indexOf('/events') === 0} />
        </ul>
      </div>
    );
  }
);

const IncidentsMenuPoint = connectTo(
  {
    events: openEventsAtServerTime$
  },
  function IncidentsMenuPoint({ events, isActive }) {
    const numIncidents = events ? events.get('incidentCount') : 0;
    const maxSeverity = events ? events.get('maxIncidentSeverity') : 0;
    let color = '#22d8d8';
    let title = 'Incidents';

    if (numIncidents > 0) {
      title = numIncidents === 1 ? `1 Incident` : `${numIncidents} Incidents`;
      color = maxSeverity > 0 ? getHealthColorBySeverity(maxSeverity) : '#6B8088';
    }

    return <View label={title} icon="danger_sign" href$={eventViewLink$} color={color} isActive={isActive} />;
  }
);
