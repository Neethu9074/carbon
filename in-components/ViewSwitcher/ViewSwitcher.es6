import React from 'react';

import {
  logicalViewLink$,
  physicalViewLink$,
  eventsLink$,
  traceViewLink$,
  navigationParameters$
} from 'in-stores/navigation';
import {eventsInTimeframe$} from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

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

const IncidentsMenuPoint = connectTo({
  events: eventsInTimeframe$
},
({pathname, events}) => {
  const numIncidents = events ? events.incidents.length : 0;

  return (
    <View href$={eventsLink$}
          active={pathname.indexOf('/incidents') === 0}>
      <div className={`${block}__flex-wrapper`}>
        Incidents

        {numIncidents > 0 ?
          <div className={`${block}__counter`}>
            {numIncidents}
          </div>
          : null
        }
      </div>
    </View>
  );
});
