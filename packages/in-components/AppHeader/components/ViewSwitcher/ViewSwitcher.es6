import { combineLatest } from 'reactive-observables';
import React from 'react';

import {
  eventsPath,
  tracesPath,
  physicalTablePath,
  logicalPath,
  physicalPath,
  logicalTablePath,
  containerPath,
  websitePath,
  cockpitPath,
  isTableView
} from 'in-stores/navigation/paths/mainPaths';
import { cockpitEnabled, newApplicationMonitoringEnabled, analyzeEnabled } from 'in-services/featureFlags';
import { SubMenuItem } from 'in-components/AppHeader/components/ViewSwitcher/SubMenu';
import View from 'in-components/AppHeader/components/ViewSwitcher/View';
import { applicationsList } from 'in-applications/navigation/paths';
import { getView, isView } from 'in-stores/navigation/navigation';
import { openEventsAtServerTime$ } from 'in-stores/events';
import { getColorBySeverity } from 'in-stores/events';
import { analyze } from 'in-analyze/navigation/paths';
import connectTo from 'in-hoc/connectTo';

import './ViewSwitcher.less';

const block = 'in-view-switcher';

export default function ViewSwitcher() {
  return (
    <div className={block}>
      <ul className={block + '__list'}>
        {cockpitEnabled ? (
          <View label="cockpit" icon="dashboard" isActive$={isView(containerPath)} href$={getView(cockpitPath)} />
        ) : null}

        <View
          label="infrastructure"
          icon="infrastructure"
          isActive$={combine(isView(physicalPath), isView(containerPath), isTableView('physical'))}
        >
          <SubMenuItem
            label="Map"
            href$={getView(physicalPath)}
            isActive$={combine(isView(physicalPath), isView(containerPath))}
          />
          <SubMenuItem
            label="Comparison Table"
            href$={getView(physicalTablePath)}
            isActive$={isTableView('physical')}
          />
        </View>

        <View
          label="application"
          icon="application"
          isActive$={combine(isView(logicalPath), isView(tracesPath), isTableView('logical'))}
        >
          {newApplicationMonitoringEnabled ? (
            <SubMenuItem label="Application" href$={getView(applicationsList)} isActive$={isView(applicationsList)} />
          ) : null}
          <SubMenuItem label="Map" href$={getView(logicalPath)} isActive$={isView(logicalPath)} />
          <SubMenuItem label="Trace" href$={getView(tracesPath)} isActive$={isView(tracesPath)} />
          <SubMenuItem label="Comparison Table" href$={getView(logicalTablePath)} isActive$={isTableView('logical')} />
        </View>

        <View label="Websites" icon="globe" href$={getView(websitePath)} isActive$={isView(websitePath)} />

        {analyzeEnabled && <View label="Analyze" icon="traces" href$={getView(analyze)} isActive$={isView(analyze)} />}

        <IncidentsMenuPoint />
      </ul>
    </div>
  );
}

const IncidentsMenuPoint = connectTo(
  {
    events: openEventsAtServerTime$
  },
  function IncidentsMenuPoint({ events }) {
    const numIncidents = events ? events.get('incidentCount') : 0;
    const maxSeverity = events ? events.get('maxIncidentSeverity') : 0;
    let color = '#22d8d8';
    let title = 'Incidents';

    if (numIncidents > 0) {
      title = numIncidents === 1 ? `1 Incident` : `${numIncidents} Incidents`;
      color = maxSeverity > 0 ? getColorBySeverity(maxSeverity) : '#6B8088';
    }

    return (
      <View label={title} icon="danger_sign" href$={getView(eventsPath)} color={color} isActive$={isView(eventsPath)} />
    );
  }
);

function combine() {
  var args = Array.from(arguments);
  // the observable should return true, if any of the given streams returns true
  return combineLatest(args).map(values => Boolean(values.reduce((a, b) => a | b, false)));
}
