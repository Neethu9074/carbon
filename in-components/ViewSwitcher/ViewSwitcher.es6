import React from 'react';

import {navigationParameters$, goToTraceView, goToMap} from 'in-stores/navigation';
import {isInternalEnvironment} from 'in-services/config';
import {eventBus} from 'in-map/src/services/eventBus';
import {types as views} from 'in-stores/view';
import * as viewStore from 'in-stores/view';
import connectTo from 'in-hoc/connectTo';

import './ViewSwitcher.less';

const block = 'in-view-switcher';

export default connectTo({
    activeView: viewStore.view,
    navigationParameters: navigationParameters$
  }, ViewSwitcher
);

function ViewSwitcher({navigationParameters, activeView}) {
  const pathname = navigationParameters.pathname;

  return (
    <div className={block}>
      <div className={block + '__wrapper'}>

        <View label={'Physical'}
                    onClick={() => setView(views.physical)}
                    active={pathname === '/' && activeView === views.physical} />

        {isInternalEnvironment() ?
          <View label={'Logical'}
                      onClick={() => setView(views.process)}
                      active={pathname === '/' && activeView === views.process} />
          : null
        }

        <View label={'Trace'}
                    onClick={goToTraceView}
                    active={pathname === '/traces'} />
      </div>
    </div>
  );
}

const rpt = React.PropTypes;
ViewSwitcher.propTypes = {
  navigationParameters: rpt.object.isRequired,
  activeView: rpt.string.isRequired
};

function setView(view) {
  eventBus.emit('onViewWillSwitch');
  viewStore.setView(view);
  eventBus.emit('onViewSwitched');
  goToMap();
}

function View({label, onClick, active}) {
  let classes = block + '__item ';
  if (active) {
    classes += block + '__item__active';
  }
  return (
    <div key={label}
        className={classes}
        onClick={onClick}>
      {label}
    </div>
  );
}
