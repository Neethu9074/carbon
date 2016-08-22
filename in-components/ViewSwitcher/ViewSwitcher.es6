import React from 'react';

import {logicalViewLink$, physicalViewLink$, traceViewLink$, navigationParameters$} from 'in-stores/navigation';
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

        <View label='Physical'
                    href$={physicalViewLink$}
                    active={pathname.indexOf('/physical') === 0} />

        <View label={'Logical'}
                    href$={logicalViewLink$}
                    active={pathname.indexOf('/logical') === 0} />

        <View label={'Trace'}
                    href$={traceViewLink$}
                    active={pathname.indexOf('/traces') === 0} />
      </div>
    </div>
  );
});


const View = connectTo(props => {
  return {
    href: props.href$
  };
}, function View({label, href, active}) {
  let classes = block + '__item ';
  if (active) {
    classes += block + '__item__active';
  }
  return (
    <a key={label}
        className={classes}
        onClick={onViewSwitch}
        href={href}>
      {label}
    </a>
  );
});


function onViewSwitch(e) {
  e.stopPropagation();
}
