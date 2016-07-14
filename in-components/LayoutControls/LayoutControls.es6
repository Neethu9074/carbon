import React from 'react';

import {toggleLayouting, layoutingEnabled$} from 'in-map/src/stores/process/layouterStore';
import {view, types as views} from 'in-stores/view';
import connectTo from 'in-hoc/connectTo';

import 'in-components/LayoutControls/LayoutControls.less';


const block = 'in-layout-controls';

export default connectTo({
    layoutingEnabled: layoutingEnabled$,
    currentView: view
  }, LayoutControls
);

function LayoutControls({layoutingEnabled, currentView}) {
  if (!currentView || currentView !== views.process) {
    return null;
  }

  return (
    <div className={layoutingEnabled ? block : block + ' ' + block + '__disabled'}
         onClick={toggleLayouting}>

      auto
    </div>
  );
}

const rpt = React.PropTypes;
LayoutControls.propTypes = {
  layoutingEnabled: rpt.bool,
  currentView: rpt.string
};
