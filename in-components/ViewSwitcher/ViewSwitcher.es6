import React from 'react';

import {
  logicalViewLink$,
  physicalViewLink$,
  eventsLink$,
  traceViewLink$,
  navigationParameters$
} from 'in-stores/navigation';
import {openEventsAtServerTime$} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';
import {theme} from 'in-services/theme';

import './ViewSwitcher.less';


const block = 'in-view-switcher';

export default connectTo({
  navigationParameters: navigationParameters$
}, function ViewSwitcher({navigationParameters}) {
  const pathname = navigationParameters.pathname;

  return (
    <div className={block}>
      <div className={block + '__wrapper'}>

        <View href$={physicalViewLink$}
              active={pathname.indexOf('/physical') === 0}>
          Physical
        </View>

        <View href$={logicalViewLink$}
              active={pathname.indexOf('/logical') === 0}>
          Logical
        </View>

        <View href$={traceViewLink$}
              active={pathname.indexOf('/traces') === 0}>
          Trace
        </View>

        {__DEV__ ? <IncidentsMenuPoint pathname={pathname} /> : null}
      </div>
    </div>
  );
});


const View = connectTo(props => {
  return {
    href: props.href$
  };
}, function View({href, active, children}) {
  let classes = block + '__item ';
  if (active) {
    classes += block + '__item__active';
  }

  return (
    <a className={classes}
       onClick={onViewSwitch}
       href={href}>
      {children}
    </a>
  );
});


function onViewSwitch(e) {
  e.stopPropagation();
}

function IncidentsMenuPoint({pathname}) {
  return (
    <View href$={eventsLink$}
          active={pathname.indexOf('/incidents') === 0}>
      <div className={`${block}__flex-wrapper`}>
        Incidents <IncidentsCounter />
      </div>
    </View>
  );
}

const IncidentsCounter = connectTo({
  events: openEventsAtServerTime$
},
({events}) => {
  const numIncidents = events ? events.incidents.length : 0;
  if (numIncidents === 0) {
    return null;
  }

  return (
    <div className={`${block}__counter`}
         style={{ background: getIncidentColor(events.incidents) }}>
      {numIncidents}
    </div>
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
