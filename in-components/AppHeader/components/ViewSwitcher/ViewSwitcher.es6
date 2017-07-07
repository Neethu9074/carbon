import { combineLatest } from 'reactive-observables';
import React from 'react';

import {
  eventViewLink$,
  traceViewLink$,
  tableViewLink$,
  eumViewLink$,
  tableViewFilteredForServicesLink$,
  logView$,
  cockpitLink$
} from 'in-stores/navigation/view';
import { logicalViewLink$, physicalViewLink$, navigationParameters$ } from 'in-stores/navigation';
import { logViewEnabled, eumViewEnabled, cockpitEnabled } from 'in-services/featureFlags';
import { SubMenuItem } from 'in-components/AppHeader/components/ViewSwitcher/SubMenu';
import View from 'in-components/AppHeader/components/ViewSwitcher/View';
import { containsKeyword } from 'in-stores/search/keywords';
import { openEventsAtServerTime$ } from 'in-stores/events';
import { getColorBySeverity } from 'in-stores/events';
import { query$ } from 'in-stores/search/query';
import connectTo from 'in-hoc/connectTo';

import './ViewSwitcher.less';

const block = 'in-view-switcher';

export default connectTo(
  {
    viewActiveState: combineLatest([
      navigationParameters$,
      query$.map(query => containsKeyword(query, 'entity.selfType', 'service')).distinct()
    ]).map(([navigationParameters, containsServiceKeywords]) => {
      const pathname = navigationParameters.pathname;

      const isTableView = pathname.indexOf('/table') === 0;
      const isLogicalTable = isTableView && containsServiceKeywords;
      const isTraceView = pathname.indexOf('/traces/search') === 0;
      const isLogicalView = pathname.indexOf('/logical') === 0;
      const isPhysicalTable = isTableView && !isLogicalTable;
      const isPhysicalView = pathname.indexOf('/physical') === 0;
      const isContainerView = pathname.indexOf('/container') === 0;
      const isEventView = pathname.indexOf('/events') === 0;
      const isLogsView = pathname.indexOf('/logs') === 0;
      const isEumView = pathname.indexOf('/eum') === 0;

      return {
        isLogicalTable,
        isTraceView,
        isLogicalView,
        isPhysicalTable,
        isPhysicalView,
        isContainerView,
        isEventView,
        isLogsView,
        isEumView
      };
    })
  },
  class extends React.Component {
    static displayName = 'ViewSwitcher';

    shouldComponentUpdate(nextProps) {
      const viewActiveState = this.props.viewActiveState;
      const nextViewActiveState = nextProps.viewActiveState;
      return (
        viewActiveState.isLogicalTable !== nextViewActiveState.isLogicalTable ||
        viewActiveState.isTraceView !== nextViewActiveState.isTraceView ||
        viewActiveState.isLogicalView !== nextViewActiveState.isLogicalView ||
        viewActiveState.isPhysicalTable !== nextViewActiveState.isPhysicalTable ||
        viewActiveState.isPhysicalView !== nextViewActiveState.isPhysicalView ||
        viewActiveState.isContainerView !== nextViewActiveState.isContainerView ||
        viewActiveState.isEventView !== nextViewActiveState.isEventView ||
        viewActiveState.isLogsView !== nextViewActiveState.isLogsView ||
        viewActiveState.isEumView !== nextViewActiveState.isEumView
      );
    }

    render() {
      const { viewActiveState } = this.props;

      const {
        isLogicalTable,
        isTraceView,
        isLogicalView,
        isPhysicalTable,
        isPhysicalView,
        isContainerView,
        isEventView,
        isLogsView,
        isEumView
      } = viewActiveState;

      return (
        <div className={block}>
          <ul className={block + '__list'}>
            {cockpitEnabled
              ? <View label="cockpit" icon="dashboard" isActive={isContainerView} href$={cockpitLink$} />
              : null}

            <View
              label="infrastructure"
              icon="infrastructure"
              isActive={isPhysicalView || isPhysicalTable || isContainerView}
            >
              <SubMenuItem label="Map" href$={physicalViewLink$} isActive={isPhysicalView || isContainerView} />
              <SubMenuItem label="Comparison Table" href$={tableViewLink$} isActive={isPhysicalTable} />
            </View>

            <View label="application" icon="application" isActive={isLogicalView || isTraceView || isLogicalTable}>
              <SubMenuItem label="Map" href$={logicalViewLink$} isActive={isLogicalView} />
              <SubMenuItem label="Trace" href$={traceViewLink$} isActive={isTraceView} />
              {eumViewEnabled
                ? <SubMenuItem label="End User Monitoring" href$={eumViewLink$} isActive={isEumView} />
                : null}
              <SubMenuItem
                label="Comparison Table"
                href$={tableViewFilteredForServicesLink$}
                isActive={isLogicalTable}
              />
            </View>

            {logViewEnabled ? <View label="logs" icon="letter" isActive={isLogsView} href$={logView$} /> : null}

            <IncidentsMenuPoint isActive={isEventView} />
          </ul>
        </div>
      );
    }
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
      color = maxSeverity > 0 ? getColorBySeverity(maxSeverity) : '#6B8088';
    }

    return <View label={title} icon="danger_sign" href$={eventViewLink$} color={color} isActive={isActive} />;
  }
);
