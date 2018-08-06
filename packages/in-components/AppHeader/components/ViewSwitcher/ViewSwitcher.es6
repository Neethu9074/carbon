import { combineLatest } from 'reactive-observables';
import { pure } from 'recompose';
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
import { cockpitEnabled, previewTwoZeroWithoutHybrid, twoZeroModeEnabled } from 'in-services/featureFlags';
import { applicationsList, isApplicationsView } from 'in-applications/navigation/paths';
import { SubMenuItem } from 'in-components/AppHeader/components/ViewSwitcher/SubMenu';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { getLinkToAnalyze, isAnalyzeView } from 'in-analyze/navigation/paths';
import View from 'in-components/AppHeader/components/ViewSwitcher/View';
import { getView, isView } from 'in-stores/navigation/navigation';
import { openEventsAtServerTime$ } from 'in-stores/events';
import { getColorBySeverity } from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

import './ViewSwitcher.less';

const block = 'in-view-switcher';

export default pure(function ViewSwitcher() {
  return (
    <div className={block}>
      <ul className={block + '__list'}>
        {cockpitEnabled ? (
          <View label="cockpit" icon="dashboard" isActive$={isView(containerPath)} href$={getView(cockpitPath)} />
        ) : null}

        <View
          label="infrastructure"
          icon="lib_infrastructure_inverted"
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

        {!twoZeroModeEnabled && (
          <View
            label="application"
            icon="lib_application_invert"
            isActive$={combine(isView(logicalPath), isView(tracesPath), isTableView('logical'))}
          >
            <SubMenuItem label="Map" href$={getView(logicalPath)} isActive$={isView(logicalPath)} />
            <SubMenuItem label="Trace" href$={getView(tracesPath)} isActive$={isView(tracesPath)} />
            <SubMenuItem
              label="Comparison Table"
              href$={getView(logicalTablePath)}
              isActive$={isTableView('logical')}
            />
          </View>
        )}

        {twoZeroModeEnabled && (
          <View
            label="application"
            icon="lib_application_invert"
            isActive$={isView(isApplicationsView)}
            href$={getView(applicationsList)}
          />
        )}

        <View
          label="Websites"
          icon="lib_website_inverted"
          href$={getView(websitePath)}
          isActive$={isView(websitePath)}
        />

        {!previewTwoZeroWithoutHybrid && <IncidentsMenuPoint />}

        {twoZeroModeEnabled && (
          <View
            label="Analyze"
            icon="lib_analyze_inverted"
            isActive$={isView(isAnalyzeView)}
            href$={getLinkToAnalyze()}
          />
        )}
      </ul>
    </div>
  );
});

const IncidentsMenuPoint = connectTo(
  {
    events: openEventsAtServerTime$
  },
  function IncidentsMenuPoint({ events }) {
    const numIncidents = events ? events.get('incidentCount') : 0;
    const maxSeverity = events ? events.get('maxIncidentSeverity') : 0;

    let color;
    if (numIncidents > 0) {
      color = maxSeverity > 0 ? getColorBySeverity(maxSeverity) : '#6B8088';
    }

    return (
      <div className={`${block}__incident-menu`}>
        <View
          label={numIncidents > 0 ? `${numIncidents} Incident${numIncidents > 1 ? 's' : ''}` : 'Incidents'}
          icon="lib_events_inverted"
          href$={getEventsViewFilteredBy({ eventTypeFilter: 'incident' })}
          color={color}
          isActive$={isView(eventsPath)}
        />
      </div>
    );
  }
);

function combine() {
  var args = Array.from(arguments);
  // the observable should return true, if any of the given streams returns true
  return combineLatest(args).map(values => Boolean(values.reduce((a, b) => a | b, false)));
}
