import React from 'react';

import {goToPhysicalView, goToLogicalView} from 'in-stores/navigation';
import {navigationParameters$, goToTraceView} from 'in-stores/navigation';
import {isInternalEnvironment} from 'in-services/config';
import {eventBus} from 'in-map/src/services/eventBus';
import connectTo from 'in-hoc/connectTo';

import './ViewSwitcher.less';

const block = 'in-view-switcher';

export default connectTo({
    navigationParameters: navigationParameters$
  }, ViewSwitcher
);

function ViewSwitcher({navigationParameters}) {
  const pathname = navigationParameters.pathname;

  return (
    <div className={block}>
      <div className={block + '__wrapper'}>

        <View label={'Physical'}
                    onClick={() => setView(goToPhysicalView)}
                    active={pathname.indexOf('/physical') === 0} />

        {isInternalEnvironment() ?
          <View label={'Logical'}
                      onClick={() => setView(goToLogicalView)}
                      active={pathname.indexOf('/logical') === 0} />
          : null
        }

        <View label={'Trace'}
                    onClick={goToTraceView}
                    active={pathname.indexOf('/traces') === 0} />
      </div>
    </div>
  );
}

function setView(urlChanger) {
  eventBus.emit('onViewWillSwitch');
  urlChanger();
  eventBus.emit('onViewSwitched');
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
