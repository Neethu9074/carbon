import React from 'react';

import {
  traceViewLinkWithoutEumTraces$,
  eventsLinkOnlyIncidents$
} from 'in-stores/navigation/view';
import {
  logicalViewLink$,
  physicalViewLink$,
  navigationParameters$
} from 'in-stores/navigation';
import {openEventsAtServerTime$} from 'in-stores/events';
import SvgIcon from 'in-components/SvgIcon';
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
              iconType='infrastructure'
              active={pathname.indexOf('/physical') === 0 || pathname.indexOf('/table') === 0}>
          Physical
        </View>

        <View href$={logicalViewLink$}
              iconType='application'
              active={pathname.indexOf('/logical') === 0}>
          Logical
        </View>

        <View href$={traceViewLinkWithoutEumTraces$}
              iconType='traces'
              active={pathname.indexOf('/traces') === 0}>
          Trace
        </View>

        <IncidentsMenuPoint pathname={pathname} />
      </div>
    </div>
  );
});


const View = connectTo(props => {
  return {
    href: props.href$
  };
}, function View({href, active, children, iconType, color}) {
  let classes = block + '__item ';
  if (active) {
    classes += block + '__item__active';
  }

  return (
    <a className={classes}
       onClick={onViewSwitch}
       href={href}>

      <SvgIcon className={`${block}__icon`}
               type={iconType}
               width={22}
               height={22}
               color={color || '#22d8d8'} />
      {children}
    </a>
  );
});


function onViewSwitch(e) {
  e.stopPropagation();
}

const IncidentsMenuPoint = connectTo({
  events: openEventsAtServerTime$
},
function IncidentsMenuPoint({pathname, events}) {
  const numIncidents = events ? events.incidents.length : 0;
  let color = '#22d8d8';
  let title = 'Incidents';

  if (numIncidents > 0) {
    title = numIncidents === 1 ? `1 Incident` : `${numIncidents} Incidents`;
    color = getIncidentColor(events.incidents);
  }

  return (
    <View href$={eventsLinkOnlyIncidents$}
          iconType='danger_sign'
          color={color}
          active={pathname.indexOf('/events') === 0}>
      <div className={`${block}__flex-wrapper`}>
        {title}
      </div>
    </View>
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
